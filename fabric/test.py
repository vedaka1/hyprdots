import re
import subprocess

result = subprocess.run(['hyprctl', 'monitors'], capture_output=True).stdout.decode()
test = r'href="(https://twitsave.com/download[^"]+)"'
pattern = r'ID ([0-9])'
match_text = re.findall(pattern, result)
if match_text:
    print(match_text)
