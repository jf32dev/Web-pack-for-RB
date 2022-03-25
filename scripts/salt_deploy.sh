#!/bin/sh

set -xe

function deploy() {
    environment="${1}"
    CFSN="${STACK_NAME}-${environment}-${PROJECT_NAME}"
    DEPLOY_LOG="deploy_output.log"

    echo "Deploying to ${CFSN}"

    set +x
    curl -sf https://sm01.bigtincan.com/run \
        -H 'Accept: application/x-yaml' \
        -H 'Content-type: application/json' \
        -d '[{"client": "local",
            "expr_form": "compound",
            "tgt": "G@ec2_tags:HumanName:'"${CFSN}"'",
            "fun": "state.sls",
            "arg": "btcapps.'"${STACK_NAME}"'.'"${PROJECT_NAME}"'.update",
            "username": "'"${SALT_USER?SALT_USER not set}"'",
            "password": "'"${SALT_PASS?SALT_PASS not set}"'",
            "eauth": "pam"}]' \
        -o "${DEPLOY_LOG}"
    if grep -q 'result: false' "${DEPLOY_LOG}" || ! grep -q 'result: true' "${DEPLOY_LOG}"; then
        cat "${DEPLOY_LOG}"
        echo 'Deployment failed :('
        exit 1
    fi
    echo 'Deployment ok'
}

STACK_NAME='hub'
PROJECT_NAME='webappv5'
REGISTRY_ACCOUNT_ID="109462143547"
BRANCH_NAME="$(echo "${GIT_BRANCH}" |sed 's/origin\///')"

case "${BRANCH_NAME}" in
    'develop')
        ENVS='syd-dev'
        REGIONS='ap-southeast-2'
        ;;
    'preview')
        ENVS='pdx-preview'
        REGIONS='us-west-2'
        ;;
    'master')
        ENVS='fra-prod,pdx-prod,syd-prod'
        REGIONS='eu-central-1,us-west-2,ap-southeast-2'
        ;;
    'feature/DEVOPS-1344-move-hub-web-v5-to-k8s-jenkins')
        ENVS='syd-dev'
        REGIONS='ap-southeast-2'
        ;;
esac

if [ -n "${TAG_NAME}" ] && [ -n "${DEPLOY_ENV}" ]; then
    ENVS="${DEPLOY_ENV}"
    REGIONS="us-west-2"
    DOCKER_IMAGE="${TAG_NAME}"
    DOCKER_TAG_COMMIT="${TAG_NAME}"
    DOCKER_TAG_BRANCH="${DEPLOY_ENV}"
fi

if [ -n "${ENVS}" ]; then
    for environment in ${ENVS//,/ }; do
        deploy "${environment}"
    done
fi
