import { BigQuery } from '@google-cloud/bigquery'
const keyFilename = './keyfile.json'
const client = new BigQuery({ keyFilename })
const fs = require('fs')
const path = require('path')
const context = fs.readFileSync(path.resolve('', './PROMPT.md'), 'utf8')
const openaikey = fs.readFileSync(path.resolve('', './openaikey.json'), 'utf8')
import { NextResponse, NextRequest } from "next/server";
const { Configuration, OpenAIApi } = require("openai");


function extractCodeBlocks(text: string) {
  // Define a regular expression to match code blocks enclosed by triple backticks
  const regex = /```([\s\S]*?)```/g;
  // Initialize an array to store the extracted code blocks
  const codeBlocks = []

  // Use the RegExp.exec() method to find all matches in the input text
  let match;
  while ((match = regex.exec(text)) !== null) {
    // The first capturing group contains the content between the triple backticks
    const codeBlock = match[1];
    codeBlocks.push(codeBlock);
  }

  return codeBlocks[0] ? codeBlocks[0].toString() : text;
}

async function texttosql(question: String) {
  const configuration = new Configuration({ apiKey: JSON.parse(openaikey).key });
  delete configuration.baseOptions.headers['User-Agent'];
  const openai = new OpenAIApi(configuration);

  /*const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: context + "\n\nQuestion: " + question
  });
  
  //let msg = response.data.choices[0].text*/
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages:[
      {"role": "system", "content": context},
      {"role": "user", "content":question }
    ]
  });
  let msg=response.data.choices[0].message.content
  return msg

}
async function  escapeJson(json: string) {
  return json.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
}
//function that receives array and returns fewer objects if the total lenght as a string is higher that the length parameter
function truncateJson(json_array: any , length: number) {
  let json_string = ''
  let i = 0
  while (json_string.length < length) {
    json_string = json_string + JSON.stringify(json_array[i])
    i++
  }
  return json_string
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  let rows_string = ''
  let query_sql = ''
  let question = body.question
  let explanation_sql =''
  try {
    //Log the question
    console.log('question:', question)
    //Convert question to sql
    const sql = await texttosql(question)
    //Exctract the sql code block in the response
    query_sql = extractCodeBlocks(sql)
    explanation_sql = sql.replace(query_sql, '')
    //Log the sql code block
    console.log('sql:', query_sql.trim())
    const options = { query: query_sql, location: 'US', }
    // Run the query in bigquery
    const rows = await client.query(options)
    rows_string = (JSON.stringify(rows[0]))
    const length=10000
    //Check if response is too long
    if (rows_string.length > length){
      rows_string = truncateJson(rows[0],length)
      console.log('rows_truncated',rows_string.length)
    }else{
      console.log('rows',rows[0])
      console.log('rows',rows[0].length,rows_string.length)

    }
    //escapes json characters
    rows_string = await escapeJson(rows_string)
    
  } catch (error: any) {
    return NextResponse.json(
      {
        sql: query_sql,
        explanation: explanation_sql,
        error: error.message,
        question: question,
        length: rows_string.length

      },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "https://chat.openai.com",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, openai-ephemeral-user-id, openai-conversation-id",
        },
      }
    );
  }

  return NextResponse.json(
    {
      rows: rows_string,
      sql: JSON.stringify(query_sql),
      explanation: explanation_sql,
      question: JSON.stringify(question),
      length: rows_string.length
    },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://chat.openai.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, openai-ephemeral-user-id, openai-conversation-id",
      },
    }
  );
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://chat.openai.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, openai-ephemeral-user-id, openai-conversation-id",
      },
    }
  );
}