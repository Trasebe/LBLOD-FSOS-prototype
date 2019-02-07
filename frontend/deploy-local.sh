#! /bin/sh

DOCKER_ID_USER="trase"

docker build -t $DOCKER_ID_USER/frontend-local:latest .
docker tag $DOCKER_ID_USER/frontend-local $DOCKER_ID_USER/frontend-local:latest
docker push $DOCKER_ID_USER/frontend-local:latest