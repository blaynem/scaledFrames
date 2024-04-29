# framer-db

- [Commands](#commands)

## Commands

### `prisma:deploy`

Deploy the prisma schema to the database.

### `prisma:create-migration`

Create a migration based on updated schema values.

### `prisma:generate`

Generates the prisma client based on the schema.

### `prisma:reset--dev-only`

WARNING: Should only be used in development.

Clear all data from the database, then will apply all migrations, and finally run all seed scripts.

### `supabase:start`

Start the local supabase server.

### `supabase:stop`

Stop the local supabase server.