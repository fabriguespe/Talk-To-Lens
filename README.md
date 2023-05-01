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
get me 20 random posts of lens and display them as a table
query all posts from fabri.lens and order them by engagement
get me the top post of today
who is the most popular user on Lenster based on engaged posts
who is fabri.lens
who is the most followed user
show me a random post from Lenster
get me cool posts from fabri.lens
from which lens application fabri.lens posts the most
list all lens applications ranked by popularity
which date was created the post with most engagegemnt.
get the followers in common between fabri.lens and stani.lens
who is the most popular in lens
who comments on the following post
who is the user with more comments made to fabri.lens

1. Retrieve 20 random posts from Lens and display them as a table.
2. Query all posts from fabri.lens and order them by engagement.
3. Retrieve the top post of today.
4. Who is the most popular user on Lenster based on engaged posts?
5. Who is fabri.lens?
6. Who is the most followed user?
7. Show me a random post from Lenster.
8. Retrieve cool posts from fabri.lens.
9. From which Lens application does fabri.lens post the most?
10. List all Lens applications ranked by popularity.
11. On which date was the post with the most engagement created?
12. Get the followers in common between fabri.lens and stani.lens.
13. Who is the most popular user on Lens?
14. Who comments on the following post?
15. Who is the user with the most comments made to fabri.lens?
# or anything like that
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
I'm about to begin using the Talk to Lens plugin. Please keep the following points in mind:

- Always return data in table format, if possible.
- If the data can be represented as a line chart, bar chart, or pie chart, please provide the Python code for creating the corresponding plot.
- Always display the SQL query used to retrieve the data as a reference.
```