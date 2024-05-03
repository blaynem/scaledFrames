# Framer


- [NX Things](#nx-things)
- [Database](#database)

# Set up

We're using npm instead of yarn for this project.

1. Install correct Node version
    ```bash
    nvm install
    nvm use
    ```
2. Install dependencies
    ```bash
    npm install
    ```

# Database

We're using our typical Prisma + Supabase setup.

## Prisma

Generate the Prisma client types any time you make changes to the schema.
```bash
npx prisma generate
```

## Supabase

Commands
```bash
npx supabase start # Start the docker container
npx supabase stop # Stop the docker container
```

# NX Things

- [Integrate with editors](#integrate-with-editors)
- [Start the application](#start-the-application)
- [Build for production](#build-for-production)
- [Running tasks](#running-tasks)
- [Set up CI!](#set-up-ci)
- [Explore the project graph](#explore-the-project-graph)
- [Connect with us!](#connect-with-us)

## Integrate with editors

Enhance your Nx experience by installing [Nx Console](https://nx.dev/nx-console) for your favorite editor. Nx Console
provides an interactive UI to view your projects, run tasks, generate code, and more! Available for VSCode, IntelliJ and
comes with a LSP for Vim users.

## Start the application

Run `npx nx dev framer` to start the development server. Happy coding!

## Build for production

Run `npx nx build framer` to build the application. The build artifacts are stored in the output directory (e.g. `dist/` or `build/`), ready to be deployed.

## Running tasks

To execute tasks with Nx use the following syntax:

```
npx nx <target> <project> <...options>
```

You can also run multiple targets:

```
npx nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
npx nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/features/run-tasks).

## Set up CI!

Nx comes with local caching already built-in (check your `nx.json`). On CI you might want to go a step further.

- [Set up remote caching](https://nx.dev/features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/nx-cloud/features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)

## Explore the project graph

Run `npx nx graph` to show the graph of the workspace.
It will show tasks that you can run with Nx.

- [Learn more about Exploring the Project Graph](https://nx.dev/core-features/explore-graph)

## Connect with us!

- [Join the community](https://nx.dev/community)
- [Subscribe to the Nx Youtube Channel](https://www.youtube.com/@nxdevtools)
- [Follow us on Twitter](https://twitter.com/nxdevtools)
