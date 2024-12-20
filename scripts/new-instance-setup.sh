# SUPER HELPFUL VID
# https://www.youtube.com/watch?v=nQdyiK7-VlQ&ab_channel=SamMeech-Ward

# NOTES: 
# Allegedly this _could_ work on a mini server, we gotta verify that though. We should test the connection speed somehow.

# On instance creation you'll need to run the `rsync` script to put the repo onto the instance
# Then you'll run this script when the repo is synced
# then we can run the GHA deploy-script on the instance and it _should_ be good to go.

#!/bin/bash
set -e

sudo apt upgrade -y
sudo apt update -y
sudo apt install npm -y

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
scaledframes.com {
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
