# framer-db

- [Setup](#setup)
- [Common Terms](#common-terms)
- [Commands](#commands)

## Setup

You likely have the `.env.local` file already set up as it's the local environment variables for the supabase instance itself. If not, when you run the `npx supabase:start` command, it will print out all of the necessary environment variables you need to set up.


You can run these commands either through a bash script or a VsSCode extension called NX Console.

_Install link here: [NX Console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)_

1. Install the dependencies:

    ```bash
    npm install
    ```

2. Start the local supabase server:

    - NX Console:
        - _[framer-db/**supabase:start**](#supabasestart)_

    - Bash
        ```bash
        npx nx supabase:start framer-db
        ```

3. Deploy the prisma schema to the database:

    First generate the prisma client, then deploy the schema.

    - NX Console:
        - _[framer-db/**prisma:generate**](#prismagenerate)_
        - _[framer-db/**prisma:deploy**](#prismadeploy)_

    - Bash
        ```bash
        npx nx prisma:generate framer-db
        npx nx prisma:deploy framer-db
        ```

## Common Terms

- **Migration**: A migration is a way to update the database schema. It is a set of instructions that tell the database how to change its structure to match the new schema. Essentially it's a way to version control the database schema.

## Commands

### `prisma:deploy`

Deploy the prisma schema to the database.

#### When would I use this?

- Locally:
    - You made a recent database `migration` and want to apply it your local supabase instance.
    - You are creating your supabase instance for the first time.
- In CI:
    - You want to deploy the schema to the *production* database.

### `prisma:create-migration`

Create a migration based on updated schema values.

#### When would I use this?

- Locally:
    - You made a change to the schema and want to create a migration that will then apply to the database.

### `prisma:generate`

Generates the prisma client based on the schema.

#### When would I use this?

- Locally:
    - You just updated a schema and want to use the new types in your code.
    - You made a change to the schema and want to generate the prisma client to reflect those changes.
- In CI:
    - We run this before we deploy the schema to the production database.

### `prisma:reset--dev-only`

***WARNING: This command will delete all data in the database and apply all migrations.** Should only be used in development.*

Clear all data from the database, then will apply all migrations, and finally run all seed scripts.

#### When would I use this?

- Locally:
    - You want to reset your local supabase to its initial state for any reason.
    - You made an oopsie in the local db and broke it.
- In CI:
    - We would typically not run this in CI. Idk?

### `supabase:start`

Start the local supabase server.

#### When would I use this?

- Locally:
    - Starting the local docker supabase server up.

### `supabase:stop`

Stop the local supabase server.

#### When would I use this?

- Locally:
    - You want to tear down the docker container running the local supabase server.
