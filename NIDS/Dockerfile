FROM ubuntu:bionic


RUN apt-get update --fix-missing 

# tshark
RUN apt-get install -y tshark

#java

# Install OpenJDK-8 for Flowmeter
RUN apt-get install -y openjdk-8-jre-headless
RUN apt-get install -y openjdk-8-jdk
RUN apt-get install -y ant
RUN apt-get clean

# Fix certificate issues
RUN apt-get install ca-certificates-java
RUN apt-get clean
RUN update-ca-certificates -f

# Setup JAVA_HOME -- useful for docker commandline
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/
RUN export JAVA_HOME

# libpcap
RUN apt-get install libpcap-dev -y

RUN apt-get install -y sudo
RUN apt-get -y install wget
RUN wget https://deb.nodesource.com/setup_12.x
RUN chmod +x setup_12.x
RUN ./setup_12.x
RUN apt-get -y install nodejs

# Python and ML libraries
RUN apt-get install -y python3-pip
RUN pip3 install pandas
RUN pip3 install scikit-learn==0.22.2.post1

WORKDIR /usr/src

ADD ./NIDS/ /usr/src

RUN npm install -g nodemon
RUN npm install

# permissions 
RUN chmod 777 /usr/src/src/temp/pcap
RUN chmod 777 /usr/src/src/temp/csv

RUN export DB_USERNAME
RUN export DB_PASSWORD

# RUN npm run start