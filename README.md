# CellWatch Community Coordination Tool

A web-based tool for community network measurement coordination.

## Development setup

1. Install Node.js and the npm package manager: <https://docs.npmjs.com/downloading-and-installing-node-js-and-npm>.
2. From within the project directory, run `npm install`.
3. Install Docker Desktop (or Docker and Docker Compose).
4. Start a local Supabase instance with `npx supabase start`. (You can stop it later with `npx supabase stop`.)
5. Create a `.env.local` file using the API URL and anon key printed when starting Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<api URL>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
   ADMIN_ID=266b242a-8a65-458d-817a-6b00868ab275
   ```
6. Run `npm run dev` to start the local development server; make sure it loads at <http://localhost:3000>.
