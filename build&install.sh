echo -e "Changing to overlay mount"
sudo systemctl stop docker
sudo dockerd -s overlay

sudo docker-compose build

echo -e "Finished! Vision will be launched now."

sudo docker-compose run