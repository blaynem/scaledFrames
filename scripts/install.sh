# Meant to be run when an instance is created.

#!/bin/bash
set -e

sudo apt upgrade -y
sudo apt update -y
sudo apt install npm -y

# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"

cd ~/scaled-frames

# install node version from scaled-frames
nvm install
nvm use