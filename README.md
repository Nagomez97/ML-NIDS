# ML-NIDS
Please, refer to the project webpage: [nagomez97.github.io/ML-NIDS/](https://nagomez97.github.io/ML-NIDS/)

# Notes to remember
chart.js to make charts. Looks great!
vue.js for reactive dev (maybe react.js?)

# Deployment
The whole deployment process is [explained on the project webpage](https://nagomez97.github.io/ML-NIDS/documentation/deployment.html)

# IMPORTANT
NIDS **must** be run on a Linux system. This is because the containers use the _host_ network mode in order to be able to sniff traffic from the host network interface. Because of the Hyper-V, Windows does not allow this configuration.