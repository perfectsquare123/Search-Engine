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
          {results.map((result) => (
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
