"use client";

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
  id: "bdc32052",
  label: "三亚",
  type: "concept",
  source: "zh",
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
  ],
  properties: [
    {
      id: "属性ID",
      key: "时间",
      value: ["2009年7月"],
    },
    {
      id: "属性ID",
      key: "别名",
      value: ["崖州", "鹿城", "等等"],
    },
    {
      id: "属性ID",
      key: "外文名",
      value: ["Sanya"],
    },
    // ...
  ],
  url: "http://baike.baidu.com/fenlei/%E4%B8%89%E4%BA%9A%E6%97%85%E6%B8%B8",
};

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
          </Stack>

          <div className="mt-6">
            <h4 className="text-xl font-bold text-gray-700">
              Description 简介
            </h4>
            <p className="text-gray-600 mt-2">{contentData.description}</p>
          </div>

          <div className="mt-6">
            <h4 className="text-xl font-bold text-gray-700">Properties 属性</h4>
            {contentData.properties ? (
              contentData.properties.map((property) => (
                <TableContainer>
                  <Table>
                    <Tbody>
                      <Tr>
                        <Td>{property.key}</Td>
                        <Td>
                          <div className="flex flex-col align-middle">
                            {property.value.map((propValue) => (
                              <text className="text-gray-600">{propValue}</text>
                            ))}
                          </div>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              ))
            ) : (
              <text> </text>
            )}
          </div>

          {contentData.concepts.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-700">
                Concept 概念类型
              </h4>
              <Stack direction="row" spacing={2} className="mt-2">
                {contentData.concepts.map((concept) => (
                  <Button variant="ghost" colorScheme="cyan" size="sm">
                    {concept.label}
                  </Button>
                ))}
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
                {contentData.instances.map((instance) => (
                  <Button variant="ghost" colorScheme="cyan" size="sm">
                    {instance.label}
                  </Button>
                ))}
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