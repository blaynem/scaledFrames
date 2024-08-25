# Build the docker image with `npx nx docker-build framer-server`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
#
# Run the container with `docker run -p 3000:3000 -t framer-server`.
FROM docker.io/node:lts-alpine

# Set env variables here
ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

# This creates a system group called framer-server and adds a system user framer-server to this group.
RUN addgroup --system framer-server && \
    adduser --system -G framer-server framer-server

# Copies everything except what's in .dockerignore.
COPY . .

# This changes the ownership of all files in the current directory (/app) to the framer-server user and group.
# This is important for security, ensuring that the application runs as a non-root user.
RUN chown -R framer-server:framer-server .

# We're installing all the deps. I don't care. I'm too lazy to make this good.
RUN npm install
# Need to generate the prisma types
RUN npx nx run framer-db:prisma:generate

CMD npx nx serve:prod framer-server
