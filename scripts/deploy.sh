#!/bin/bash
set -e

sudo apt upgrade
sudo apt update -y

# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc

# install node
nvm install
nvm use

# install packages
cd scaled-frames
npm i

# Generate the prisma schema we use locally
npx nx run framer-db:"prisma:generate"

# Run the dev server
npx nx serve:prod framer-server