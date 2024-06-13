"use client";

import SearchBar from "@/components/SearchBar";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Divider,
  Link,
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
} from "@chakra-ui/react";
import { Concert_One } from "next/font/google";

interface content {
  id: string;
  label: string;
  type: string;
  source: string;
  description: string;
  concepts: { id: string; label: string }[];
  instances: { id: string; label: string }[];
  properties: { id: string; key: string; value: string[] }[];
  url: string;
}

// dummy data
const contentData = {
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
  properties: [
    { id: "bdp1", key: "中文名", value: "天气" },
    {
      id: "bdp662",
      key: "基本解释",
      value: "在较短时间内特定地区的 [[bdi2401463|大气]]状况",
    },
    { id: "bdp9", key: "外文名", value: "weather" },
    { id: "bdp2211", key: "泛指", value: "[[bdi5933964|空气]]" },
  ],
  url: "https://baike.baidu.com/item/%E5%A4%A9%E6%B0%94%2F332535",
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

var sourceName = "百度 Baidu";
var sourceColour = "cyan";

export default function ContentDisplay() {
  if (contentData.source == "zh") {
    sourceName = "中文维基";
    sourceColour = "green";
  } else if (contentData.source == "en") {
    sourceName = "英文维基";
    sourceColour = "purple";
  }

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
              {contentData.label}
            </h3>
            <Badge
              variant="outline"
              boxSize="fit-content"
              colorScheme={sourceColour}
            >
              {sourceName}
            </Badge>
            {contentData.type == "instance" ? (
              <Badge variant="subtle" boxSize="fit-content" colorScheme="cyan">
                {contentData.type}
              </Badge>
            ) : (
              <Badge
                variant="subtle"
                boxSize="fit-content"
                colorScheme="purple"
              >
                {contentData.type}
              </Badge>
            )}
          </Stack>

          {contentData.description.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-700">
                Description 简介
              </h4>
              <p className="text-gray-600 mt-2">
                {parseDescription(contentData.description)}
              </p>
            </div>
          ) : (
            ""
          )}

          {contentData.properties.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-700">
                {" "}
                Properties 属性
              </h4>
              {contentData.properties.map((property) => (
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

          {contentData.concepts.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-700">
                Concept 概念类型
              </h4>
              <Stack direction="row" spacing={2} className="mt-2">
                <div>
                  {contentData.concepts.map((concept) => (
                    <Button variant="ghost" colorScheme="cyan" size="sm">
                      {concept.label}
                    </Button>
                  ))}
                </div>
              </Stack>
            </div>
          ) : (
            ""
          )}

          {contentData.hypernymy.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-700">
                hypernymy 上位关系列表
              </h4>
              <Stack direction="row" spacing={2} className="mt-2">
                <div>
                  {contentData.hypernymy.map((hypernymy) => (
                    <Button variant="ghost" colorScheme="cyan" size="sm">
                      {hypernymy.label}
                    </Button>
                  ))}
                </div>
              </Stack>
            </div>
          ) : (
            ""
          )}

          {contentData.hyponymy.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-700">
                hyponymy 下位关系列表
              </h4>
              <Stack direction="row" spacing={2} className="mt-2">
                <div>
                  {contentData.hyponymy.map((hyponymy) => (
                    <Button variant="ghost" colorScheme="cyan" size="sm">
                      {hyponymy.label}
                    </Button>
                  ))}
                </div>
              </Stack>
            </div>
          ) : (
            ""
          )}

          {contentData.instances.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-700">
                Instances 相关实例
              </h4>
              <Stack direction="row" spacing={2} className="mt-2">
                <div>
                  {contentData.instances.map((instance) => (
                    <Button variant="ghost" colorScheme="cyan" size="sm">
                      {instance.label}
                    </Button>
                  ))}
                </div>
              </Stack>
            </div>
          ) : (
            ""
          )}

          {contentData.url.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-700">
                Source URL 出处链接
              </h4>
              <div className="mt-2 ml-3">
                <Link href={contentData.url} isExternal color="darkblue">
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
