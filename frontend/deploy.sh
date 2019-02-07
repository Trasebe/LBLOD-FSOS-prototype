#! /bin/sh

DOCKER_ID_USER="trase"

docker build -t $DOCKER_ID_USER/frontend:0.1.0 .
docker tag $DOCKER_ID_USER/frontend $DOCKER_ID_USER/frontend:0.1.0
docker push $DOCKER_ID_USER/frontend:0.1.0