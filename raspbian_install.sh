#!/bin/bash

echo -e "Please, note this script is designed for an empty Raspbian."

echo -e "Updating..."
sudo apt update

echo -e "Installing Docker and docker-compose"
sudo curl -sSL https://get.docker.com | sh

sudo apt install -y python3-pip

sudo pip3 install docker-compose

echo -e "Installation finished! Run build&run.sh to deploy Vision!"