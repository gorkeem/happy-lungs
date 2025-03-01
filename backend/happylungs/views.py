from django.http import HttpResponse
from django.template.response import TemplateResponse
import os
from pathlib import Path
from django.http import HttpResponse

BASE_DIR = Path(__file__).resolve().parent.parent


def index(request):
    try:
        return TemplateResponse(request, 'index.html')  # Serve built frontend
    except Exception as e:
        return HttpResponse(f"Error loading index.html: {str(e)}", status=500)




def check_static(request):
    index_path = os.path.join(BASE_DIR, 'staticfiles', 'index.html')
    if os.path.exists(index_path):
        return HttpResponse(f"Found index.html at {index_path}")
    return HttpResponse("index.html NOT found", status=404)
