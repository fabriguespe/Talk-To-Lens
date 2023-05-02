## Talk To Lens

This plugins interprets requests to the lens database and transforms text to sql queries for later retrieval in GPT.

### Prerequisites

This app has no user interface, instead it's meant to use with GhatGPT's UI so therefore you must have access to ChatGPT plugins, which at the moment are still in beta.

### Project setup

1. Clone the repo, install depdendencies:

```sh
git clone git@github.com:fabriguespe/Talk-To-Lens.git

cd Talk-To-Lens

yarn # or npm install, pnpm
```

2. Run the server

```sh
npm run build
# if you modify the yaml file you have to re build
npm start
```

3. Set up your GPT Plugin in the ChatGPT Plugin UI.

When prompted for your website domain, type in 'http://localhost:3000'

4. Export the keyfile from bigquery and save it as keyfile.json in the root of the project.

5. Create a openaikey.json 
```
{
  "key": "OPENAI KEY"
}
```

### Usage

Tested prompts you can try and mix.

```sh
get me the top post of today
Who is the most popular user on Lenster based on engaged posts
Get me 1 cool post from each of the top 3 apps
Get me details on the user 1234.lens
From which lens application stani.lens posts the most
List the top 10 lens applications ranked by popularity
Who commented on the post with id 0x01-0x01c5.
Who is the user with more comments made to lensprotocol.lens.
What are the hours of more engagement in lens. Ranked by popularity.
Find 5 posts where Messi is mentioned. Rank them by popularity
```

### Prompt

> The plugin uses the following engineered prompt. This tables are enough for querying content, profiles, followers, comments, hashtags, dates, apps and reactions. Collect data is excluded in this MVP.

[PROMPT](/PROMPT.md)

### Playground

For a more advance and fast way to test the prompts you can copy paste the [PROMPT](/PROMPT.md) description into the openai playground.

[Playground](https://platform.openai.com/playground?mode=chat)

### Pre prompting

Pre prompting the plugin interaction can be a good way of defining goals and expectations.

```
I'm about to begin using the Talk to Lens plugin. Please keep the following points in mind for the result of the plugin:

- Display the interpreted question
- Always return data in table format, if possible.
- If the data can be represented as a line chart, bar chart, or pie chart, please provide the Python code for creating the corresponding plot. If not, dont mention it.
- Always display and explain the query used
```

### Queries used while building the schema prompt

```
SELECT table_name
FROM `lens-public-data.polygon.INFORMATION_SCHEMA.TABLES`
```

```
SELECT
  t.table_name AS table_name,
FROM
  `lens-public-data.mumbai.INFORMATION_SCHEMA.TABLES` AS t
JOIN
  `lens-public-data.mumbai.INFORMATION_SCHEMA.COLUMNS` AS c
ON
  t.table_name = c.table_name
ORDER BY
  t.table_name,
  c.ordinal_position;

```

### Constrains
Because some queries can be longer than the token limit, the plugin will return a message saying that the query is too long and will provide the query as a reference and return less results.

### Refining
As a proof of concept this was not tested rigorously, but it's a good starting point for a more robust plugin. Next steps would be to experiment with embeddings and trainning the model with example queries. Same query may run unsuccesfully some times but successfully when run again or i would get many network errores on large responses. Im still trying to figure out a more robust plugin response that can handle all cases.

### Resources
Based on the following resources:

[OpanAI Plugin Docs](https://platform.openai.com/docs/plugins/introduction)

[nextjs-chatgpt-plugin-starter](https://github.com/dabit3/nextjs-chatgpt-plugin-starter) by [dabit3](https://github.com/dabit3)

[lens-bigquery-with-node.js](https://github.com/dabit3/lens-bigquery-with-node.js) by [dabit3](https://github.com/dabit3)

[Lens BigQuery Docs](https://docs.lens.xyz/docs/public-big-query)
