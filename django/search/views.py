from django.shortcuts import render
from elasticsearch import Elasticsearch
from django.http import JsonResponse

def get_es_client():
    client = Elasticsearch(
        "https://localhost:9200",
        api_key="NTlmWThZOEJqVTZfcks2cmRiRWU6VWtuMGxRRzZTZUdFMm1jRHp1R2ZoUQ==",
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
            # "url": ...
            # "concepts": [...],
            # "instances": [...]
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
        # "url": ...
        # "properties": [...],
        # "concepts": [...],
        # "instances": [...]
    }
    return JsonResponse(item_data, json_dumps_params={'ensure_ascii': False})
