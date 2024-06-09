# The backend of knowledge search engine

Note: Please ensure that you have completed the steps in Elasticsearch

### Start

Install django if not yet:
```bash
pip install django
```

Migrate and run:
```bash
python manage.py migrate
```
```bash
python manage.py runserver
```

### API

Please see ../api.md

**Some examples using curl**

Search:
```bash
curl -G --data-urlencode "q=天气" http://127.0.0.1:8000/search # 使用-G --data-urlencode避免编码问题，如果是正常前端发送请求应该不会出现编码问题
```

Result:
```json
{"content": [{"id": "bdi2464891", "label": "天气", "type": "instance", "source": "bd", "description": "[[bd2464891|天气]]是指某一个地区距离地表较近的大气层在短时间内的具体状态。而天气现象则是指发生在大气中的各种自然现象，即某瞬时内大气中各种气象要素（如 [[bd4682361|气温]]、 [[bd4681382|气压]]、 [[bd5128335|湿度]]、风、云、雾、雨、闪、雪、霜、雷、雹、霾等）空间分布的综合表现。::;天气过程就是一定地区的 [[bd2464990|天气现象]]随时间的变化过程。各种 [[bd2465006|天气系统]]都具有一定的空间尺度和时间尺度，而且各种尺度系统间相互交织、相互作用。许多天气系统的组合，构成大范围的天气形势，构成半球甚至全球的 [[bd2401722|大气环流]]。天气系统总是处在不断新生、发展和消亡过程中，在不同发展阶段有着其相对应的天气现象分布。", "concepts": [{"id": "bdc32484", "label": "科学百科环境生态分类"}, {"id": "bdc9966", "label": "自然现象"}, {"id": "bdc3313", "label": "自然"}], "instances": [{"id": "bdi7192065", "label": "远古时代"}, {"id": "bdi2507267", "label": "太阳"}, {"id": "bdi6403245", "label": "能见度"}, {"id": "bdi893002", "label": "交通"}], "url": "https://baike.baidu.com/item/%E5%A4%A9%E6%B0%94%2F24449"}, {"id": "bdi2464893", "label": "天气", "type": "instance", "source": "bd", "description": "天气是指在较短时间内特定地区的 大气状况，出自太平天囯 [[bd4907785|洪仁玕]]《自传》。", "concepts": [], "instances": [{"id": "bdi6909271", "label": "诉衷情"}, {"id": "bdi8172348", "label": "黄庭坚"}, {"id": "bdi4810184", "label": "沙尘暴"}, {"id": "bdi4701999", "label": "水浒传"}], "url": "https://baike.baidu.com/item/%E5%A4%A9%E6%B0%94%2F332535"}, {"id": "bdi2464890", "label": "天气", "type": "instance", "source": "bd", "description": "[[bd5103934|游戏王卡组]]系列之一。登场于新型卡包Deck Build Pack第1弹Spirit Warriors（DBSW）的系列。::;特色是使用连接怪兽或永续魔法·永续陷阱卡赋予相邻的「天气」效果怪兽以除外自身作为COST的干扰性效果，且「天气」效果怪兽本身就有作为「天气」效果COST除外则在下个回合的准备阶段特殊召唤的再生效果。", "concepts": [{"id": "bdc25120", "label": "娱乐"}], "instances": [{"id": "bdi5103934", "label": "游戏王卡组"}], "url": "https://baike.baidu.com/item/%E5%A4%A9%E6%B0%94%2F21511882"}, {"id": "bdi2464927", "label": "天气和气候", "type": "instance", "source": "bd", "description": "《天气和气候》是2008年电子工业出版社出版的图书。", "concepts": [{"id": "bdc18567", "label": "工业书籍"}, {"id": "bdc7948", "label": "出版物"}, {"id": "bdc17963", "label": "书籍"}], "instances": [], "url": "https://baike.baidu.com/item/%E5%A4%A9%E6%B0%94%E5%92%8C%E6%B0%94%E5%80%99"}, {"id": "bdi2464983", "label": "天气气候学", "type": "instance", "source": "bd", "description": "天气气侯学是气候学的一个分支,是以天气学的观点和方法来研究气候形成及其变化规律的学科。天气气侯学主要研究长时期内平均环流、环流型式与天气系统相互作用以及大气环流与大范围气候异常的关系等问题,为提高某地区天气预报准确率和阐明气候形成理论提供重要依据。其研究工具主要为天气图和气压配置图。未来天气气侯学将会采取更多定量分析的方法。", "concepts": [{"id": "bdc32484", "label": "科学百科环境生态分类"}, {"id": "bdc27821", "label": "非地理"}, {"id": "bdc18653", "label": "气候学"}, {"id": "bdc17225", "label": "大气科学"}, {"id": "bdc10428", "label": "地理学"}, {"id": "bdc31911", "label": "学科名"}], "instances": [{"id": "bdi7564534", "label": "长期天气预报"}, {"id": "bdi2215399", "label": "圣彼得堡"}], "url": "https://baike.baidu.com/item/%E5%A4%A9%E6%B0%94%E6%B0%94%E5%80%99%E5%AD%A6"}, {"id": "bdi2477703", "label": "天然气", "type": "instance", "source": "bd", "description": "天然气是指自然界中天然存在的一切气体，包括 大气圈、 水圈、和 岩石圈中各种自然过程形成的气体（包括 油田气、气田气、 泥火山气、 煤层气和 生物生成气等）。::;而人们长期以来通用的“天然气”的定义，是从能量角度出发的 狭义定义，是指天然蕴藏于地层中的 [[bd5223992|烃]]类和非烃类气体的混合物。在 [[bd5776189|石油地质学]]中，通常指油田气和气田气。其组成以烃类为主，并含有非烃气体。", "concepts": [{"id": "bdc32485", "label": "科学百科工程技术分类"}, {"id": "bdc24480", "label": "学科"}, {"id": "bdc32485", "label": "科学百科工程技术分类"}, {"id": "bdc24480", "label": "学科"}], "instances": [{"id": "bdi5775763", "label": "石油"}, {"id": "bdi5249132", "label": "煤炭"}, {"id": "bdi5248579", "label": "煤"}, {"id": "bdi5008654", "label": "液化石油气"}], "url": "https://baike.baidu.com/item/%E5%A4%A9%E7%84%B6%E6%B0%94%2F36482"}, {"id": "bdi248831", "label": "V天气", "type": "instance", "source": "bd", "description": "《V天气》是一款集成了当今各大门户网站的天气栏目，软件大小是0.64 MB。", "concepts": [{"id": "bdc12187", "label": "软件"}, {"id": "bdc28962", "label": "安卓软件"}], "instances": [], "url": "https://baike.baidu.com/item/V%E5%A4%A9%E6%B0%94"}, {"id": "bdi2484426", "label": "天罡气", "type": "instance", "source": "bd", "description": "", "concepts": [{"id": "bdc17963", "label": "书籍"}, {"id": "bdc15571", "label": "梦幻西游"}], "instances": [{"id": "bdi876183", "label": "五雷轰顶"}, {"id": "bdi7784404", "label": "雷霆万钧"}, {"id": "bdi2481551", "label": "天神护体"}], "url": "https://baike.baidu.com/item/%E5%A4%A9%E7%BD%A1%E6%B0%94"}, {"id": "bdi2464931", "label": "天气图", "type": "instance", "source": "bd", "description": "天气图是指填有各地同一时间 气象要素的特制地图，是目前气象部门分析和预报天气的一种重要工具。", "concepts": [{"id": "bdc32484", "label": "科学百科环境生态分类"}, {"id": "bdc22323", "label": "科学"}, {"id": "bdc22247", "label": "气象"}, {"id": "bdc17225", "label": "大气科学"}, {"id": "bdc14829", "label": "天气学"}, {"id": "bdc18649", "label": "气象名词"}, {"id": "bdc22323", "label": "科学"}, {"id": "bdc1542", "label": "自然科学"}], "instances": [{"id": "bdi1016669", "label": "传真"}, {"id": "bdi4683351", "label": "气象卫星"}, {"id": "bdi2401722", "label": "大气环流"}], "url": "https://baike.baidu.com/item/%E5%A4%A9%E6%B0%94%E5%9B%BE"}, {"id": "bdi2245320", "label": "坏天气", "type": "instance", "source": "bd", "description": "坏天气为 孙燕姿的第二张专辑《 我要的幸福》中歌曲，于2000年12月7日发行。", "concepts": [{"id": "bdc16459", "label": "音乐作品"}, {"id": "bdc16459", "label": "音乐作品"}], "instances": [{"id": "bdi3544941", "label": "愚人的国度"}, {"id": "bdi1933210", "label": "同类"}, {"id": "bdi534051", "label": "世说心语"}, {"id": "bdi4002036", "label": "明日的记忆"}], "url": "https://baike.baidu.com/item/%E5%9D%8F%E5%A4%A9%E6%B0%94%2F6262"}]}
```

View:
```bash
curl http://127.0.0.1:8000/item?id=bdi2464893
```

Result:
```json
{"id": "bdi2464893", "label": "天气", "type": "instance", "source": "bd", "description": "天气是指在较短时间内特定地区的 大气状况，出自太平天囯 [[bd4907785|洪仁玕]]《自传》。", "concepts": [], "instances": [{"id": "bdi6909271", "label": "诉衷情"}, {"id": "bdi8172348", "label": "黄庭坚"}, {"id": "bdi4810184", "label": "沙尘暴"}, {"id": "bdi4701999", "label": "水浒传"}], "properties": [{"id": "bdp1", "key": "中文名", "value": "天气"}, {"id": "bdp662", "key": "基本解释", "value": "在较短时间内特定地区的 [[bdi2401463|大气]]状况"}, {"id": "bdp9", "key": "外文名", "value": "weather"}, {"id": "bdp2211", "key": "泛指", "value": "[[bdi5933964|空气]]"}], "url": "https://baike.baidu.com/item/%E5%A4%A9%E6%B0%94%2F332535"}
```