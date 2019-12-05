#!/usr/bin/env python3
# encoding: utf-8

import sys
import os
from slugify import slugify
from collections import defaultdict
import datetime

creationDate = datetime.datetime.now().strftime("%Y-%m-%d")

def usage():
    print ("Usage: " + sys.argv[0] + " <tunebook_name>")


if len(sys.argv) == 2:
    archiveName = sys.argv[1]
    archiveStub = archiveName.replace('.abc', '')
else:
    usage()
    sys.exit()

#
# You will need to change these variables to
# match your directory structure
#
from pathlib import Path
homeDir = str(Path.home())

tunebookDir = homeDir + '/GitHub/wellington.session.nz/tunebooks/other/'
tunesDir = homeDir + '/GitHub/wellington.session.nz/_obrientunes/'
tunesDir = '/tmp/'

#
# Get the data from the tunebook ABC file
#
os.chdir(tunebookDir)

try:
    abcIndex
except NameError:
    abcIndex = None

abcDict = defaultdict(list)
titleDict = defaultdict(list)
keyDict = defaultdict(list)
rhythmDict = defaultdict(list)

with open(tunebookDir + archiveName, 'r') as infile:
    for line in infile:
        if line.startswith(('%', '\\', 'E:')):
            continue
        #line = line.rstrip()
        if line.startswith('X:'):
            abcIndex = line.split(':')[1]
            titleFound = False
            continue
        if line.startswith('T:') and titleFound == False:
            titleFound = True
            title = line.split(':')[1]
            titleDict[slugify(title)] = title
            abcDict[slugify(title)] = '    X:' + abcIndex
            abcDict[slugify(title)] += '    ' + line
        elif line.startswith('K:'):
            keyDict[slugify(title)] = line.split(':')[1]
            abcDict[slugify(title)] += '    ' + line
        elif line.startswith('R:'):
            rhythmDict[slugify(title)] = line.split(':')[1]
            abcDict[slugify(title)] += '    ' + line
        elif abcIndex:
            abcDict[slugify(title)] += '    ' + line

    for tuneName in abcDict:
        with open(tunesDir + tuneName + '-' + archiveStub + '.md', 'w') as outfile:
            outfile.write('---\ntitle: ' + titleDict[tuneName])
            outfile.write('titleID: ' + tuneName + '-' + archiveStub + '.md')
            outfile.write('\nkey: ' + keyDict[tuneName])
            outfile.write('rhythm: ' + rhythmDict[tuneName])
            outfile.write('date: ' + creationDate)
            outfile.write('\nlocation: Other')
            outfile.write('\nnotes: ')
            outfile.write('\ntags: ' + archiveStub)
            outfile.write("""
regtuneoftheweek:
slowtuneoftheweek:
mp3_file:
mp3_source:
mp3_licence:
mp3_url:
alt_mp3_url:
source: Wellington
abc_source: Wellington Tunebook Collection
""")
            outfile.write('abc_url: /tunebooks/other/' + archiveStub + '.pdf')

            outfile.write('\nabc: |\n' + abcDict[tuneName] + '\n---')
