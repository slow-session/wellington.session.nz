#!/usr/bin/env python
# encoding: utf-8


import sys
import re
import os

#
# You will need to change these variables to
# match your directory structure
#
tunesDir = '/Users/asjl/GitHub/session.nz/_tunes'
tuneURL = 'http://session.nz/tunes/'
index = '/Users/asjl/Desktop/session.nz.index.csv'

os.chdir(tunesDir)
with open(index, 'w') as outfile:
    outfile.write('Title,URL,Arrowtown,Wellington,Dunedin,Auckland,Hamilton,\n')
    for dir in os.listdir("."):
        if os.path.isfile(dir):
            continue
        for file in os.listdir(dir):
            if file.endswith(".md"):
                with open(tunesDir + '/' + dir + '/' + file, 'r') as infile:
                    outline = ''
                    for line in infile:
                        if line.startswith('title:'):
                            title = line.split(':', 2)[1].strip()
                            outline = title.split(',')[0] + ','
                            url = tuneURL + dir + '/' + file + ','
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
