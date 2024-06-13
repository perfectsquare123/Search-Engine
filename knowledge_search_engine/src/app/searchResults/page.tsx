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

const example2 = {
  answer: "",
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

function parseDescription(description: string): JSX.Element[] {
  const regex = /\[\[(.*?)\|(.*?)\]\]/g;
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
      <Button key={id} id={id} variant="ghost" colorScheme="green" size="sm">
        {query}
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

export default function SearchResults() {
  const searchParams = useSearchParams();
  const results = searchParams.get("results");
  const [searchResults, setSearchResults] = useState<SearchData[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (results) {
      setSearchResults(JSON.parse(results));
    }
  }, [results]);

  const handleSearch = async () => {
    //if (!query) return;

    router.push("/contentDisplay");
  };

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
                  <h3 className="text-2xl font-bold text-cyan-700 mb-1 cursor-pointer">
                    <a onClick={handleSearch}> {result.label}</a>
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
                  {parseDescription(result.description)}
                </p>

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
