[Home](https://nagomez97.github.io/ML-NIDS/)

# INDEX
1. [Introduction](documentation.md)
2. [Deployment](deployment.md)
3. [Design](design.md)
4. [Sniffer](sniffer.md)
5. [FlowMeter](flowmeter.md)
6. [Security](security.md)

---

# Deployment
**Vision** is a really easy-to-deploy application. It is completely Dockerized, so you will only need to install Docker, docker-compose and NodeJS. Here you will see an example of installation for an Ubuntu system.

# IMPORTANT
NIDS **must** be run on a Linux system. This is because the containers use the _host_ network mode in order to be able to sniff traffic from the host network interface. Because of the Hyper-V, Windows does not allow this configuration.

## 1. Install Docker
This is based on the [Docker docs](https://docs.docker.com/install/linux/docker-ce/ubuntu/) for Ubuntu. 

```
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io

sudo docker run hello-world

```

## 2. Install docker-compose
Once you have installed the docker engine, run the following commands:
```
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

docker-compose --version
```

## 3. Install NodeJS and npm (developers)
```
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install -y nodejs

# Check installation
node -v
npm -v
```

## (REALLY IMPORTANT!) Change environment variables
At **docker_config/dev/**, there are two _.env_ files containing the database usernames and passwords. These are example files, so you **MUST** change its content. Set new credentials on both files before launching Vision.

## 4. Set up you SSH environment (**VERY IMPORTANT!!!**)
To block IPs on your network, Vision needs to set up some *iptables* rules on your host. You will need to create a non-root user and modify the *sudoers* file 
in order to allow Vision to execute the *iptables* command through SSH without a password prompt. 

Once the user is created and the *sudoers* file has been modified, update the file **NIDS/config/ssh-credentials.js** with your credentials.

You can skip this step, but Vision won't be able to block any IP and will prompt error messages when you try.

**BE CAREFUL** when adding the new user to the *sudoers* file. You must be sure the user cannot run any other command but *iptables* as sudo.

## 5. Run
To finish our deployment, you should clone the repo and cd into it. If you installed docker without enough permission, the docker-compose commands should be run as _sudo_.
```
git clone https://github.com/Nagomez97/ML-NIDS.git
cd ML-NIDS
sudo service docker start
docker-compose build
docker-compose up
```

This will launch both containers. The API will be listening at _https://localhost:8080_ and the dashboard will be at _https://localhost:8000_. Database will be attached to the port 3306.

**REMEMBER THE HTTPS! REDIRECTION IS STILL NOT SUPORTED!!**

As there are two different containers running two different APIs (NIDS and Frontend), the web GUI will perform CORS requests between them. Firefox has a little bug which makes impossible to perform CORS request from Vision when trying to access the server from a host other than *localhost*. It is **highly recommended** to use **Google Chrome** when connecting to Vision.

## 6. Development
If you wish to contribute to the development of the tool, there is a development environment available. Just go to de _docker-compose.yml_ file and find the "command" tag on both _nids_ and _frontend_ containers. Change its content to
```
command: npm run start:dev
```

This will launch the containers from nodemon, so every change you make on your local code will be automatically deploy on the containers. 

**IMPORTANT: you will need to cd to NIDS/ and frontend/ and run npm install in order to meet each container dependencies**