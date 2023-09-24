#!/usr/bin/python3
import os

# Specify the directory where your images are stored
image_destination = "/images/art"
image_source = "./src/images/art"

# Specify the directory where you want to save the Markdown files
markdown_folder = "./src/art"

prebuild = """---
title: ""
url: ""
author: ""
tags:
    - visual
    - 
---
"""
def replace(file, string):
        
    with open(file, 'r') as f:
        lines = f.readlines()
    
    if lines:  # Check if file is not empty
        lines[-1] = string  # Replace the last line
    
    with open(file, 'w') as f:
        f.writelines(lines)

image_string =  """{{% EleventyImage "{}", "{}", "(min-width: 30rem) 50vw, 100vw", "{}" %}}"""
#{% EleventyImage image.source, image.title, "(min-width: 30em) 50vw, 100vw",output %}


created = 0
modified = 0


# Loop through each file in the image folder
for filename in os.listdir(image_source):
    if filename.endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg')):  # Add or remove image extensions as needed
        # Create a new Markdown file for each image
        markdown_filename = os.path.splitext(filename)[0] + ".md"
        markdown_filepath = os.path.join(markdown_folder, markdown_filename)

        image_alt =  os.path.splitext(filename)[0].replace("-", " ").replace("_", " ")
        
        # Markdown syntax to display an image
        #image_link = f"![{image_alt}]({os.path.join(image_destination, filename)})"
        image_link = image_string.format(os.path.join(image_destination, filename), image_alt, "generated")

        if not os.path.exists(markdown_filepath): # dont overwrite existing
            created +=1
            # Write the Markdown file
            with open(markdown_filepath, 'w') as f:
                f.write(prebuild)
                f.write(image_link)
        else:
            modified +=1
            replace(markdown_filepath, image_link)


print(f"{created} markdown files have been created.")
print(f"{modified} markdown files have been modified.")


