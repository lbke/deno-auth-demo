# @see https://github.com/casey/just
start:
    npm run start
api:
    cd {{justfile_directory()}}/api; deno run --allow-net --allow-env --allow-read ./server.ts

webapp:
    cd {{justfile_directory()}}/api; http-server

db:
    docker run --rm -p 27017:27017 -v "$(pwd)"/.mongo:/data/db --label deno-auth-demo mongo:4.0.4



    