from django.shortcuts import render
from django.http import HttpResponse
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

def dump_logs_to_static():
    log_path = os.path.join(BASE_DIR, 'django_errors.log')
    static_log_path = os.path.join(BASE_DIR, 'staticfiles', 'django_errors.log')
    try:
        with open(log_path, 'r') as source_log, open(static_log_path, 'w') as static_log:
            static_log.write(source_log.read())
    except Exception as e:
        print(f"Failed to copy logs: {e}")

def index(request):
    dump_logs_to_static()
    return render(request, 'index.html')

def view_logs(request):
    log_path = os.path.join(BASE_DIR, 'django_errors.log')
    try:
        with open(log_path, 'r') as log_file:
            logs = log_file.read()
            return HttpResponse(f"<pre>{logs}</pre>", content_type="text/html")
    except FileNotFoundError:
        return HttpResponse("No logs found", status=404)
