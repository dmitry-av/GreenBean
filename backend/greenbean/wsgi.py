from configurations.wsgi import get_wsgi_application
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "greenbean.settings")
os.environ.setdefault("DJANGO_CONFIGURATION", "Dev")


application = get_wsgi_application()
