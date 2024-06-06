# CellWatch Community Coordination Tool

A web-based tool for community network measurement coordination.

## Development setup

1. Install Node.js and the npm package manager: <https://docs.npmjs.com/downloading-and-installing-node-js-and-npm>.
2. From within the project directory, run `npm install`.
3. Install Docker Desktop (or Docker and Docker Compose).
4. Start a local Supabase instance with `npx supabase start`. (You can stop it later with `npx supabase stop`.)
5. Create a `.env.local` file using the API URL and anon key printed when starting Supabase and the Mapbox token:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<api URL> # printed when starting supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key> # printed when starting supabase
   NEXT_PUBLIC_MAPBOX_TOKEN=<mapbox token> # get from Mapbox
   ADMIN_ID=266b242a-8a65-458d-817a-6b00868ab275 # user id of the admin user in the seeded data
   ```
6. Run `npm run dev` to start the local development server; make sure it loads at <http://localhost:3000>.

## Production builds

In production, the coordination tool runs as a Docker container, built with the included `Dockerfile`.

To build a production image locally, run the `build.sh` script. It expects that all of the variables set in the `.env.local` file above be set as well. The easiest way to set them is by creating a `.env.prod.local` file with the correct values and then running `./build.sh --env .env.prod.local`.
