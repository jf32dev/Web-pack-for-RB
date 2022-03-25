#!/busybox/sh

set -xe

function kaniko_build() {
    region="${1}"

    REGISTRY="${REGISTRY_ACCOUNT_ID}.dkr.ecr.${region}.amazonaws.com/${STACK_NAME}/${PROJECT_NAME}"
    echo "publishing image to ${REGISTRY}"

    /kaniko/executor --context `pwd` --dockerfile="${DOCKER_FILE}" --destination "${REGISTRY}:${GIT_COMMIT}" --destination "${REGISTRY}:${BRANCE_TAG_NAME}" --snapshotMode=redo --cache=false
}

STACK_NAME='hub'
PROJECT_NAME='webappv5'
REGISTRY_ACCOUNT_ID="109462143547"
BRANCH_NAME="$(echo "${GIT_BRANCH}" |sed 's/origin\///')"

DOCKER_FILE=Dockerfile

case "${BRANCH_NAME}" in
    'develop')
        REGIONS='ap-southeast-2'
        ;;
    'preview')
        REGIONS='us-west-2'
        ;;
    'master')
        REGIONS='eu-central-1,us-west-2,ap-southeast-2'
        ;;
    'feature/DEVOPS-1344-move-hub-web-v5-to-k8s-jenkins')
        REGIONS='ap-southeast-2'
        ;;    
esac

if [ -n "${REGIONS}" ]; then
    for region in ${REGIONS//,/ }; do
        kaniko_build "${region}"
    done
fi