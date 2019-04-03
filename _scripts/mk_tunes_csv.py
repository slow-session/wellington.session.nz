#!/usr/bin/env python
# encoding: utf-8


import sys
import re
import os

#
# You will need to change these variables to
# match your directory structure
#
tunesDir = '/Users/asjl/GitHub/wellington.session.nz/_tunes'
tuneURL = 'https://wellington.session.nz/tunes/'
index = '/Users/asjl/Desktop/wellington.session.nz.index.csv'

os.chdir(tunesDir)
with open(index, 'w') as outfile:
    outfile.write('Title,URL,Arrowtown,Wellington,Dunedin,Auckland,Hamilton,\n')
    for file in os.listdir("."):
        if os.path.isdir(file):
            continue
        print(file)
        if file.endswith(".md"):
            with open(tunesDir + '/' + file, 'r') as infile:
                outline = ''
                for line in infile:
                    if line.startswith('title:'):
                        title = line.split(':', 2)[1].strip()
                        outline = title.split(',')[0] + ','
                        url = tuneURL + file + ','
                        outline += url.replace('.md', '.html')
                        next
                    if line.startswith('location:'):
                        towns = line.split(':', 2)[1].rstrip()
                        if 'Arrowtown' in towns:
                            outline += 'x,'
                        else:
                            outline += ','
                        if 'Wellington' in towns:
                            outline += 'x,'
                        else:
                            outline += ','
                        if 'Dunedin' in towns:
                            outline += 'x,'
                        else:
                            outline += ','
                        if 'Auckland' in towns:
                            outline += 'x,'
                        else:
                            outline += ','
                        if 'Hamilton' in towns:
                            outline += 'x,'
                        else:
                            outline += ','
                        next
                        outline += '\n'

                outfile.write(outline)
