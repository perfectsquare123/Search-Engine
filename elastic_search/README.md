# Install and use elasticsearch

### 1. Install elasticsearch

Adapted from https://github.com/elastic/elasticsearch

**Install and start Docker Desktop. https://www.docker.com/products/docker-desktop**

Go to Preferences > Resources > Advanced and set Memory to at least 4GB.

If WSL, create file "C:\Users\{UserName}\.wslconfig", paste and save the following:
```
[wsl2]
memory=8GB   # 设置WSL 2可以使用的最大内存，不少于4GB，这里是8GB
```
Then run the following in the Windows terminal:
```bash
wsl --shutdown
```
Then restart the wsl.

**Run Elasticsearch and Kibana using Docker**

**Start Elasticsearch**

```bash
docker network create elastic
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.13.4
docker run --name elasticsearch --net elastic -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -t docker.elastic.co/elasticsearch/elasticsearch:8.13.4
```

Save the INFO at the end of terminal output like this:
```
✅ Elasticsearch security features have been automatically configured!
✅ Authentication is enabled and cluster connections are encrypted.

ℹ️  Password for the elastic user (reset with `bin/elasticsearch-reset-password -u elastic`):
  aAwnuMHrnenWc2u3J1Lq

ℹ️  HTTP CA certificate SHA-256 fingerprint:
  d2529951ddf0a18d42c3960ce8b6b68c61aad195ae79b9fa497f8f71e2ccd014

ℹ️  Configure Kibana to use this cluster:
• Run Kibana and click the configuration link in the terminal when Kibana starts.
• Copy the following enrollment token and paste it into Kibana in your browser (valid for the next 30 minutes):
  eyJ2ZXIiOiI4LjEzLjQiLCJhZHIiOlsiMTcyLjE4LjAuMjo5MjAwIl0sImZnciI6ImQyNTI5OTUxZGRmMGExOGQ0MmMzOTYwY2U4YjZiNjhjNjFhYWQxOTVhZTc5YjlmYTQ5N2Y4ZjcxZTJjY2QwMTQiLCJrZXkiOiJ3ZGZYOFk4QmpVNl9ySzZyTGJHcTpTRUxVLVpCblFYYW5fSklDeWFXZ19nIn0=

ℹ️ Configure other nodes to join this cluster:
• Copy the following enrollment token and start new Elasticsearch nodes with `bin/elasticsearch --enrollment-token <token>` (valid for the next 30 minutes):
  eyJ2ZXIiOiI4LjEzLjQiLCJhZHIiOlsiMTcyLjE4LjAuMjo5MjAwIl0sImZnciI6ImQyNTI5OTUxZGRmMGExOGQ0MmMzOTYwY2U4YjZiNjhjNjFhYWQxOTVhZTc5YjlmYTQ5N2Y4ZjcxZTJjY2QwMTQiLCJrZXkiOiJ3TmZYOFk4QmpVNl9ySzZyTGJHcDotRFk1MUpUTlNhQ01VNWtLTng5LVB3In0=

  If you're running in Docker, copy the enrollment token and run:
  `docker run -e "ENROLLMENT_TOKEN=<token>" docker.elastic.co/elasticsearch/elasticsearch:8.13.4`
```

**Start Kibana**

```bash
docker pull docker.elastic.co/kibana/kibana:8.13.4
docker run --name kibana --net elastic -p 5601:5601 docker.elastic.co/kibana/kibana:8.13.4
```

Then visit the URL at the end of terminal output like http://localhost:5601/?code=575783

Paste the enrollment token that you copied when starting Elasticsearch and click the button to connect your Kibana instance with Elasticsearch.
```
eyJ2ZXIiOiI4LjEzLjQiLCJhZHIiOlsiMTcyLjE4LjAuMjo5MjAwIl0sImZnciI6ImQyNTI5OTUxZGRmMGExOGQ0MmMzOTYwY2U4YjZiNjhjNjFhYWQxOTVhZTc5YjlmYTQ5N2Y4ZjcxZTJjY2QwMTQiLCJrZXkiOiJ3TmZYOFk4QmpVNl9ySzZyTGJHcDotRFk1MUpUTlNhQ01VNWtLTng5LVB3In0=
```

Log in to Kibana as the elastic user with the password that was generated when you started Elasticsearch.
```
elastic
aAwnuMHrnenWc2u3J1Lq
```

**Generate API key**

Click 'management' on the left bar, and click Security>API keys on the left bar.

Create an API key, and copy this key now. You will not be able to view it again.

![alt text](image.png)

### 2. Use elasticsearch

Please ensure your disk space is enough (maybe >10G)

Download the dataset and move to the same folder as import.py:
https://cloud.tsinghua.edu.cn/d/f9740c3db9d640b48655/

Install necessary packages: (You can create a virtual environment using miniconda)
```bash
python -m pip install elasticsearch
pip install ijson
```

Run import.py:
```bash
python import.py # 注意替换API key
```
Wait about ~10 minutes.

And finally you will see the following in your bash:
```bash
Successfully indexed 3505391 documents.
```

Then you can move on.