"use client";

import SearchBar from "@/components/SearchBar";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Divider,
  Stack,
  Tag,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  UnorderedList,
  ListItem,
  Link,
} from "@chakra-ui/react";
import { Concert_One } from "next/font/google";
import { useRouter } from "next/navigation";
//import NextLink from "next/link";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Content {
  id: string;
  label: string;
  type: string;
  source: string;
  description: string;
  concepts: { id: string; label: string }[];
  hypernymy: { id: string; label: string }[];
  hyponymy: { id: string; label: string }[];
  instances: { id: string; label: string }[];
  properties: { id: string; key: string; value: string }[];
  url: string;
}

// dummy data
const contentData = {
  id: "zhi128",
  label: "北京市",
  type: "instance",
  source: "zh",
  description:
    "'''北京市'''，简称“'''京'''”，是中华人民共和国[[zh496]]、[[zh1770]]、中国国家中心城市和[[zh40713]]的重要组成部分，是中国的[[zh848]]、[[zh326]]、科技创新和国际交往中心，具有重要的国际影响力。::;北京位于华北平原的西北边缘，背靠燕山，有[[zh29766]]流经老城西南，毗邻[[zh130]]、[[zh110]]，是一座有三千余年建城历史、八百六十余年建都史的历史文化名城，历史上有[[zh9899|金]]、[[zh248|元]]、[[zh82150|明]]、清、中华民国（[[zh3226]]时期）等五个朝代在此定都，以及数个政权建政于此，荟萃了自元明清以来的[[zh609548]]，拥有众多历史名胜古迹和人文景观。[[zh18113|公元前1046年]][[zh1116]]灭[[zh1983|商]]后，封宗室[[zh66924]]于[[zh25835]]，是为北京建城之始。金中都时期人口超过一百万。金中都为元、明、清三代的北京城的建设奠定了基础。北京与西安、南京、洛阳并称中国“四大古都”，拥有7项世界遗产，是世界上拥有[[zh42744]]项目数最多的城市。::;《不列颠百科全书》将北京形容为全球最伟大的城市之一，而且断言“这座城市是中国历史上最重要的组成部分。在中国过去的8个世纪里，几乎北京所有主要建筑都拥有着不可磨灭的民族和历史意义”。北京古迹众多，着名的有紫禁城、[[zh1487]]、避暑山庄、[[zh13022]]、[[zh14871]]、[[zh17451]]等。::;今日的北京，已发展成为一座现代化的大都市：[[zh1349]]、[[zh381]]、[[zh3924]]等教育和科研机构座落于北京市区；[[zh40055|金融街]]是中国金融监管机构办公地点和金融业聚集地；[[zh220274]]是北京经济的象征；[[zh88621]]是世界知名的当代艺术中心；此外，中国国家大剧院、[[zh26920]]3号航站楼、中央电视台总部大楼、“[[zh72378|鸟巢]]”、“水立方”、[[zh444452]]等具有现代风格的建筑成为古老北京新的名片。每年有超过1亿4700万人到北京旅游。",
  concepts: [{ id: "zhc238712", label: "亚洲首都" }],
  hypernymy: [],
  hyponymy: [],
  instances: [
    { id: "zhi9053", label: "西城区" },
    { id: "zhi11702", label: "海淀区" },
    { id: "zhi19004", label: "东城区 (北京市)" },
    { id: "zhi33", label: "中华人民共和国" },
    { id: "zhi13830", label: "朝阳区 (北京市)" },
  ],
  properties: [{ id: "zhp325", key: "Ĵ", value: "bak1ging1" }],
  url: "https://zh.wikipedia.org/wiki/北京市",
};

var sourceName = "百度 Baidu";
var sourceColour = "cyan";

export default function ContentDisplay() {
  const router = useRouter();
  const storedContentResults = sessionStorage.getItem("contentDisplay");
  //const contentResults = storedContentResults ? JSON.parse(storedContentResults) : [];
  const [contentDisplayResults, setContentDisplayResults] =
    useState<Content>(contentData);

  useEffect(() => {
    if (storedContentResults) {
      setContentDisplayResults(JSON.parse(storedContentResults));
    }
  }, []);

  if (contentDisplayResults.source == "zh") {
    sourceName = "中文维基";
    sourceColour = "green";
  } else if (contentDisplayResults.source == "en") {
    sourceName = "英文维基";
    sourceColour = "purple";
  }

  function parseDescription(description: string): JSX.Element[] {
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

  const handleClickTitle = async () => {
    router.push("/");
  };

  const handleSearchID = async (id: string) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/item", {
        params: { id: id },
      });

      const content = response.data;
      sessionStorage.setItem("contentDisplay", JSON.stringify(content));

      // Check if router.push is defined and usable
      if (router && typeof router.push === "function") {
        router.refresh();
        router.push("/contentDisplay");
        const temp = sessionStorage.getItem("contentDisplay");
        if (temp) {
          setContentDisplayResults(JSON.parse(temp));
        }

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
        <div className="w-full max-w-4xl mt-10 bg-white p-12 rounded-lg shadow-md">
          <Stack spacing={4} direction="row" alignItems="center">
            <h3 className="text-3xl font-bold text-cyan-900">
              {contentDisplayResults.label}
            </h3>
            <Badge
              variant="outline"
              boxSize="fit-content"
              colorScheme={sourceColour}
            >
              {sourceName}
            </Badge>
            {contentDisplayResults.type == "instance" ? (
              <Badge variant="subtle" boxSize="fit-content" colorScheme="cyan">
                {contentDisplayResults.type}
              </Badge>
            ) : (
              <Badge
                variant="subtle"
                boxSize="fit-content"
                colorScheme="purple"
              >
                {contentDisplayResults.type}
              </Badge>
            )}
          </Stack>

          {contentDisplayResults.description.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-700">
                Description 简介
              </h4>
              <p className="text-gray-600 mt-2">
                {parseDescription(contentDisplayResults.description)}
              </p>
            </div>
          ) : (
            ""
          )}

          {contentDisplayResults.properties.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-700">
                {" "}
                Properties 属性
              </h4>
              {contentDisplayResults.properties.map((property) => (
                <TableContainer>
                  <Table>
                    <Tbody>
                      <Tr>
                        <Td>{property.key}</Td>
                        <Td>
                          <div className="flex flex-col align-middle">
                            <text className="text-gray-600">
                              {parseDescription(property.value)}
                            </text>
                          </div>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              ))}
            </div>
          ) : (
            ""
          )}

          {contentDisplayResults.concepts.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-700">
                Concept 概念类型
              </h4>
              <Stack direction="row" spacing={2} className="mt-2">
                <div>
                  {contentDisplayResults.concepts.map((concept) => (
                    <Button
                      variant="ghost"
                      colorScheme="cyan"
                      size="sm"
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

          {contentDisplayResults.hypernymy.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-700">
                hypernymy 上位关系列表
              </h4>
              <Stack direction="row" spacing={2} className="mt-2">
                <div>
                  {contentDisplayResults.hypernymy.map((hypernymy) => (
                    <Button
                      variant="ghost"
                      colorScheme="cyan"
                      size="sm"
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

          {contentDisplayResults.hyponymy.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-700">
                hyponymy 下位关系列表
              </h4>
              <Stack direction="row" spacing={2} className="mt-2">
                <div>
                  {contentDisplayResults.hyponymy.map((hyponymy) => (
                    <Button
                      variant="ghost"
                      colorScheme="cyan"
                      size="sm"
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

          {contentDisplayResults.instances.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-700">
                Instances 相关实例
              </h4>
              <Stack direction="row" spacing={2} className="mt-2">
                <div>
                  {contentDisplayResults.instances.map((instance) => (
                    <Button
                      variant="ghost"
                      colorScheme="cyan"
                      size="sm"
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

          {contentDisplayResults.url.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-700">
                Source URL 出处链接
              </h4>
              <div className="mt-2 ml-3">
                <Link
                  href={contentDisplayResults.url}
                  isExternal
                  color="darkblue"
                >
                  Link <ExternalLinkIcon mx="2px" />
                </Link>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
