CREATE DATABASE IF NOT EXISTS nacho;
CREATE USER 'nacho'@'%' IDENTIFIED BY 'nacho';
GRANT ALL ON nacho.* to 'nacho'@'%';