"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import SearchBar from "../../components/SearchBar";
import { resourceLimits } from "worker_threads";
import { Button, Divider, Link, Stack, Tag } from "@chakra-ui/react";
import { subtle } from "crypto";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useSearchParams } from "next/navigation";

interface SearchResult {
  id: string;
  label: string;
  type: string;
  source: string;
  description: string;
  concepts: { id: string; label: string }[];
  hypernymy: { id: string; label: string }[];
  hyponymy: { id: string; label: string }[];
  instances: { id: string; label: string }[];
  url: string;
}

interface SearchData {
  answer: string;
  content: SearchResult[];
}

//dummy data
const example = {
  answer: "some answers",
  content: [
    {
      id: "bdi2464891",
      label: "天气",
      type: "instance",
      source: "bd",
      description:
        "[[bd2464891|天气]]是指某一个地区距离地表较近的大气层在短时间内的具体状态。而天气现象则是指发生在大气中的各种自然现象，即某瞬时内大气中各种气象要素（如 [[bd4682361|气温]]、 [[bd4681382|气压]]、 [[bd5128335|湿度]]、风、云、雾、雨、闪、雪、霜、雷、雹、霾等）空间分布的综合表现。::;天气过程就是一定地区的 [[bd2464990|天气现象]]随时间的变化过程。各种 [[bd2465006|天气系统]]都具有一定的空间尺度和时间尺度，而且各种尺度系统间相互交织、相互作用。许多天气系统的组合，构成大范围的天气形势，构成半球甚至全球的 [[bd2401722|大气环流]]。天气系统总是处在不断新生、发展和消亡过程中，在不同发展阶段有着其相对应的天气现象分布。",
      concepts: [
        { id: "bdc32484", label: "科学百科环境生态分类" },
        { id: "bdc9966", label: "自然现象" },
        { id: "bdc3313", label: "自然" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [
        { id: "bdi7192065", label: "远古时代" },
        { id: "bdi2507267", label: "太阳" },
        { id: "bdi6403245", label: "能见度" },
        { id: "bdi893002", label: "交通" },
      ],
      url: "https://baike.baidu.com/item/%E5%A4%A9%E6%B0%94%2F24449",
    },
    {
      id: "bdi2464893",
      label: "天气",
      type: "instance",
      source: "bd",
      description:
        "天气是指在较短时间内特定地区的 大气状况，出自太平天囯 [[bd4907785|洪仁玕]]《自传》。",
      concepts: [],
      hypernymy: [],
      hyponymy: [],
      instances: [
        { id: "bdi6909271", label: "诉衷情" },
        { id: "bdi8172348", label: "黄庭坚" },
        { id: "bdi4810184", label: "沙尘暴" },
        { id: "bdi4701999", label: "水浒传" },
      ],
      url: "https://baike.baidu.com/item/%E5%A4%A9%E6%B0%94%2F332535",
    },
    {
      id: "bdi2464890",
      label: "天气",
      type: "instance",
      source: "bd",
      description:
        "[[bd5103934|游戏王卡组]]系列之一。登场于新型卡包Deck Build Pack第1弹Spirit Warriors（DBSW）的系列。::;特色是使用连接怪兽或永续魔法·永续陷阱卡赋予相邻的「天气」效果怪兽以除外自身作为COST的干扰性效果，且「天气」效果怪兽本身就有作为「天气」效果COST除外则在下个回合的准备阶段特殊召唤的再生效果。",
      concepts: [{ id: "bdc25120", label: "娱乐" }],
      hypernymy: [],
      hyponymy: [],
      instances: [{ id: "bdi5103934", label: "游戏王卡组" }],
      url: "https://baike.baidu.com/item/%E5%A4%A9%E6%B0%94%2F21511882",
    },
    {
      id: "bdi2464927",
      label: "天气和气候",
      type: "instance",
      source: "bd",
      description: "《天气和气候》是2008年电子工业出版社出版的图书。",
      concepts: [
        { id: "bdc18567", label: "工业书籍" },
        { id: "bdc7948", label: "出版物" },
        { id: "bdc17963", label: "书籍" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [],
      url: "https://baike.baidu.com/item/%E5%A4%A9%E6%B0%94%E5%92%8C%E6%B0%94%E5%80%99",
    },
    {
      id: "bdi2464983",
      label: "天气气候学",
      type: "instance",
      source: "bd",
      description:
        "天气气侯学是气候学的一个分支,是以天气学的观点和方法来研究气候形成及其变化规律的学科。天气气侯学主要研究长时期内平均环流、环流型式与天气系统相互作用以及大气环流与大范围气候异常的关系等问题,为提高某地区天气预报准确率和阐明气候形成理论提供重要依据。其研究工具主要为天气图和气压配置图。未来天气气侯学将会采取更多定量分析的方法。",
      concepts: [
        { id: "bdc32484", label: "科学百科环境生态分类" },
        { id: "bdc27821", label: "非地理" },
        { id: "bdc18653", label: "气候学" },
        { id: "bdc17225", label: "大气科学" },
        { id: "bdc10428", label: "地理学" },
        { id: "bdc31911", label: "学科名" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [
        { id: "bdi7564534", label: "长期天气预报" },
        { id: "bdi2215399", label: "圣彼得堡" },
      ],
      url: "https://baike.baidu.com/item/%E5%A4%A9%E6%B0%94%E6%B0%94%E5%80%99%E5%AD%A6",
    },
    {
      id: "bdi2477703",
      label: "天然气",
      type: "instance",
      source: "bd",
      description:
        "天然气是指自然界中天然存在的一切气体，包括 大气圈、 水圈、和 岩石圈中各种自然过程形成的气体（包括 油田气、气田气、 泥火山气、 煤层气和 生物生成气等）。::;而人们长期以来通用的“天然气”的定义，是从能量角度出发的 狭义定义，是指天然蕴藏于地层中的 [[bd5223992|烃]]类和非烃类气体的混合物。在 [[bd5776189|石油地质学]]中，通常指油田气和气田气。其组成以烃类为主，并含有非烃气体。",
      concepts: [
        { id: "bdc32485", label: "科学百科工程技术分类" },
        { id: "bdc24480", label: "学科" },
        { id: "bdc32485", label: "科学百科工程技术分类" },
        { id: "bdc24480", label: "学科" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [
        { id: "bdi5775763", label: "石油" },
        { id: "bdi5249132", label: "煤炭" },
        { id: "bdi5248579", label: "煤" },
        { id: "bdi5008654", label: "液化石油气" },
      ],
      url: "https://baike.baidu.com/item/%E5%A4%A9%E7%84%B6%E6%B0%94%2F36482",
    },
    {
      id: "bdi248831",
      label: "V天气",
      type: "instance",
      source: "bd",
      description:
        "《V天气》是一款集成了当今各大门户网站的天气栏目，软件大小是0.64 MB。",
      concepts: [
        { id: "bdc12187", label: "软件" },
        { id: "bdc28962", label: "安卓软件" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [],
      url: "https://baike.baidu.com/item/V%E5%A4%A9%E6%B0%94",
    },
    {
      id: "bdi2484426",
      label: "天罡气",
      type: "instance",
      source: "bd",
      description: "",
      concepts: [
        { id: "bdc17963", label: "书籍" },
        { id: "bdc15571", label: "梦幻西游" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [
        { id: "bdi876183", label: "五雷轰顶" },
        { id: "bdi7784404", label: "雷霆万钧" },
        { id: "bdi2481551", label: "天神护体" },
      ],
      url: "https://baike.baidu.com/item/%E5%A4%A9%E7%BD%A1%E6%B0%94",
    },
    {
      id: "bdi2464931",
      label: "天气图",
      type: "instance",
      source: "bd",
      description:
        "天气图是指填有各地同一时间 气象要素的特制地图，是目前气象部门分析和预报天气的一种重要工具。",
      concepts: [
        { id: "bdc32484", label: "科学百科环境生态分类" },
        { id: "bdc22323", label: "科学" },
        { id: "bdc22247", label: "气象" },
        { id: "bdc17225", label: "大气科学" },
        { id: "bdc14829", label: "天气学" },
        { id: "bdc18649", label: "气象名词" },
        { id: "bdc22323", label: "科学" },
        { id: "bdc1542", label: "自然科学" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [
        { id: "bdi1016669", label: "传真" },
        { id: "bdi4683351", label: "气象卫星" },
        { id: "bdi2401722", label: "大气环流" },
      ],
      url: "https://baike.baidu.com/item/%E5%A4%A9%E6%B0%94%E5%9B%BE",
    },
    {
      id: "bdi2245320",
      label: "坏天气",
      type: "instance",
      source: "bd",
      description:
        "坏天气为 孙燕姿的第二张专辑《 我要的幸福》中歌曲，于2000年12月7日发行。",
      concepts: [
        { id: "bdc16459", label: "音乐作品" },
        { id: "bdc16459", label: "音乐作品" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [
        { id: "bdi3544941", label: "愚人的国度" },
        { id: "bdi1933210", label: "同类" },
        { id: "bdi534051", label: "世说心语" },
        { id: "bdi4002036", label: "明日的记忆" },
      ],
      url: "https://baike.baidu.com/item/%E5%9D%8F%E5%A4%A9%E6%B0%94%2F6262",
    },
  ],
};
const example1 = {
  answer: "",
  content: [
    {
      id: "zhc41287",
      label: "虚构象",
      type: "concept",
      source: "zh",
      description: "",
      concepts: [],
      hypernymy: [{ id: "zhc180586", label: "象题材作品" }],
      hyponymy: [],
      instances: [],
      url: "https://zh.wikipedia.org/wiki/Category:%E8%99%9B%E6%A7%8B%E8%B1%A1",
    },
    {
      id: "zhc379843",
      label: "虚构",
      type: "concept",
      source: "zh",
      description: "",
      concepts: [
        { id: "zhc292979", label: "戏剧" },
        { id: "zhc240856", label: "拟人论" },
      ],
      hypernymy: [],
      hyponymy: [
        { id: "zhc122012", label: "文字冒险游戏" },
        { id: "zhc160118", label: "殭尸片" },
        { id: "zhc387668", label: "神魔小说" },
        { id: "zhc183100", label: "节日题材作品" },
        { id: "zhc73767", label: "各类型虚构作品" },
        { id: "zhc219172", label: "中文小说" },
        { id: "zhc226953", label: "末日题材作品" },
        { id: "zhc208227", label: "哥特文学" },
        { id: "zhc433", label: "间谍题材作品" },
        { id: "zhc146816", label: "各主题虚构内容" },
        { id: "zhc88788", label: "虚构背景作品" },
        { id: "zhc214552", label: "情节" },
        { id: "zhc60506", label: "虚构事物" },
      ],
      instances: [
        { id: "zhi15691", label: "文字冒险游戏" },
        { id: "zhi40033", label: "网络小说" },
        { id: "zhi248728", label: "情节" },
        { id: "zhi286008", label: "虚构作品" },
        { id: "zhi168185", label: "虚构" },
        { id: "zhi254692", label: "大逆转" },
        { id: "zhi173607", label: "跨界作品" },
        { id: "zhi622929", label: "时代错误" },
      ],
      url: "https://zh.wikipedia.org/wiki/Category:%E8%99%9B%E6%A7%8B",
    },
    {
      id: "zhc18016",
      label: "虚构机构",
      type: "concept",
      source: "zh",
      description: "",
      concepts: [],
      hypernymy: [{ id: "zhc236400", label: "虚构组织" }],
      hyponymy: [
        { id: "zhc398993", label: "虚构超常现象管理调查局" },
        { id: "zhc217414", label: "虚构执法机构" },
        { id: "zhc281628", label: "虚构情报机构" },
        { id: "zhc122901", label: "虚构军事组织" },
      ],
      instances: [
        { id: "zhi441836", label: "黑衣警探" },
        { id: "zhi67607", label: "小孩大联盟" },
        { id: "zhi57835", label: "一官党" },
        { id: "zhi121569", label: "魔法部" },
        { id: "zhi49834", label: "公安九课" },
        { id: "zhi107918", label: "真理部" },
        { id: "zhi163687", label: "友爱部" },
      ],
      url: "https://zh.wikipedia.org/wiki/Category:%E8%99%9A%E6%9E%84%E6%9C%BA%E6%9E%84",
    },
    {
      id: "zhc385487",
      label: "虚构猫",
      type: "concept",
      source: "zh",
      description: "",
      concepts: [
        { id: "zhc286580", label: "猫主角故事" },
        { id: "zhc176525", label: "虚构豹" },
        { id: "zhc310802", label: "中国动漫角色" },
        { id: "zhc214907", label: "猫引诱剂" },
        { id: "zhc128512", label: "猫形类" },
        { id: "zhc171047", label: "猫粮" },
      ],
      hypernymy: [{ id: "zhc409291", label: "猫" }],
      hyponymy: [{ id: "zhc166048", label: "蓝猫" }],
      instances: [
        { id: "zhi45235", label: "飞虎奇兵" },
        { id: "zhi273990", label: "霹雳特警猫" },
        { id: "zhi102609", label: "黑猫警长" },
        { id: "zhi315086", label: "男孩和冤家猫" },
        { id: "zhi231949", label: "功夫猫党" },
        { id: "zhi36837", label: "叮当猫" },
        { id: "zhi530435", label: "罗小黑战记" },
        { id: "zhi37762", label: "超级小黑咪" },
        { id: "zhi235613", label: "猫狗" },
        { id: "zhi45347", label: "风之少年系列" },
        { id: "zhi331450", label: "千面飞龙" },
        { id: "zhi17651", label: "痒痒鼠与抓抓猫" },
        { id: "zhi765315", label: "胖吉猫" },
        { id: "zhi39136", label: "薛定谔猫" },
      ],
      url: "https://zh.wikipedia.org/wiki/Category:%E8%99%9B%E6%A7%8B%E8%B2%93",
    },
    {
      id: "zhc361072",
      label: "虚构牛",
      type: "concept",
      source: "zh",
      description: "",
      concepts: [],
      hypernymy: [{ id: "zhc1340", label: "家牛" }],
      hyponymy: [],
      instances: [{ id: "zhi31839", label: "鸡与牛" }],
      url: "https://zh.wikipedia.org/wiki/Category:%E8%99%9B%E6%A7%8B%E7%89%9B",
    },
    {
      id: "zhc135419",
      label: "虚构马",
      type: "concept",
      source: "zh",
      description: "",
      concepts: [],
      hypernymy: [
        { id: "zhc33121", label: "马" },
        { id: "zhc142374", label: "驯养动物" },
        { id: "zhc301506", label: "动物" },
      ],
      hyponymy: [],
      instances: [
        { id: "zhi101954", label: "牛头马面" },
        { id: "zhi212102", label: "鲍克斯" },
        { id: "zhi47033", label: "午" },
        { id: "zhi391951", label: "彩虹小马：友情就是魔法角色列表" },
        { id: "zhi36719", label: "特洛伊木马" },
      ],
      url: "https://zh.wikipedia.org/wiki/Category:%E8%99%9A%E6%9E%84%E9%A9%AC",
    },
    {
      id: "zhc109071",
      label: "虚构蛇",
      type: "concept",
      source: "zh",
      description: "",
      concepts: [
        { id: "zhc358695", label: "蛇解剖学" },
        { id: "zhc83471", label: "蛇电影" },
        { id: "zhc338021", label: "虚构蜥蜴" },
        { id: "zhc337018", label: "神话传说中的蛇" },
        { id: "zhc124845", label: "真蛇下目" },
        { id: "zhc362920", label: "怪物电影" },
        { id: "zhc152947", label: "蛇题材作品" },
        { id: "zhc188925", label: "白垩纪蛇类" },
        { id: "zhc383249", label: "盲蛇下目" },
      ],
      hypernymy: [
        { id: "zhc206407", label: "蛇亚目" },
        { id: "zhc222729", label: "虚构捕食者" },
      ],
      hyponymy: [],
      instances: [],
      url: "https://zh.wikipedia.org/wiki/Category:%E8%99%9B%E6%A7%8B%E8%9B%87",
    },
    {
      id: "zhc107176",
      label: "虚构鱼",
      type: "concept",
      source: "zh",
      description: "",
      concepts: [],
      hypernymy: [
        { id: "zhc14559", label: "虚构嵴椎动物" },
        { id: "zhc191111", label: "鱼类" },
      ],
      hyponymy: [{ id: "zhc29261", label: "虚构鲨鱼" }],
      instances: [{ id: "zhi707903", label: "灵感大王" }],
      url: "https://zh.wikipedia.org/wiki/Category:%E8%99%9B%E6%A7%8B%E9%AD%9A",
    },
    {
      id: "zhc176525",
      label: "虚构豹",
      type: "concept",
      source: "zh",
      description: "",
      concepts: [],
      hypernymy: [{ id: "zhc245518", label: "豹" }],
      hyponymy: [],
      instances: [],
      url: "https://zh.wikipedia.org/wiki/Category:%E8%99%9A%E6%9E%84%E8%B1%B9",
    },
    {
      id: "zhc177029",
      label: "虚构熊",
      type: "concept",
      source: "zh",
      description: "",
      concepts: [
        { id: "zhc330885", label: "眼镜熊亚科" },
        { id: "zhc62595", label: "熊属" },
        { id: "zhc41287", label: "虚构象" },
        { id: "zhc46610", label: "大熊猫属" },
      ],
      hypernymy: [{ id: "zhc91034", label: "熊科" }],
      hyponymy: [],
      instances: [
        { id: "zhi740950", label: "玛莎与熊" },
        { id: "zhi156533", label: "联合巴迪熊" },
        { id: "zhi6729", label: "小熊维尼" },
        { id: "zhi42003", label: "华斯比历险记" },
        { id: "zhi14611", label: "卡利斯托" },
        { id: "zhi240892", label: "倒霉熊" },
        { id: "zhi770093", label: "特务欧宝" },
        { id: "zhi528332", label: "熊出没" },
        { id: "zhi624026", label: "瑜伽熊秀" },
        { id: "zhi787645", label: "咱们裸熊" },
        { id: "zhi98724", label: "卡比兽" },
        { id: "zhi368061", label: "白熊咖啡厅" },
      ],
      url: "https://zh.wikipedia.org/wiki/Category:%E8%99%9B%E6%A7%8B%E7%86%8A",
    },
  ],
};

export default function SearchResults() {
  const searchParams = useSearchParams();
  const results = searchParams.get("results");
  const [searchResults, setSearchResults] = useState<SearchData[]>([]);

  useEffect(() => {
    if (results) {
      setSearchResults(JSON.parse(results));
    }
  }, [results]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-center py-10">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">
          Know<span className="text-6xl font-bold text-cyan-400">U</span>
        </h1>
        <SearchBar />
        <div>
          {example.answer.length > 0 ? (
            <div className="w-full max-w-3xl mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl text-zinc-800 mb-1">{example.answer}</h3>
            </div>
          ) : (
            ""
          )}

          <div className="w-full max-w-3xl mt-8 bg-white p-6 rounded-lg shadow-md">
            {example.content.map((result) => (
              <div key={result.id} className="mb-5">
                <Stack direction="row" spacing={3} alignItems="center">
                  <h3 className="text-2xl font-bold text-cyan-700 mb-1">
                    {result.label}
                  </h3>
                  {result.type ? (
                    result.type == "instance" ? (
                      <Tag
                        variant="subtle"
                        colorScheme="cyan"
                        boxSize="fit-content"
                      >
                        {result.type}
                      </Tag>
                    ) : (
                      <Tag
                        variant="subtle"
                        colorScheme="purple"
                        boxSize="fit-content"
                      >
                        {result.type}
                      </Tag>
                    )
                  ) : (
                    ""
                  )}
                </Stack>
                <p className="text-gray-700 mt-4">{result.description}</p>

                {result.concepts.length > 0 ? (
                  <div className="mt-5">
                    <Stack direction="row" spacing={2}>
                      <h6 className="font-extralight text-gray-500 text-sm ml-4">
                        Concepts 概念类型
                      </h6>
                      <div>
                        {result.concepts.map((concept) => (
                          <Button variant="ghost" colorScheme="blue" size="xs">
                            {concept.label}
                          </Button>
                        ))}
                      </div>
                    </Stack>
                  </div>
                ) : (
                  ""
                )}

                {result.hypernymy.length > 0 ? (
                  <div className="mt-5">
                    <Stack direction="row" spacing={2}>
                      <h6 className="font-extralight text-gray-500 text-sm ml-4">
                        hypernymy 上位关系列表
                      </h6>
                      <div>
                        {result.hypernymy.map((hypernymy) => (
                          <Button variant="ghost" colorScheme="blue" size="xs">
                            {hypernymy.label}
                          </Button>
                        ))}
                      </div>
                    </Stack>
                  </div>
                ) : (
                  ""
                )}

                {result.hyponymy.length > 0 ? (
                  <div className="mt-5">
                    <Stack direction="row" spacing={2}>
                      <h6 className="font-extralight text-gray-500 text-sm ml-4">
                        hyponymy 下位关系列表
                      </h6>
                      <div>
                        {result.hyponymy.map((hyponymy) => (
                          <Button variant="ghost" colorScheme="blue" size="xs">
                            {hyponymy.label}
                          </Button>
                        ))}
                      </div>
                    </Stack>
                  </div>
                ) : (
                  ""
                )}

                {result.instances.length > 0 ? (
                  <div className="mt-4">
                    <Stack direction="row" spacing={2}>
                      <h6 className="font-extralight text-gray-500 text-sm ml-4">
                        Instances 实例
                      </h6>
                      <div>
                        {result.instances.map((instance) => (
                          <Button variant="ghost" colorScheme="cyan" size="xs">
                            {instance.label}
                          </Button>
                        ))}
                      </div>
                    </Stack>
                  </div>
                ) : (
                  ""
                )}

                {result.url.length > 0 ? (
                  <div className="mt-4">
                    <Stack direction="row" spacing={4}>
                      <h6 className="font-extralight text-gray-500 text-sm ml-4">
                        Source URL 出处链接
                      </h6>

                      <Link href={result.url} isExternal color="darkblue">
                        Link <ExternalLinkIcon mx="2px" />
                      </Link>
                    </Stack>
                  </div>
                ) : (
                  ""
                )}

                <div className="my-8">
                  <Divider orientation="horizontal" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
