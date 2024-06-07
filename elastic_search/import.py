from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
import ijson

def load_and_limit_json_items(filename, max_items=3505391):
    """
    逐项加载JSON数据，并限制处理的最大项数。
    """
    with open(filename, 'r', encoding='utf-8') as file:
        # ijson.items 返回一个生成器，每次产生一个项目
        items = ijson.items(file, 'item')
        for i, item in enumerate(items):
            if i >= max_items:
                break
            yield item

def generate_actions(json_items):
    """
    生成发送到Elasticsearch批量API的操作。
    """
    for item in json_items:
        yield {
            "_index": "my_index",  # 指定要导入的索引名
            "_id": item["id"],
            "_source": {
                "label": item["label"],
                "type": item["type"],
                "source": item["source"],
                "description": item["description"]
            }
        }

def main():
    # 实例化Elasticsearch客户端
    client = Elasticsearch(
        "https://localhost:9200",  # 替换为你的Elasticsearch endpoint
        api_key="NTlmWThZOEJqVTZfcks2cmRiRWU6VWtuMGxRRzZTZUdFMm1jRHp1R2ZoUQ==",  # 替换为你的API key
        verify_certs=False,  # 忽略证书验证
        ssl_show_warn=False
    )
    
    # 加载JSON数据并限制文档数量
    json_items = load_and_limit_json_items('instance.json', 3505391)  # 限制为100000个文档

    # 使用批量API导入数据
    success, _ = bulk(client, generate_actions(json_items))
    print(f"Successfully indexed {success} documents.")

if __name__ == "__main__":
    main()
