#!/usr/bin/env python

import subprocess
import json

data = {}
count = int(subprocess.check_output(["dunstctl", "count", "history"]).decode("utf-8"))
command = "dunstctl history | jq -c '.data[0]'"
result = subprocess.check_output(command, shell=True).decode('utf-8')
dictionary = json.loads(result)

data['text'] = f"{count}"
data['tooltip'] = f"{dictionary}"

print(json.dumps(data))
# print(test["tooltip"][0]["body"])