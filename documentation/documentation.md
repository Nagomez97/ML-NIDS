[Home](https://nagomez97.github.io/ML-NIDS/)

# INDEX
1. [Introduction](documentation.md)
2. [Deployment](deployment.md)
3. [API](api.md)
4. [Sniffer](sniffer.md)
5. [FlowMeter](sniffer.md)
6. [Analyzer](analyzer.md)

---

Welcome to the **Vision** ML-NIDS documentation! Here you will learn verything about me!

# ML-NIDS
A _Network Intrusion Detection System (NIDS)_ is a tool capable of analyze every packet surfing your local network and detect anomalies or attack patterns. This is everything but new, of course... But what if we add some **Machine Learning** stuff?

## About the project
As part of my **Degree Final Project** I tried to develop an innovative tool and, as I am kind of an InfoSec nerd, this NIDS was intended to become my little baby.

This awesome project has two isolated systems: the **Machine Learning AI** and a **_full stack_ server** providing a _Command & Control_ system for our NIDS.

The main goal is to train a model using different ML algorithms over a big dataset and use this model to classify a _flow_ of sniffed packets in order to know whether an attack is being performed.

## Machine Learning AI
Common NIDS can be classified as _Signature Based_ or _Anomaly Based_. The first one depends on a set of rules written by the administrator with wich the IDS will filter the sniffed packets. The Anomaly Based one, on the other hand, tries to model normal user behavior and rises alarms whenever something is out of that.

The first version of this project will try to enhance the Signature Based approach, replacing those admin-defined rules with a ML-trained classifier.

The dataset used is the [CSE-CIC-IDS2018](https://www.unb.ca/cic/datasets/ids-2018.html). You can find  all the information about it in the link. This dataset includes more than 100Gb of _.pcaps_, so I have reduced the number of packets to minimize the training time waste.

## Server
The server is written in [NodeJS](https://nodejs.org). It includes a [REST API](api.md) and some modules capable of repeatedly sniffing traffic every _n_ seconds, write it on a _.pcap_ file and use the [CICFlowMeter](https://github.com/ahlashkari/CICFlowMeter) to create flows from bunches of packets and write then as a _.csv_ file (which will be the input of our ML Classifier).

I know... I know... There are _trillions_ of better ways for capture live traffic but, as I am using the _FlowMeter_ and it needs _.pcap_ files, a completely _live_ capture is just not possible. So I will be happy using packets captured every, lets say... 20 seconds.

And why is that? _CICFlowMeter_ joins related packets (same IP, same port...) and creates a _flow_. A _flow_ is an object containing statistical information about those related packets, like RTT, amount of bytes transmitted/received, bytes per second... Which is PERFECT for a ML algorithm. We will avoid lots of categorical values replacing them with statistical, numeric data.
