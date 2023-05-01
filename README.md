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
get me 20 random posts of lens
query all posts from fabri.lens and order them by engagement
get me the top post of today
Who is the most popular user on Lenster based on engaged posts
Who is the user fabri.lens
Show me a random post from Lenster
Get me cool posts from fabri.lens
From which lens application stani.lens posts the most
List all lens applications ranked by popularity
Get the followers in common between fabri.lens and stani.lens
Who commented on the post with id 0x01-0x01c5.
Who is the user with more comments made to fabri.lens.
Who is the user with more likes made to fabri.lens.
Which date was created the post with most engagement.
```

Prompts that does't work because of complexity or scale

```sh

get me all the post of the last 30 days
# or anything like that
```

### Prompt

> The plugin uses the following engineered prompt. This tables are enough for querying content, profiles, followers, dates and engagememnt (based on reactions). Collect data is excluded in this MVP.

[PROMPT](/PROMPT.md)

### Playground

For a more advance and fast way to test the prompts you can copy past the PROMPT.md description into the openai playground.

[Playground](https://platform.openai.com/playground?mode=chat)

### Pre prompting

Pre prompting the plugin interaction can be a good way of defining goals and expectations.

```
I'm about to begin using the Talk to Lens plugin. Please keep the following points in mind for the result of the plugin:

- Display the interpreted question
- Always return data in table format, if possible.
- If the data can be represented as a line chart, bar chart, or pie chart, please provide the Python code for creating the corresponding plot. If not, dont mention it.
- If the lenght of the response is less than 4000 display the SQL query used to retrieve the data as a reference.
- If the lenght of the response is less than 4000 Display the query explanation
```