# Deno Auth Demo

## Disclaimer
**/!\ This repository is a starting point!** I

It doesn't implement (yet) any
of the securities you'll need in an actual production environment:
- frequency limitation (to prevent rainbow attacks)
- CSRF tokens (to prevent attackers to forge requests)
- passwordless strategies or plain oauth (you probably don't want to reimplement
the server-side in your company, prefer FusionAuth, Auth0 etc. etc.)
- protections against timing attack
- e2e tests that are necessary to check all that

Yeah, auth is hard. This repository is a way to learn the basic concept
before jumping into a more advanced implementation.
## Goal

This application demoes JSON Web Token (JWT) based authentication.

- `api/`: a Deno API with authentication features.
- `webapp/`: a Deno server serving a website. This simulates having a client-app separated from the API, therefore needing a correct CORS setup.

## Run

At the project root:
```sh
# Install dev dependencies to run HTTP server
npm i
# Run the Mongo database
npm run db
# Run the Deno API + Deno server for the web app in a single terminal
npm run start
# Open the web app
xdg-open http://localhost:8080
```

## TODO

- [X] Add a Deno server for the web app instead of http-server, in order to demo authenticating a private page => made a basic version
- [ ] When there is an error, it also fails the CORS request, leading to opaque messages.
- [ ] Create a shared code folder to locate the auth logic, so it can be reuse by the API and by the webapp
- [ ] (dev) fix Deno VS code setup: "deno.importMap": "./api/import_map.json" is needed in settings, but thus can support only one importMap. The importMap config of "deno.jsonc" for each folder is ignored by the extension. 
We could use a single "import_map" for bother folders, but this prevents us from having "/" to point to the root of each folder.
See https://github.com/denoland/deno/discussions/9126#discussioncomment-3605938 and https://github.com/denoland/vscode_deno/issues/701#issuecomment-1245152227