# Dev.to Follow✍️

A little confused who's user to follow in dev.to for your newsletter?

This project uses an LLM to summarize and generate an insight about a user's post topics. Also, it can provide an insight about the user's posts and relevance to your prefereed topics, making it easy to choose which user's to follow for your blog feed. This project uses two models,

- `@cf/facebook/bart-large-cnn` to summarize the post content
- `@hf/mistral/mistral-7b-instruct-v0.2` to paraphrase the post summaries and to generate post relevancy

Try here: https://devtofollow.pages.dev/

## Requirements

- Node v20.12.0
- npm v10.5.0
- Wrangler v3.0.0 or newer

## Tech Stack

- Vite
- React
- Mantine
- CloudFlare services used: Pages, Workers AI

## Deployment

```bash
# clone the repo
git clone https://github.com/fahminlb33/devtofollow.git

# change working directory
cd devtofollow

# install dependencies
npm install

# build repo
npm run build

# deploy to CloudFlare Pages
npm run deploy
```

After the site has been deployed, add Worker AI binding to the Pages instance.

1. Login to CloudFlare Dashboard.
2. Workers & Pages > storyflare > Settings > Functions
3. On **Workers AI Bindings**, click `Add Binding`
4. Set the `Variable name` as "AI"
5. Save and test your app
