#!/bin/bash

# SUPER HELPFUL VID
# https://www.youtube.com/watch?v=nQdyiK7-VlQ&ab_channel=SamMeech-Ward

# NOTES: 
# You'll run this script when the EC2 instance is initially created so we can get things setup.
# From there use the rsync script to put the repo on the instance.
# The first time this instance is set up, it might be beneficial to run ssh in to npm install instead. Since it
# takes a hot minute and typically freezes inside the GHA.

set -e

sudo apt upgrade -y
sudo apt update -y
sudo apt install npm -y # Needed to install, otherwise something gets wonky.

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
source ~/.bashrc

# Install caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# Set the reverse Proxy settings
sudo sh -c 'cat > /etc/caddy/Caddyfile <<EOF
:80 {
    reverse_proxy localhost:3000
}
EOF'

# Add an app service so we restart.
sudo sh -c 'cat > /etc/systemd/system/myapp.service <<EOF
[Unit]
Description=ScaledFramer Server
After=network.target multi-user.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/framer
ExecStart=/usr/bin/npx nx serve:prod framer-server
Restart=always
Environment=NODE_ENV=production
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=myapp

[Install]
WantedBy=multi-user.target
EOF'


# Enable the service
sudo systemctl daemon-reload
sudo systemctl enable myapp.service
sudo systemctl start myapp.service
# restart caddy with vals
sudo systemctl restart caddy

# Restart the system
# sudo systemctl daemon-reload
# sudo systemctl disable myapp.service #disable to kill it

## Verify the service is running
# sudo systemctl status myapp.service
## Viewing service logs
# sudo journalctl -u myapp.service
# sudo journalctl -fu myapp.service # Read tail end of the logs

## This fixes an nx graph error gets for some reason.
#find . -name '._*' -type f -delete
