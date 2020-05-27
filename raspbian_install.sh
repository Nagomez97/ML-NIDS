#!/bin/bash

echo -e "Please, note this script is designed for an empty Raspbian."

echo -e "Updating..."
sudo apt update

echo -e "Installing Docker and docker-compose"
sudo curl -sSL https://get.docker.com | sh

sudo apt install -y python3-pip

sudo pip3 install docker-compose

docker-compose --version

echo -e "Docker installation finished!"

sudo apt install -y git

git clone https://github.com/Nagomez97/ML-NIDS.git

cd ML-NIDS

docker-compose build

echo -e "Installation finished! Run \n\tdocker-compose run\nto deploy Vision."