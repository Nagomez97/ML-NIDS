FROM ubuntu:latest

RUN apt-get update --fix-missing 

# tshark
RUN apt-get install -y tshark

#java

# Install OpenJDK-8
RUN apt-get update && \
    apt-get install -y openjdk-8-jdk && \
    apt-get install -y ant && \
    apt-get clean;

# Fix certificate issues
RUN apt-get update && \
    apt-get install ca-certificates-java && \
    apt-get clean && \
    update-ca-certificates -f;

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
RUN pip3 install sklearn

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