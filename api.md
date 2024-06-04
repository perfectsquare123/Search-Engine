# API 文档

### 1. 搜索内容

- **URL**: /search

- **接口说明**: 用于用户搜索内容。

- **请求方法**: GET

- **请求参数**: 

| 参数名 | 必须 | 类型   | 描述     |
| ------ | ---- | ------ | -------- |
| q      | 是   | string | 搜索内容 |

- **示例**: GET /search?q=天气

- **成功响应**

```json
{
    "content": [
        {
            "id": "bdc32052",
            "label": "三亚旅游",
            "type": "concept",
            "source": "bd",
            "description": "三亚旅游的详细描述...",
            "concepts":[
                {
                    "id": "概念ID",
                    "label":"概念名称"
                }
                // ...
            ],
            "instances": [
                {
                    "id": "实例ID",
                    "label": "实例名称"
                }
                // ...
            ],
            // "properties": [
            //     {
            //         "id": "属性ID",
            //         "key": "时间",
            //         "value": "2009年7月"
            //     }
            //     // ...
            // ],
            "url": "http://baike.baidu.com/fenlei/%E4%B8%89%E4%BA%9A%E6%97%85%E6%B8%B8"
        }
        // ...
    ]
}
```

- **错误响应**



### 2. 查看实体

- **URL**: /item

- **接口说明**: 用于用户查看实体具体信息。

- **请求方法**: GET

- **请求参数**: 

| 参数名 | 必须 | 类型   | 描述   |
| ------ | ---- | ------ | ------ |
| id     | 是   | string | 实体ID |

- **示例**: GET /item?id=bdc32052

- **成功响应**

```json
{
    "id": "bdc32052",
    "label": "三亚旅游",
    "type": "concept",
    "source": "bd",
    "description": "三亚旅游的详细描述...",
    "concepts":[
        {
            "id": "概念ID",
            "label":"概念名称"
        }
        // ...
    ],
    "instances": [
        {
            "id": "实例ID",
            "label": "实例名称"
        }
        // ...
    ],
    "properties": [
        {
            "id": "属性ID",
            "key": "时间",
            "value": "2009年7月"
        }
        // ...
    ],
    "url": "http://baike.baidu.com/fenlei/%E4%B8%89%E4%BA%9A%E6%97%85%E6%B8%B8"
}
```

- **错误响应**