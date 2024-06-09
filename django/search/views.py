from django.shortcuts import render
from elasticsearch import Elasticsearch
from django.http import JsonResponse

def get_es_client():
    client = Elasticsearch(
        "https://localhost:9200",
        api_key="THBQNl9JOEJhQUQ0VUdnUEsxYjU6cllZbU05UHhTejY0SGpSYmQxa3R4QQ==", # 替换为你的API key
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
        content = {
            "id": hit["_id"],
            "label": hit["_source"]["label"],
            "type": hit["_source"]["type"],
            "source": hit["_source"]["source"],
            "description": hit["_source"]["description"],
            "concepts": hit["_source"]["concepts"],
            "instances": hit["_source"]["instances"],
            "url": hit['_source']["url"],
        }
        contents.append(content)
    return JsonResponse({"content": contents}, json_dumps_params={'ensure_ascii': False})

def item(request):
    item_id = request.GET.get('id', '')
    client = get_es_client()
    response = client.get(index="my_index", id=item_id)
    item_data = {
        "id": response['_id'],
        "label": response['_source']["label"],
        "type": response['_source']["type"],
        "source": response['_source']["source"],
        "description": response['_source']["description"],
        "concepts": response['_source']["concepts"],
        "instances": response['_source']["instances"],
        "properties": response['_source']["properties"],
        "url": response['_source']["url"],
    }
    return JsonResponse(item_data, json_dumps_params={'ensure_ascii': False})
