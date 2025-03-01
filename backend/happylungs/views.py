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
    try:
        return render(request, 'index.html')
    except Exception as e:
        import logging
        logging.error(f"Template render error: {e}")
        return HttpResponse("Template error!", status=500)


def view_logs(request):
    log_path = os.path.join(BASE_DIR, 'django_errors.log')
    print(f"Checking log path: {log_path}")

    if not os.path.exists(log_path):
        return HttpResponse(f"Log file not found at: {log_path}", status=404)

    try:
        with open(log_path, 'r') as log_file:
            logs = log_file.read()
            return HttpResponse(f"<pre>{logs}</pre>", content_type="text/html")
    except Exception as e:
        return HttpResponse(f"Unexpected error: {e}", status=500)

