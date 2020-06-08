[Home](https://nagomez97.github.io/ML-NIDS/)

# INDEX
1. [Introduction](documentation.md)
2. [Deployment](deployment.md)
3. [Design](design.md)
4. [Sniffer](sniffer.md)
5. [FlowMeter](flowmeter.md)
6. [Analyzer](analyzer.md)

---

# Sniffer
Vision uses the *tshark* sniffer in order to capture packets from the host network. To do so, the application *must* access the host network interface, so the NIDS Docker container has been deployed using network mode: host.

*tshark* creates a *.pcap* file which is transformed into a *.csv* file using the [CICFlowMeter](flowmeter.md) tool.

Capture time is *hardcoded* into the *utils.js* file, inside the Frontend container.