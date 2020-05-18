# CardsAwayFromHumanity

## Deploying

This repository is built to be deployed on Heroku, with a heroku-redis addon to handle multiple servers. 

## Dev notes

- Putting client and server in the same repo was a terrible idea, I knew it was, I still did it, and it became a pretty big pain point during deployment. Originally I planned one repo but two separate deplyment pipelines (one client, one server) which kinda made sense for performance reasons although I decided to just not worry about that since this is only a temporary side project.

- Typescript ended up being a bit of an issue with vue, as I did not plan for vuex to cause as many `as any` casts. Since my goal was to go fast and the store itself is very small I skipped rewriting a strongly-typed store which would probably have been a good idea.
