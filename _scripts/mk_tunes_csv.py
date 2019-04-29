#!/usr/bin/env python3
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

cleanr = re.compile('<.*?>')

def cleanhtml(raw_html):
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext

locationDict = {}

#
# Get the location data from the _tunes MD files
#
os.chdir(tunesDir)
for file in os.listdir("."):
    if file.endswith(".md"):
        with open(tunesDir + '/' + file, 'r') as infile:
            for line in infile:
                if line.startswith('location:'):
                    locations = line.replace('location:', '').strip()
                    if locations:
                        for location in locations.split():
                            locationDict[cleanhtml(location.replace('"', ''))] = location

locCount = chr(ord('C') + len(locationDict) - 1)

with open(index, 'w') as outfile:
    #
    # Output the locations to the file
    #
    outfile.write('Title,URL,');
    for key in sorted(locationDict.keys()):
        outfile.write(key + ',');
    outfile.write('Number of Locations,\n');
    rowCount = 1;

    for file in sorted(os.listdir(".")):
        if os.path.isdir(file):
            continue
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
                        for key in sorted(locationDict.keys()):
                            if key in towns:
                                outline += 'x,'
                            else:
                                outline += ','
                        next
                        rowCount += 1;
                        outline += '"=COUNTIF(C' + str(rowCount) + ':' + locCount + str(rowCount) + ', ""*"""),\n'

                outfile.write(outline)
