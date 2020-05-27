# CardsAwayFromHumanity

This repository contains a month-long fever-induced stream of conciousness projected into a typescript codebase I like to call "Cards Away From Humanity". It is an online multiplayer version of Cards Against Humanity playable on your phone, and over video chat.

I initially planned for this project to be a slightly bigger scope, sadly things happened towards the end of development that led to be eventually ramping down progress and turning off features enough to call it a day (See the `scopeChange` branch). 

The game is playable at https://cafh.herokuapp.com/ - It's hosted on a free instance, so it may take up to a minute to load the first time if it's sleeping. Once it's running, you can invite friends and play!


## Use as a framework

The server code is designed to be reused for other game types. Simply provide your own class implementing the `Game` protocol, and the rest of the codebase will handle player authentication, room management, horizontal scaling, and more. See `CAFHGame.ts` for a messy yet surprisingly functional implementation of this game's logic.

## Deploying

This repository is built to be deployed on Heroku, with a heroku-redis addon to handle multiple servers. It's set up to be deployed from Github, so simply clone this repo and deploy it onto an instance with redis.

## Dev notes


- Putting client and server in the same repo was a terrible idea, I knew it was, I still did it, and it became a pretty big pain point during deployment. Originally I planned one repo but two separate deplyment pipelines (one client, one server) which kinda made sense for performance reasons although I decided to just not worry about that since this is only a temporary side project.

- Typescript ended up being a bit of an issue with vue, as I did not plan for vuex to cause as many `as any` casts. Since my goal was to go fast and the store itself is very small I skipped rewriting a strongly-typed store which would probably have been a good idea.

- Originally, this repo was designed to run on Google Cloud Engine; but it turned out that websocket connection became extremely unreliable when scaling beyond a single instance. I switched to Heroku pretty late in the process, which means that I had to account for the deployment differences such as not being able to deploy from the server folder. That's why there is a weird `package.json` in the root.

- Safari is surprisingly buggy, especially when testing. Lots of messages are being dropped which would probably require some more state redundency to make the game more reliable. I think it has to do with it going into energy saving mode when not focused (which happens a lot when I test things).
