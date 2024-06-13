import json
from django.shortcuts import render
from elasticsearch import Elasticsearch
from django.http import JsonResponse
import requests

API_KEY = "48CRns667HmxtXtR0Yfi2wAV"
SECRET_KEY = "ZhBC0J1Ku9cFvPCTFYCraTNpvnS09OhC"

def get_access_token():
    """
    使用 AK，SK 生成鉴权签名（Access Token）
    :return: access_token，或是None(如果错误)
    """
    url = "https://aip.baidubce.com/oauth/2.0/token"
    params = {"grant_type": "client_credentials", "client_id": API_KEY, "client_secret": SECRET_KEY}
    return str(requests.post(url, params=params).json().get("access_token"))

def get_es_client():
    client = Elasticsearch(
        "https://localhost:9200",
        api_key="UUotQURKQUJ3NmtCSElUOGVNNHY6ekJzR2g5dEtTSUtvM3N4TE9zcXJldw==", # Replace with your API key
        verify_certs=False,
        ssl_show_warn=False
    )
    return client

def search(request):
    query = request.GET.get('q', '')
    client = get_es_client()
    response = client.search(index="my_index", body={"query": {"match": {"label": query}}})
    contents = []
    for hit in response['hits']['hits']:
        source = hit.get("_source", {})
        content = {
            "id": hit.get("_id", ""),
            "label": source.get("label", ""),
            "type": source.get("type", ""),
            "source": source.get("source", ""),
            "description": source.get("description", ""),
            "concepts": source.get("concepts", []),
            "hypernymy": source.get("hypernymy", []),
            "hyponymy": source.get("hyponymy", []),
            "instances": source.get("instances", []),
            "url": source.get("url", ""),
        }
        contents.append(content)

    access_token = get_access_token()
    url = f"https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-4.0-8k-preview?access_token={access_token}"
    payload = json.dumps({
        "messages": [
            {
                "role": "user",
                "content": f"你需要对下面的查询提取出实体和属性，以帮助我更好的在知识搜索引擎中检索，如果没有实体或属性，请给出“无”的结果，示例：查询：“河南的省会是”，结果：“实体：河南；属性：省会”。查询：“河南”，结果：“无”。查询：“省会”，结果：“无”。，如果实体或属性是英文，请将第一个字母大写，比如查询：“what is nationality of Alice”，结果：“无”，“实体：Alice；属性：Nationality”。我的查询是“{query}”，请给出结果，不要添加其他内容"
            }
        ],
        "disable_search": False,
        "enable_citation": False
    })
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.request("POST", url, headers=headers, data=payload)
    result = response.json().get('result', '')
    if(result == '无'):
        return JsonResponse({"content": contents, "answer": ""}, json_dumps_params={'ensure_ascii': False})
    entity = result.split('；')[0].split('：')[-1] if '实体' in result else None
    attribute = result.split('；')[1].split('：')[-1] if '属性' in result else None
    
    if entity and attribute:
        response = client.search(index="my_index", body={"query": {"match": {"label": entity}}}, size=100)
        results = []
        if response['hits']['hits']:
            for hit in response['hits']['hits']:
                source = hit['_source']
                properties = source.get('properties', [])
                for prop in properties:
                    if prop['key'] == attribute:
                        results.append(prop['value'])
    
    answer = results[0] if results else ""
                        
    return JsonResponse({"content": contents, "answer": answer}, json_dumps_params={'ensure_ascii': False})


def item(request):
    item_id = request.GET.get('id', '')
    client = get_es_client()
    response = client.get(index="my_index", id=item_id)
    source = response.get('_source', {})
    item_data = {
        "id": response.get('_id', ''),
        "label": source.get("label", ""),
        "type": source.get("type", ""),
        "source": source.get("source", ""),
        "description": source.get("description", ""),
        "concepts": source.get("concepts", []),
        "hypernymy": source.get("hypernymy", []),
        "hyponymy": source.get("hyponymy", []),
        "instances": source.get("instances", []),
        "properties": source.get("properties", {}),
        "url": source.get("url", ""),
    }
    return JsonResponse(item_data, json_dumps_params={'ensure_ascii': False})
