# Install and use elasticsearch

### 1. Install elasticsearch

Adapted from https://github.com/elastic/elasticsearch

**Install and start Docker Desktop. https://www.docker.com/products/docker-desktop**

Go to Preferences > Resources > Advanced and set Memory to at least 4GB.

If WSL, create file "C:\Users\ 'UserName' \ .wslconfig", paste and save the following:
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

Check if the import was successful:
```bash
export ELASTIC_PASSWORD="aAwnuMHrnenWc2u3J1Lq"
docker cp elasticsearch:/usr/share/elasticsearch/config/certs/http_ca.crt .
curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD -X GET "https://localhost:9200/my_index/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match": {
      "label": "清代宫廷戏曲画"
    }
  }
}'
```

Result:
```json
{"took":34,"timed_out":false,"_shards":{"total":1,"successful":1,"skipped":0,"failed":0},"hits":{"total":{"value":10000,"relation":"gte"},"max_score":34.687885,"hits":[{"_index":"my_index","_id":"bdi5061998","_score":34.687885,"_source":{"label":"清代宫廷戏曲画","type":"instance","source":"bd","description":"清代戏曲文物，是描绘晚清戏曲人物装扮的最真实、具体和丰富的形象资料。"}},{"_index":"my_index","_id":"bdi5062087","_score":25.714275,"_source":{"label":"清代戏曲版画","type":"instance","source":"bd","description":"清代戏曲版画以戏曲为题材的版画，盛行于清中叶以后，主要产地有河北杨柳青、江苏桃花坞等。因这类民间版画多在新年张贴，又称“年画”。杨柳青的戏曲版画，现存较早的有清乾隆年间的《百花公主》、《辛安驿》、《瑞草园》等数种 。"}},{"_index":"my_index","_id":"bdi2794272","_score":23.089851,"_source":{"label":"宫廷戏","type":"instance","source":"bd","description":"宫廷戏属于古装历史剧的范畴，是指发生在 [[bd1784627|历史剧]]中发生在宫廷背景下的历史传奇故事。与善于戏说、富有娱乐性质的 [[bd2794680|宫斗剧]]有着本质上的区别，宫廷剧更偏向于严谨的历史。"}},{"_index":"my_index","_id":"bdi669515","_score":22.797066,"_source":{"label":"中国清代宫廷版画","type":"instance","source":"bd","description":"《中国清代宫廷版画》是2002年由安徽美术出版社出版的图书，该书作者是曲延钧。"}},{"_index":"my_index","_id":"bdi5062085","_score":22.195768,"_source":{"label":"清代戏曲史","type":"instance","source":"bd","description":"《清代戏曲史》是一部系统介绍清代戏曲历史的书籍，内容丰富，是当代戏曲学家周妙中女士经过30余年搜集、整理、调查、研究，并多次易稿而写成的。"}},{"_index":"my_index","_id":"bdi5067708","_score":21.219816,"_ignored":["description.keyword"],"_source":{"label":"清宫戏","type":"instance","source":"bd","description":"清宫戏又称 辫子戏，   是以清朝宫廷为题材的 [[bd5613781|电视剧]]的统称。广义指有关清朝时期的电视剧的统称，狭义上指与清朝后宫相关的电视剧和网络角色扮演。这些电视剧和角色扮演涵盖了从 努尔哈赤到末代皇帝溥仪三百多年的历史故事和人物。::;第一代清宫戏是早期的港台作品《 戏说乾隆》，到《 [[bd7184130|还珠格格]]》、《 [[bd3192507|康熙微服私访记]]》、《 [[bd7760052|雍正王朝]]》、《 [[bd3192547|康熙王朝]]》时期达到了顶峰状态。2011年的热播大剧《 甄嬛传》展现了清宫戏的另一种表现方式。::;清宫戏通过演员的表演为观众展现清朝后宫的勾心斗角以及政治争斗争内幕。"}},{"_index":"my_index","_id":"bdi5062002","_score":21.182592,"_source":{"label":"清代宫廷服饰","type":"instance","source":"bd","description":"《清代宫廷服饰》是2004年12月1日紫禁城出版社出版的图书。本书介绍了清代宫廷服饰制度的起源、形成和演变。"}},{"_index":"my_index","_id":"zhi395957","_score":20.449053,"_source":{"label":"宫廷画家","type":"instance","source":"zh","description":"'''宫廷画家'''（）指的是为[[zh143505]]或者贵族家庭绘画的画家，他们有固定的薪水，退职后还可以获得养老金。有些国家还设有专门培训宫廷画家的机构。"}},{"_index":"my_index","_id":"bdi5062009","_score":19.588581,"_source":{"label":"清代宫廷社会史","type":"instance","source":"bd","description":"《清代宫廷社会史》是2009年03月 中国人民大学出版社出版的图书，作者是(美国)罗友枝。本书讲述了清代的宫廷物质文化、宫廷社会结构、宫廷礼仪等内容。"}},{"_index":"my_index","_id":"bdi1178277","_score":18.482595,"_source":{"label":"元代戏曲","type":"instance","source":"bd","description":"元代是我国戏曲繁荣兴盛的时期。元代戏曲主要分为杂剧和南戏两大类，二者各有自己的发展轨迹。由于南戏在元代前期处于发展的薄弱阶段，还不能与杂剧一争高下，所以代表元代最高文学成就的是元杂剧。   元杂剧之所以能够以深刻的思想与精湛的艺术取得与唐诗、宋词并称的地位，产生一批传世不衰的艺术品，至关重要的原因是一批杰出的文人以他们的文学生命来参与戏曲的创作，他们自身的文学素养，提高了元杂剧的审美档次，使得元杂剧创作精致化和典范化。"}}]}}
```

Then you can move on.