"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SearchBar from "../../components/SearchBar";
import { resourceLimits } from "worker_threads";
import { Button, Divider, Link, Stack, Tag } from "@chakra-ui/react";
import { subtle } from "crypto";
import { ExternalLinkIcon } from "@chakra-ui/icons";

interface SearchResult {
  id: string;
  label: string;
  type: string;
  source: string;
  description: string;
  concepts: { id: string; label: string }[];
  instances: { id: string; label: string }[];
  url: string;
}
//dummy data
const example = {
  content: [
    {
      id: "bdi2464893",
      label: "天气",
      type: "instance",
      source: "bd",
      description:
        "天气是指在较短时间内特定地区的 大气状况，出自太平天囯 [[bd4907785|洪仁玕]]《自传》。",
    },
    {
      id: "bdi2464890",
      label: "天气",
      type: "instance",
      source: "bd",
      description:
        "[[bd5103934|游戏王卡组]]系列之一。登场于新型卡包Deck Build Pack第1弹Spirit Warriors（DBSW）的系列。::;特色是使用连接怪兽或永续魔法·永续陷阱卡赋予相邻的「天气」效果怪兽以除外自身作为COST的干扰性效果，且「天气」效果怪兽本身就有作为「天气」效果COST除外则在下个回合的准备阶段特殊召唤的再生效果。",
    },
    {
      id: "zhi3184",
      label: "天气",
      type: "instance",
      source: "zh",
      description:
        ":;'''天气'''是大气状态的一种表征，反映大气是冷还是热、是干还是湿、是平静还是狂暴、是晴朗还是多云等等。Merriam-Webster Dictionary. Retrieved on 27 June 2008.绝大多数天气现象发生在[[zh26523]]之下的[[zh26522]]。Glossary of Meteorology. Retrieved on 27 June 2008.Glossary of Meteorology. Retrieved on 27 June 2008.天气通常指每天的温度和[[zh15946]]活动，而气候是指一段长时间内的平均大气状况。如果没有特别指明，“天气”一般指的是[[zh792254]]上的天气。",
    },
    {
      id: "bdi2464891",
      label: "天气",
      type: "instance",
      source: "bd",
      description:
        "[[bd2464891|天气]]是指某一个地区距离地表较近的大气层在短时间内的具体状态。而天气现象则是指发生在大气中的各种自然现象，即某瞬时内大气中各种气象要素（如 [[bd4682361|气温]]、 [[bd4681382|气压]]、 [[bd5128335|湿度]]、风、云、雾、雨、闪、雪、霜、雷、雹、霾等）空间分布的综合表现。::;天气过程就是一定地区的 [[bd2464990|天气现象]]随时间的变化过程。各种 [[bd2465006|天气系统]]都具有一定的空间尺度和时间尺度，而且各种尺度系统间相互交织、相互作用。许多天气系统的组合，构成大范围的天气形势，构成半球甚至全球的 [[bd2401722|大气环流]]。天气系统总是处在不断新生、发展和消亡过程中，在不同发展阶段有着其相对应的天气现象分布。",
    },
    {
      id: "bdi2464983",
      label: "天气气候学",
      type: "instance",
      source: "bd",
      description:
        "天气气侯学是气候学的一个分支,是以天气学的观点和方法来研究气候形成及其变化规律的学科。天气气侯学主要研究长时期内平均环流、环流型式与天气系统相互作用以及大气环流与大范围气候异常的关系等问题,为提高某地区天气预报准确率和阐明气候形成理论提供重要依据。其研究工具主要为天气图和气压配置图。未来天气气侯学将会采取更多定量分析的方法。",
    },
    {
      id: "bdi2464927",
      label: "天气和气候",
      type: "instance",
      source: "bd",
      description: "《天气和气候》是2008年电子工业出版社出版的图书。",
    },
    {
      id: "bdi2484426",
      label: "天罡气",
      type: "instance",
      source: "bd",
      description: "",
    },
    {
      id: "zhi765951",
      label: "BBC天气",
      type: "instance",
      source: "zh",
      description:
        "'''BBC天气'''（BBC Weather）是BBC的天气预报部门，现在是BBC新闻的一部分。BBC的气象主播为[[zh662244]]僱员 Met Office。BBC天气工作时间最长的气象主播是Michael Fish，他从1974年到2010年担任了36年的South East Today节目的气象主播。2013年8月23日，BBC宣布将中止和气象办公室的契约，以节省成本。",
    },
    {
      id: "zhi691063",
      label: "天气瓶",
      type: "instance",
      source: "zh",
      description:
        "'''天气瓶'''，又称'''风暴瓶'''（'''Storm Glass'''），是一种欧洲曾在18世纪~19世纪时用于天气预报工具。密闭的[[zh21964]]容器中，装入数种化学物质组成的透明[[zh8660]]。根据外界温度、天气的改变，瓶内会展现出不同型态的结晶，预报天气的变化。近代已不用作天气预报工具，而转变为一种趣味性质的科学装饰。",
    },
    {
      id: "zhi150123",
      label: "坏天气",
      type: "instance",
      source: "zh",
      description:
        "《'''坏天气'''》()为[[zh11708]]流行歌手[[zh73207]]所创作的单曲，收录在丹尼尔首张同名专辑《丹尼尔》，推出后成为加拿大单曲榜冠军。在欧洲，靠着可口可乐广告收录的关系，颇为传唱，在英国跃居英国单曲榜亚军。而后在美国推出后，攻佔告示牌流行榜榜首，成为同年告示牌流行榜冠军。::;《坏天气》一曲获得RIAA白金认证，并且在线上付费下载超过200万次。2005年8月2日到9日，在iTunes Store提供免费下载。丹尼尔借由本曲获得2007年[[zh20468]]最佳流行男歌手提名。告示牌选出《坏天气》为2006年流行音乐榜最棒的音乐。",
    },
  ],
};

const results = [
  {
    id: "bdc32052",
    label: "三亚旅游",
    type: "concept",
    source: "bd",
    description:
      "三亚，地处北纬18度，位于中国海南岛最南端，是地球上迷人的风景地带，四季如夏，鲜花盛开，素有“东方夏威夷”之称，堪称中国最好的旅游城市之一。 三亚以美丽的海上风光出名，亚龙湾、大东海、三亚湾这三大海湾是三亚主要的滨海",
    concepts: [
      {
        id: "概念ID 1",
        label: "概念名称 1",
      },
      {
        id: "概念ID 1",
        label: "概念名称 2",
      },
      // ...
    ],
    instances: [
      {
        id: "实例ID 1",
        label: "实例名称 1",
      },
      {
        id: "实例ID 2",
        label: "实例名称 2",
      },
      {
        id: "实例ID 3",
        label: "实例名称 3",
      },
      // ...
    ],
    url: "http://baike.baidu.com/fenlei/%E4%B8%89%E4%BA%9A%E6%97%85%E6%B8%B8",
  },
  {
    id: "bdc32052",
    label: "三亚市",
    type: "concept",
    source: "bd",
    description:
      "三亞市，簡稱崖，行政中心東遷之前曾稱崖州、崖縣，是中華人民共和國海南省下轄的一個享黎族自治待遇的非民族區域自治地級市，位於海南島的最南端。。",

    instances: [
      {
        id: "实例ID 1",
        label: "实例名称 1",
      },
      {
        id: "实例ID 2",
        label: "实例名称 2",
      },

      // ...
    ],
    url: "http://baike.baidu.com/fenlei/%E4%B8%89%E4%BA%9A%E6%97%85%E6%B8%B8",
  },
  // ...
];

export default function SearchResults() {
  //const router = useRouter();
  //const { q } = router.query;
  //const [results, setResults] = useState<SearchResult[]>([]);

  //const searchParams = useSearchParams();
  //const query = searchParams.get('q') || '';

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-center py-10">
        <SearchBar />
        <div className="w-full max-w-3xl mt-8 bg-white p-6 rounded-lg shadow-md">
          {example.content.map((result) => (
            <div key={result.id} className="mb-5">
              <Stack direction="row" spacing={3} alignItems="center">
                <h3 className="text-2xl font-bold text-cyan-700 mb-1">
                  {result.label}
                </h3>
                {result.type ? (
                  <Tag
                    variant="subtle"
                    colorScheme="cyan"
                    boxSize="fit-content"
                  >
                    {result.type}
                  </Tag>
                ) : (
                  ""
                )}
              </Stack>
              <p className="text-gray-700 mt-4">{result.description}</p>

              {result.concepts ? (
                <div className="mt-5">
                  <Stack direction="row" spacing={2}>
                    <h6 className="font-extralight text-gray-400 text-sm ml-4">
                      Concepts 概念类型
                    </h6>
                    {result.concepts.map((concept) => (
                      <Button variant="ghost" colorScheme="cyan" size="xs">
                        {concept.label}
                      </Button>
                    ))}
                  </Stack>
                </div>
              ) : (
                ""
              )}

              {result.instances ? (
                <div className="mt-4">
                  <Stack direction="row" spacing={2}>
                    <h6 className="font-extralight text-gray-400 text-sm ml-4">
                      Instances 实例
                    </h6>
                    {result.instances.map((instance) => (
                      <Button variant="ghost" colorScheme="cyan" size="xs">
                        {instance.label}
                      </Button>
                    ))}
                  </Stack>
                </div>
              ) : (
                ""
              )}

              {result.url ? (
                <div className="mt-4">
                  <Stack direction="row" spacing={4}>
                    <h6 className="font-extralight text-gray-400 text-sm ml-4">
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
  );
}
