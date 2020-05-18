# CardsAwayFromHumanity - Server

## Running locally

- Make sure Redis is running
- `$ npm run dev`
- Use a local dev version of the client.

## Deploying to GCP

- Make sure you have your app.yaml set up with Redis info
- Make sure you have the GCP tools set up
- `$ npm run deploy`

This command will build the front end, and package it all up, then deploy on flexible instances.