import os
 
# Get the list of all files and directories
dir_list = os.listdir()
 
print("Files and directories:")
 
# prints all files


for item in dir_list:
	if item.endswith(".py"):
		continue
	print("\"../../../../../common/images/banners/{}\",".format(item))

