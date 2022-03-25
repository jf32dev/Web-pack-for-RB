#!/usr/bin/env python3

import json
import os
import subprocess
import sys
import requests


def send_notification(build_result, channel='jenkins'):

    params = {}

    params['message'] = 'Build <{build_url}|{build_id}> finished @{user}'.format(
        build_id= os.environ.get('BUILD_TAG', ''),
        build_url=os.environ.get('RUN_DISPLAY_URL', ''),
        user=subprocess.getoutput('git show -s --pretty=%ae')
    )

    params['emoji'] = ':-1::skin-tone-6:'
    params['color'] = 'danger'

    if build_result == 'SUCCESS':
        params['emoji'] = ':+1::skin-tone-6:'
        params['color'] = 'good'
    elif params.get('build_result', '') == 'UNSTABLE':
        params['emoji'] = ':point_right::skin-tone-6:'
        params['color'] = 'warning'

    payload = {
        'channel': channel if channel else 'jenkins',
        'icon_emoji': params['emoji'],
        'link_names': 'true',
        'attachments': [
            {
                'text': params['message'],
                'color': params['color']
            }
        ]
    }

    slack_webhook = os.environ.get('SLACK_WEBHOOK')

    ret = requests.post(slack_webhook, json=payload)

    print(ret.text)
    assert ret.status_code == 200


if __name__ == '__main__':
    send_notification(
        build_result=sys.argv[1],
        channel=sys.argv[2]
    )
