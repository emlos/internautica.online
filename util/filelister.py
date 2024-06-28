#!/usr/bin/python3

import os
import sys

path = "."
if len(sys.argv) > 1:
	path = sys.argv[1]
else:
	print('need a path')
	exit

print("const files=[")
for file in os.listdir(path):
	if file.endswith(".png") or file.endswith(".jpg") or file.endswith(".gif"):
		print("\"" + os.path.join(path, file + "\","))
print("]")
#!/usr/bin/python3

import os
import sys

path = "."
if len(sys.argv) > 1:
	path = sys.argv[1]

print("const files=[")
for file in os.listdir(path):
	if file.endswith(".png") or file.endswith(".jpg") or file.endswith(".gif"):
		print("\"" + os.path.join(path, file + "\","))
print("]")
