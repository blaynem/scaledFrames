#!/bin/bash

# Expects arg value of your ec2 instance `ec2-54-224-175-29.compute-1.amazonaws.com`

# Check if an argument (EC2 instance URL) is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <EC2_INSTANCE_URL>"
    exit 1
fi

# Set the path to your private key file
KEY_PATH="$HOME/.ssh/aws-west-mbp.pem"

# Check if the private key file exists
if [ ! -f "$KEY_PATH" ]; then
    echo "Error: Private key file not found at $KEY_PATH"
    exit 1
fi

# Connect to the EC2 instance
echo "Connecting to EC2 instance at $1..."
ssh -i "$KEY_PATH" ubuntu@"$1"
