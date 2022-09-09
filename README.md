# Deno Auth Demo

This application demoes JSON Web Token (JWT) based authentication.

- `api/`: a Deno API with authentication features
- `webapp/`: a tiny index.html. This simulates having a client-app separated from the API, therefore needing a correct CORS setup

## Run

At the project root:
```sh
# Install dev dependencies to run HTTP server
npm i
# Run the Mongo database
npm run db
# Run the Deno API + HTTP server for the web app in a single terminal
npm run start
# Open the web app
xdg-open http://localhost:8080
```