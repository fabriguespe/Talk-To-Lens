import { BigQuery } from '@google-cloud/bigquery'
const keyFilename = './keyfile.json'
const fs = require('fs')
const path = require('path')
const context = fs.readFileSync(path.resolve('', './PROMPT.md'), 'utf8')
const openaikey = fs.readFileSync(path.resolve('', './openaikey.json'), 'utf8')

import { NextResponse, NextRequest } from "next/server";
const { Configuration, OpenAIApi } = require("openai");


function extractCodeBlocks(text:string) {
  // Define a regular expression to match code blocks enclosed by triple backticks
  const regex = /```([\s\S]*?)```/g;

  // Initialize an array to store the extracted code blocks
  const codeBlocks = [];

  // Use the RegExp.exec() method to find all matches in the input text
  let match;
  while ((match = regex.exec(text)) !== null) {
    // The first capturing group contains the content between the triple backticks
    const codeBlock = match[1];
    codeBlocks.push(codeBlock);
  }

  return codeBlocks[0]?codeBlocks[0].toString():text;
}

async function texttosql(question: String){
  const configuration = new Configuration({ apiKey: JSON.parse(openaikey).key });
  delete configuration.baseOptions.headers['User-Agent'];
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages:[
      {"role": "system", "content": context},
      {"role": "user", "content":question }
    ]
  });

  let msg=completion.data.choices[0].message
  return msg

}

function timeout(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Operation timed out'));
    }, ms);
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  let rows_string=''
  let query_sql=''
  let question=body.question
  //try for 10 seconds only
  try{

    console.log('question:',question)
    const sql=await texttosql(question)
    query_sql=extractCodeBlocks(sql.content)
    console.log('sql:',query_sql)
    const client = new BigQuery({ keyFilename})
    const options = { query: query_sql,location: 'US', }
  
    const rows = await Promise.race([await client.query(options), timeout(5000)]);
   

    rows_string=JSON.stringify(rows)
    if(rows_string.length>50000)throw new Error('Too long')
    console.log('rows:', rows_string);

  }catch(error: any){
    return NextResponse.json(
      {
        sql:query_sql,
        error:error.message,
        question:question,
        length:rows_string.length

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
      rows:rows_string,
      sql:JSON.stringify(query_sql),
      question:JSON.stringify(question),
      length:rows_string.length
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