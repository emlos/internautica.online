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


created = 0


# Loop through each file in the image folder
for filename in os.listdir(image_source):
    if filename.endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg')):  # Add or remove image extensions as needed
        # Create a new Markdown file for each image
        markdown_filename = os.path.splitext(filename)[0] + ".md"
        markdown_filepath = os.path.join(markdown_folder, markdown_filename)

        image_alt =  os.path.splitext(filename)[0].replace("-", " ").replace("_", " ")
        
        # Markdown syntax to display an image
        image_link = f"![{image_alt}]({os.path.join(image_destination, filename)})"

        if not os.path.exists(markdown_filepath): # dont overwrite existing
            created +=1
            # Write the Markdown file
            with open(markdown_filepath, 'w') as f:
                f.write(prebuild)
                f.write(image_link)


print(f"{created} markdown files have been created.")
