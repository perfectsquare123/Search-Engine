from django.shortcuts import render
from elasticsearch import Elasticsearch
from django.http import JsonResponse

def get_es_client():
    client = Elasticsearch(
        "https://localhost:9200",
        api_key="bENwc0JKQUJtQkV3TXpTWE9kMUY6aGpYd2N4aGZUNXUzQ2FrMnB0Y0J4Zw==", # Replace with your API key
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
    return JsonResponse({"content": contents}, json_dumps_params={'ensure_ascii': False})

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
