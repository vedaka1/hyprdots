import os
import subprocess

import numpy as np
import pyperclip
import pytesseract
from PIL import Image

home_path = os.environ.get("HOME")

subprocess.call(f"{home_path}/.config/python-scripts/screenshot.sh")
img1 = np.array(Image.open("/tmp/parse.png"))
text = pytesseract.image_to_string(img1)
pyperclip.copy(text)
print(text)
