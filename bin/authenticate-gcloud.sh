#! /bin/bash

export CLOUDSDK_CORE_DISABLE_PROMPTS=1

openssl aes-256-cbc -K $encrypted_0e1011058c7f_key -iv $encrypted_0e1011058c7f_iv -in credentials.tar.gz.enc -out credentials.tar.gz -d
tar -xzf credentials.tar.gz
mkdir -p lib

gcloud auth activate-service-account --key-file client-secret.json
gcloud config set project $GCLOUD_PROJECT
gcloud config set compute/zone $COMPUTE_ZONE
gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin $DOCKER_REPO