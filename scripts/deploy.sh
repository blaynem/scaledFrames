#!/bin/bash
set -e

cd ~/scaled-frames

# install packages
npm i

# Generate the prisma schema we use locally
npx nx run framer-db:"prisma:generate"

# Run the dev server
npx nx serve:prod framer-server