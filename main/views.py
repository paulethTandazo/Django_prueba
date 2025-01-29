from django.shortcuts import render
import requests
import json

# Create your views here.
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required, permission_required

@login_required
@permission_required('main.index_viewer', raise_exception=True)

def index(request):
    # Arme el endpoint del REST API
    current_url = request.build_absolute_uri()
    url = current_url + '/api/v1/landing'

    # Petición al REST API
    response_http = requests.get(url)
    response_dict = json.loads(response_http.content)

    print("Endpoint ", url)
    print("Response ", response_dict)
    


    # Respuestas totales
    total_responses = len(response_dict.keys())
    # Valores de la respuesta
    responses = list(response_dict.values())
    first_response = '{}\n{}'.format(responses[0]['email'].split("@")[0], responses[0]['albumfavorito'])
    last_response = '{}\n{}'.format(responses[-1]['email'].split("@")[0], responses[-1]['albumfavorito'])
    days_dict = {}
    for entry in responses:
        date = entry['saved'].split(',')[0]
        days_dict[date] = days_dict.get(date, 0) + 1

    highest_day = None
    highest_count = -1
    for key in list(days_dict.keys()):
        response_count = days_dict[key]
        if response_count > highest_count:
            highest_day = key
            highest_count = response_count
    data = {
        'title': 'Landing - Dashboard',
        'total_responses' : total_responses,
        'responses' : responses,
        'first_response' : first_response,
        'last_response' : last_response,
        'highest_day': highest_day

    }
    return render(request, 'main/index.html', data)