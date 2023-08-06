import os
print("const files=[")
for file in os.listdir():
	if file.endswith(".png") or file.endswith(".jpg") or file.endswith(".gif"):
		print("\"/images/blinkies/" + file + "\",")
print("]")
