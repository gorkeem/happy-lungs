from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    try:
        return render(request, 'index.html')  # Just 'index.html' if in staticfiles
    except Exception as e:
        return HttpResponse(f"Error loading index.html: {str(e)}", status=500)
