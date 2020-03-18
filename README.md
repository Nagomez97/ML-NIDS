# ML-NIDS
Please, refer to the project webpage: [nagomez97.github.io/ML-NIDS/](https://nagomez97.github.io/ML-NIDS/)

# Notes to remember
chart.js to make charts. Looks great!
vue.js for reactive dev (maybe react.js?)

# Deployment
The whole project is included in several Docker containers, so you will need to install Docker and docker-compose (please, refer to its own documentation to learn more).

After that, deploy the NIDS is really simple:

`docker-compose build`
`docker-compose up`

# IMPORTANT
NIDS **must** be run on a Linux system. This is because the containers use the _host_ network mode in order to be able to sniff traffic from the host network interface. Because of the Hyper-V, Windows does not allow this configuration.s