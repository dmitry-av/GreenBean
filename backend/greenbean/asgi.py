from configurations.asgi import get_asgi_application
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "greenbean.settings")
os.environ.setdefault('DJANGO_CONFIGURATION', 'Dev')


application = get_asgi_application()
