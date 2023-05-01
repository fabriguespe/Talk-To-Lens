## Talk To Lens

This plugins interprets requests to the lens database and transforms text to sql queries for later retrieval in GPT.

### Prerequisites

This app has no user interface, instead it's meant to use with GhatGPT's UI so therefore you must have access to ChatGPT plugins, which at the moment are still in beta.

### Project setup

1. Clone the repo, install depdendencies:

```sh
git clone git@github.com:fabriguespe/Lens-DB-Natural-Language.git

cd Lens-DB-Natural-Language

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

### Usage

Tested questions you can play with

```sh
get me 20 random posts of lens and display them as a table
query all posts from fabri.lens and order them by engagement
get me the top post of today
who is fabri.lens
get me cool posts from fabri.lens
from which lens application fabri.lens posts the most
list all lens applications ranked by popularity
which date was created the post with most engagegemnt.
# or anything like that
```

Prompts that doest work because of complexity or scale

```sh

get me all the post of the last 30 days
# or anything like that
```

### Prompt

> The plugin uses the following engineered prompt. Currently the table schema uses 3 tables. This tables are enough for querying content, profiles, dates and engagememnt. Collects are mirrored are excluded in this MVP.

[PROMPT](/PROMPT.md)
