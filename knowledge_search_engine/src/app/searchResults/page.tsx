"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  content: [
    {
      id: "bdi2597570",
      label: "姚明",
      type: "instance",
      source: "bd",
      description:
        "姚明，中国一级作曲家，享受 国务院津贴。1948年出生，辽宁 营口市人。主要成就是大胆地将京剧曲调融入歌曲，是中国 [[bd3561461|戏歌]]的开山领路人。   [[bd1682916|华语音乐家协会]]理事，代表作品有歌曲《 前门情思大碗茶》《 [[bd3788458|故乡是北京]]》《 [[bd2095760|唱脸谱]]》《 大黄河》《 [[bd5618769|男子汉去飞行]]》等。::;舞蹈音乐《醉鼓》《 旦角》等。::;影视剧音乐《 西游记》续集插曲《就这样走》，《 [[bd2856660|小井胡同]]》， [[bd7071209|赵本山]]、 范伟的小品《 [[bd6107251|红高粱模特队]]》等。其作品曾获中宣部“ 五个一工程”奖，中国音乐“ 金钟奖”等多项政府奖   。::;2018年1月21日下午，著名作曲家姚明因病医治无效，在解放军总医院逝世，享年69岁。",
      concepts: [
        { id: "bdc22311", label: "音乐人物" },
        { id: "bdc31860", label: "娱乐人物" },
        { id: "bdc27178", label: "大陆音乐人" },
        { id: "bdc15475", label: "人物" },
        { id: "bdc22311", label: "音乐人物" },
        { id: "bdc31860", label: "娱乐人物" },
        { id: "bdc27178", label: "大陆音乐人" },
        { id: "bdc15475", label: "人物" },
        { id: "bdc17106", label: "中国" },
        { id: "bdc24851", label: "作曲家" },
        { id: "bdc24405", label: "艺术家" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [
        { id: "bdi7599103", label: "阎肃" },
        { id: "bdi4416255", label: "林爽" },
      ],
      url: "https://baike.baidu.com/item/%E5%A7%9A%E6%98%8E%2F9949328",
    },
    {
      id: "bdc5911",
      label: "姚明",
      type: "concept",
      source: "bd",
      description: "",
      concepts: [],
      hypernymy: [],
      hyponymy: [],
      instances: [
        { id: "bdi2597626", label: "姚明的NBA生涯" },
        { id: "bdi2597601", label: "姚明式营销" },
        { id: "bdi1637970", label: "十大体育明星赚钱之道" },
        { id: "bdi2595609", label: "姚基金" },
        { id: "bdi7273134", label: "邓健泓" },
        { id: "bdi999047", label: "休斯敦" },
        { id: "bdi999047", label: "休斯敦" },
        { id: "bdi999047", label: "休斯敦" },
        { id: "bdi999047", label: "休斯敦" },
        { id: "bdi195989", label: "NBA总决赛" },
        { id: "bdi1035738", label: "体育馆" },
        { id: "bdi1737515", label: "博·奥特罗" },
        { id: "bdi188141", label: "MM组合" },
        { id: "bdi7694815", label: "陈柏霖" },
        { id: "bdi6893581", label: "许孟哲" },
        { id: "bdi5152240", label: "漫画少年" },
        { id: "bdi6464328", label: "艾尔·霍福德" },
        { id: "bdi6464328", label: "艾尔·霍福德" },
        { id: "bdi6464328", label: "艾尔·霍福德" },
        { id: "bdi6464328", label: "艾尔·霍福德" },
        { id: "bdi6464328", label: "艾尔·霍福德" },
        { id: "bdi6464328", label: "艾尔·霍福德" },
        { id: "bdi4774015", label: "汤臣倍健" },
      ],
      url: "http://baike.baidu.com/fenlei/%E5%A7%9A%E6%98%8E",
    },
    {
      id: "bdi2597569",
      label: "姚明",
      type: "instance",
      source: "bd",
      description:
        "姚明（Yao Ming），1980年9月12日出生于上海市 [[bd3402827|徐汇区]]， [[bd5823355|祖籍]]江苏省 [[bd6514183|苏州市]]吴江区震泽镇，前中国职业篮球 [[bd7177327|运动员]]，司职 [[bd730934|中锋]]，现任中职联公司董事长兼总经理   。::;1998年4月，姚明入选 [[bd5479215|王非]] 执教的 [[bd2177859|国家队]]，开始篮球生涯。2001夺得CBA常规赛MVP，2002年夺得CBA总冠军以及总决赛MVP，分别3次当选CBA篮板王以及盖帽王，2次当选CBA扣篮王。在 [[bd22767|2002年NBA选秀]]中，他以 [[bd5336818|状元秀]]身份被NBA的 [[bd999062|休斯敦火箭队]]选中，2003-09年连续6个赛季（生涯共8次）入选 NBA全明星阵容，2次入选 [[bd196010|NBA最佳阵容]]二阵，3次入选 [[bd196010|NBA最佳阵容]]三阵。2009年，姚明收购上海男篮，成为 上海大鲨鱼篮球俱乐部老板。2011年7月20日，姚明正式宣布 [[bd7216718|退役]]。::;2013年，姚明当选为第十二届全国 [[bd3785690|政协委员]]。2014年6月，参加 [[bd5114480|湖南卫视]]《 [[bd5304672|爸爸去哪儿]]》客串嘉宾。2015年2月10日，姚明正式成为北京申办 冬奥会形象大使之一。2016年4月4日，姚明正式入选2016年 [[bd2525000|奈·史密斯篮球名人纪念堂]]，成为首位获此殊荣的 [[bd623879|中国人]]。10月，姚明成为中国' 火星大使'。11月，当选CBA公司副董事长   。::;2017年2月4日，姚明的11号球衣在火箭主场对公牛的 [[bd697447|中场休息]]时退役。2月23日，在中国篮球协会第九届全国代表大会上，姚明当选篮协主席。7月20日，经中国篮协提名，公司董事会表决通过任命姚明为CBA公司董事长。::;2017年10月20日，姚明已将上海哔哩哔哩俱乐部全部股权转让。",
      concepts: [
        { id: "bdc11074", label: "运动员" },
        { id: "bdc19357", label: "话题人物" },
        { id: "bdc23937", label: "篮球运动员" },
        { id: "bdc8842", label: "篮球" },
        { id: "bdc7941", label: "体育人物" },
        { id: "bdc11074", label: "运动员" },
        { id: "bdc19357", label: "话题人物" },
        { id: "bdc23937", label: "篮球运动员" },
        { id: "bdc8842", label: "篮球" },
        { id: "bdc7941", label: "体育人物" },
        { id: "bdc8842", label: "篮球" },
        { id: "bdc11074", label: "运动员" },
        { id: "bdc26958", label: "NBA球员" },
        { id: "bdc31148", label: "NBA奖项大全" },
        { id: "bdc5476", label: "福布斯中国名人榜" },
        { id: "bdc7913", label: "2012胡润少壮派富豪榜" },
        { id: "bdc24321", label: "2002感动中国十大人物" },
        { id: "bdc24250", label: "历届劳伦斯年度最佳新人奖" },
        { id: "bdc4891", label: "NBA2010-11赛季休斯敦火箭队阵容" },
        { id: "bdc8842", label: "篮球" },
        { id: "bdc11074", label: "运动员" },
        { id: "bdc26958", label: "NBA球员" },
        { id: "bdc31148", label: "NBA奖项大全" },
        { id: "bdc5476", label: "福布斯中国名人榜" },
        { id: "bdc7913", label: "2012胡润少壮派富豪榜" },
        { id: "bdc24321", label: "2002感动中国十大人物" },
        { id: "bdc24250", label: "历届劳伦斯年度最佳新人奖" },
        { id: "bdc4891", label: "NBA2010-11赛季休斯敦火箭队阵容" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [
        { id: "bdi1461346", label: "刘翔" },
        { id: "bdi4011471", label: "易建联" },
        { id: "bdi3578553", label: "成龙" },
        { id: "bdi5895173", label: "科比·布莱恩特" },
        { id: "bdi5447103", label: "王治郅" },
      ],
      url: "https://baike.baidu.com/item/%E5%A7%9A%E6%98%8E%2F28",
    },
    {
      id: "bdi2597568",
      label: "姚明",
      type: "instance",
      source: "bd",
      description:
        "姚明，男，汉族，出生于1966年6月，籍贯福建莆田   ，1989年毕业于 [[bd1798387|厦门大学]]企业管理专业   ，2004年，于厦门创办姚明织带饰品有限公司，任公司董事长。",
      concepts: [
        { id: "bdc5765", label: "行业人物" },
        { id: "bdc15475", label: "人物" },
        { id: "bdc5765", label: "行业人物" },
        { id: "bdc15475", label: "人物" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [
        { id: "bdi5862295", label: "福建" },
        { id: "bdi977133", label: "企业" },
        { id: "bdi1796926", label: "厦门" },
        { id: "bdi1798387", label: "厦门大学" },
        { id: "bdi6594923", label: "莆田" },
      ],
      url: "https://baike.baidu.com/item/%E5%A7%9A%E6%98%8E%2F20411080",
    },
    {
      id: "zhi2910",
      label: "姚明",
      type: "instance",
      source: "zh",
      description:
        "'''姚明'''（），生于中国上海市，[[zh103638]]江苏省[[zh322]][[zh441109]][[zh119734]]，着名篮球运动员，曾为中国国家篮球队队员，曾效力于中国篮球职业联赛（CBA）上海大鲨鱼篮球俱乐部和美国国家篮球协会（NBA）侯斯顿火箭，外号「'''移动长城'''」（The Great Wall）。现任中国篮球协会主席。::;1998年4月，姚明入选王非执教的国家队，开始了职业篮球生涯。并在中国篮球协会（CBA）的上海大鲨鱼效力了五年。2001夺得[[zh21891|CBA]][[zh61829]]，2002年获得了CBA总冠军以及CBA总决赛MVP。分别三次当选[[zh126019|CBA篮板王]]以及[[zh126076|CBA盖帽王]]，二次当选[[zh126090|CBA扣篮王]]。::;姚明是中国最具影响力的人物之一，同时也是世界最知名的[[zh1792]]运动员之一。2009年，姚明收购上海男篮，成为上海大鲨鱼篮球俱乐部老板。2011年7月20日，姚明正式宣佈退役。2016年11月22日，姚明出任CBA联盟副董事长。2017年2月，姚明当选为[[zh21892|中国篮球协会]]主席。2016年4月4日，姚明与前NBA球星沙奎尔·奥尼尔和艾伦·艾弗森一同入选奈史密斯篮球名人纪念堂，他也是首位入选名人堂的华裔球员。",
      concepts: [
        { id: "zhc384025", label: "中国篮球运动员" },
        { id: "zhc344937", label: "运动员出身的政治人物" },
        { id: "zhc54100", label: "休斯顿火箭队球员" },
        { id: "zhc51210", label: "上海大鲨鱼篮球俱乐部球员" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [
        { id: "zhi14893", label: "王治郅" },
        { id: "zhi1035", label: "NBA" },
        { id: "zhi15426", label: "孟克·巴特尔" },
        { id: "zhi193262", label: "金正恩" },
        { id: "zhi11055", label: "刘翔" },
      ],
      url: "https://zh.wikipedia.org/wiki/姚明",
    },
    {
      id: "bdi2597627",
      label: "姚明的故事",
      type: "instance",
      source: "bd",
      description:
        "《姚明的故事》是2011年4月由 [[bd1614398|北方妇女儿童出版社]]出版的图书，作者是王艳娥。本书主要讲述了姚明与篮球生涯的故事，不断奋斗的传奇故事等内容。",
      concepts: [
        { id: "bdc17963", label: "书籍" },
        { id: "bdc17963", label: "书籍" },
        { id: "bdc27424", label: "人物传记" },
        { id: "bdc3589", label: "体育明星" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [
        { id: "bdi2624551", label: "媒体" },
        { id: "bdi3513136", label: "悉尼" },
        { id: "bdi195877", label: "NBA" },
        { id: "bdi195967", label: "NBA季后赛" },
      ],
      url: "https://baike.baidu.com/item/%E5%A7%9A%E6%98%8E%E7%9A%84%E6%95%85%E4%BA%8B",
    },
    {
      id: "bdi7123967",
      label: "身高",
      type: "instance",
      source: "bd",
      description:
        "[[bd7123967|身高]]是指从 [[bd2516561|头顶点]](v)至 [[bd2242064|地面]]的垂距，一般以 [[bd1789086|厘米]]（ cm）作单位，也较经常用“ [[bd6022096|米]]”（ [[bd6022096|m]]）。   身高是对 [[bd910008|人体]]纵向部分的长度，源于人体的纵向生长，受 [[bd7264791|遗传]]因素的影响较大。女孩比男孩身高发育的早，在12-13岁为快速增长时期，到19-23岁开始停止增长，而男孩身高发育的晚，在15-16岁为快速增长时期，到20-24岁停止增长，四肢长骨和脊椎骨均已完成骨化，身高就停止增长了。影响身高的因素很多，如 遗传、 [[bd6629121|营养]]、 [[bd1035656|体育运动]]、 [[bd5491309|环境]]、 [[bd5569158|生活习惯]]、民族种族、 [[bd1295035|内分泌]]、 [[bd3481923|性成熟]]早晚（初潮年龄18岁比11岁者平均高出5厘米）、远近亲婚配、 [[bd1626580|医学]]进步等等。",
      concepts: [
        { id: "bdc22323", label: "科学" },
        { id: "bdc21547", label: "疾病" },
        { id: "bdc24480", label: "学科" },
        { id: "bdc27049", label: "医学术语" },
        { id: "bdc12649", label: "人体测量" },
        { id: "bdc20322", label: "发育" },
        { id: "bdc27049", label: "医学术语" },
        { id: "bdc32429", label: "应用科学" },
        { id: "bdc22323", label: "科学" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [
        { id: "bdi1035939", label: "体重" },
        { id: "bdi5566862", label: "生日" },
        { id: "bdi3481137", label: "性别" },
        { id: "bdi1891084", label: "右脚" },
        { id: "bdi4019465", label: "星座" },
      ],
      url: "https://baike.baidu.com/item/%E8%BA%AB%E9%AB%98",
    },
    {
      id: "bdi7122932",
      label: "身份的证明",
      type: "instance",
      source: "bd",
      description:
        "电视剧《身份的证明》是由毛卫宁执导的反特剧，张涵予、罗海琼等参加演出。该剧讲述了一个共产党员用其一生的信仰为自己证明身份的故事。",
      concepts: [
        { id: "bdc232", label: "内地电视剧" },
        { id: "bdc24256", label: "影视" },
        { id: "bdc11017", label: "电视" },
        { id: "bdc24482", label: "小说" },
        { id: "bdc13106", label: "毛卫宁–执导电视剧" },
        { id: "bdc20010", label: "张涵予主要作品" },
        { id: "bdc10720", label: "电视剧" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [
        { id: "bdi3315726", label: "张涵予" },
        { id: "bdi7503870", label: "钻石王老五的艰难爱情" },
        { id: "bdi8143453", label: "鹿鼎记" },
        { id: "bdi4149768", label: "望族" },
        { id: "bdi2650217", label: "孙武" },
      ],
      url: "https://baike.baidu.com/item/%E8%BA%AB%E4%BB%BD%E7%9A%84%E8%AF%81%E6%98%8E%2F15923",
    },
    {
      id: "bdi7122931",
      label: "身份的证明",
      type: "instance",
      source: "bd",
      description:
        "《身份的证明》易丹、钱滨创作小说。《身份的证明》超越了一般意义的反特故事，它将跨度拉长到近半个世纪，把5个主要人物的命运由每个历史时期的案件串联起来，故事的终极意义在于通过人物过去的付出和现时的遭遇，再现国家发展过程中那些默默无闻的幕后英雄精神不屈的本质。",
      concepts: [
        { id: "bdc4630", label: "文学作品" },
        { id: "bdc24828", label: "小说作品" },
        { id: "bdc24482", label: "小说" },
        { id: "bdc2960", label: "娱乐作品" },
        { id: "bdc17963", label: "书籍" },
        { id: "bdc10032", label: "中国文学" },
        { id: "bdc4630", label: "文学作品" },
        { id: "bdc24828", label: "小说作品" },
        { id: "bdc24482", label: "小说" },
        { id: "bdc2960", label: "娱乐作品" },
        { id: "bdc17963", label: "书籍" },
        { id: "bdc10032", label: "中国文学" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [{ id: "bdi2993570", label: "峰回路转" }],
      url: "https://baike.baidu.com/item/%E8%BA%AB%E4%BB%BD%E7%9A%84%E8%AF%81%E6%98%8E%2F10894163",
    },
    {
      id: "bdi2597596",
      label: "姚明宝",
      type: "instance",
      source: "bd",
      description:
        "姚明宝，汉族，中国党员，2008年1月当选上海市人大常委会秘书长。",
      concepts: [
        { id: "bdc28737", label: "政治人物" },
        { id: "bdc32018", label: "官员" },
        { id: "bdc15475", label: "人物" },
      ],
      hypernymy: [],
      hyponymy: [],
      instances: [
        { id: "bdi8274955", label: "龚学平" },
        { id: "bdi4910802", label: "洪浩" },
        { id: "bdi2599522", label: "姚莉" },
        { id: "bdi7863534", label: "韩正" },
        { id: "bdi8197925", label: "黄跃金" },
      ],
      url: "https://baike.baidu.com/item/%E5%A7%9A%E6%98%8E%E5%AE%9D",
    },
  ],
  answer: "226厘米",
};

export default function SearchResults() {
  // const searchParams = useSearchParams();
  // const results = searchParams.get("results");
  const storedResults = sessionStorage.getItem("searchResults");
  //const results = storedResults ? JSON.parse(storedResults) : [];
  const [searchResults, setSearchResults] = useState<SearchData>(example);
  const router = useRouter();

  useEffect(() => {
    if (storedResults) {
      setSearchResults(JSON.parse(storedResults));
    }
  }, []);

  // if (!searchResults) {
  //   return <div>Loading...</div>;
  // }

  function parseDescription(
    description: string,
    handleSearchID: (id: string) => void
  ): JSX.Element[] {
    const regex = /\[\[(.*?)(?:\|(.*?))?\]\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(description)) !== null) {
      const [fullMatch, id, query] = match;
      const index = match.index;

      // Add text before the match
      if (index > lastIndex) {
        parts.push(description.substring(lastIndex, index));
      }

      // Add the link/button
      parts.push(
        <Button
          key={id}
          id={id}
          variant="ghost"
          colorScheme="green"
          size="sm"
          onClick={() => handleSearchID(id)}
        >
          {query || id}
        </Button>
      );

      lastIndex = index + fullMatch.length;
    }

    // Add remaining text
    if (lastIndex < description.length) {
      parts.push(description.substring(lastIndex));
    }

    return parts;
  }

  const handleSearchID = async (id: string) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/item", {
        params: { id: id },
      });

      console.log("response received");

      const content = response.data;
      console.log(content);
      sessionStorage.setItem("contentDisplay", JSON.stringify(content));
      console.log("STORED");

      // Check if router.push is defined and usable
      if (router && typeof router.push === "function") {
        router.push("/contentDisplay");
        console.log("Navigated to /contentDisplay");
      } else {
        console.error("router.push is not a function or router is not defined");
      }
    } catch (error) {
      console.error("Error fetching content display results:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-center py-10">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">
          Know<span className="text-6xl font-bold text-cyan-400">U</span>
        </h1>
        <SearchBar />
        <div>
          {searchResults.answer.length > 0 ? (
            <div className="w-full max-w-3xl mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl text-zinc-800 mb-1">
                {parseDescription(searchResults.answer)}
              </h3>
            </div>
          ) : (
            ""
          )}

          <div className="w-full max-w-3xl mt-8 bg-white p-6 rounded-lg shadow-md">
            {searchResults.content.map((result) => (
              <div key={result.id} className="mb-5">
                <Stack direction="row" spacing={3} alignItems="center">
                  <h3 className="text-2xl font-bold text-cyan-700 mb-1 cursor-pointer">
                    <a onClick={() => handleSearchID(result.id)}>
                      {" "}
                      {result.label}
                    </a>
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
                <p className="text-gray-700 mt-4">
                  {parseDescription(result.description, handleSearchID)}
                </p>

                {result.concepts.length > 0 ? (
                  <div className="mt-5">
                    <Stack direction="row" spacing={2}>
                      <h6 className="font-extralight text-gray-500 text-sm ml-4">
                        Concepts 概念类型
                      </h6>
                      <div>
                        {result.concepts.map((concept) => (
                          <Button
                            variant="ghost"
                            colorScheme="blue"
                            size="xs"
                            onClick={() => handleSearchID(concept.id)}
                          >
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
                          <Button
                            variant="ghost"
                            colorScheme="blue"
                            size="xs"
                            onClick={() => handleSearchID(hypernymy.id)}
                          >
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
                          <Button
                            variant="ghost"
                            colorScheme="blue"
                            size="xs"
                            onClick={() => handleSearchID(hyponymy.id)}
                          >
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
                          <Button
                            variant="ghost"
                            colorScheme="cyan"
                            size="xs"
                            onClick={() => handleSearchID(instance.id)}
                          >
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
