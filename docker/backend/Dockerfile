FROM python:3.10-slim

WORKDIR /app
ADD ./backend/requirements.txt /app/backend/
# keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

RUN pip install --upgrade pip
RUN pip install gunicorn
RUN pip install -r backend/requirements.txt

ADD ./docker /app/docker
ADD ./backend /app/backend