from django.shortcuts import render
from django.http import HttpResponse
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

def index(request):
    return render(request, 'index.html')

def view_logs(request):
    log_path = os.path.join(BASE_DIR, 'django_errors.log')
    try:
        with open(log_path, 'r') as log_file:
            logs = log_file.read()
            return HttpResponse(f"<pre>{logs}</pre>", content_type="text/html")
    except FileNotFoundError:
        return HttpResponse("No logs found", status=404)
