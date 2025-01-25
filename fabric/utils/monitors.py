import re
import subprocess


def get_monitors_ids() -> list[int]:
    result = subprocess.run(['hyprctl', 'monitors'], capture_output=True).stdout.decode()
    matches = re.findall(r'ID ([0-9])', result)
    if matches:
        return [int(i) for i in matches]
    return [1]
