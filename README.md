# ML-NIDS
Please, refer to the project webpage: [nagomez97.github.io/ML-NIDS/](https://nagomez97.github.io/ML-NIDS/)

# Deployment
The whole deployment process is [explained on the project webpage](https://nagomez97.github.io/ML-NIDS/documentation/deployment.html)

# IMPORTANT
NIDS **must** be run on a Linux system. This is because the containers use the _host_ network mode in order to be able to sniff traffic from the host network interface. Because of the Hyper-V, Windows does not allow this configuration.

# VERY IMPORTANT
Don't forget to **change default database passwords**! Please, modify *docker_config/dev/app_db.dev.env* and *docker_config/dev/app_db.dev.env*.
