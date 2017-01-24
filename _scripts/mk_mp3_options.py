#!/usr/bin/env python
# encoding: utf-8

#
# You will need to change these variables to
# match your directory structure
#
tunesDir = '/Users/asjl/GitHub/' + archiveName + '/_tunes'
optionsFile = '/Users/asjl/GitHub/' + archiveName + '/_includes/mp3options.html'

import sys
import re
import os
import cgi

if len(sys.argv) == 2:
    archiveName = sys.argv[1]
else:
    usage()
    sys.exit()

def usage():
    print "Usage: " + sys.argv[0] + " <archive_name>"


cleanr = re.compile('<.*?>')

def cleanhtml(raw_html):
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext

rhythmDict = {}
locationDict = {}
licenceDict = {}
sourceDict = {}

os.chdir(tunesDir)
with open(optionsFile, 'w') as outfile:
    for file in os.listdir("."):
        if file.endswith(".md"):
            with open(tunesDir + '/' + file, 'r') as infile:
                outline = ''
                for line in infile:
                    if line.startswith('rhythm:'):
                        rhythm = line.replace('rhythm:', '').strip()
                        if rhythm:
                            rhythmDict[cleanhtml(rhythm.replace('"', ''))] = rhythm
                    if line.startswith('location:'):
                        location = line.replace('location:', '').strip()
                        if location:
                            locationDict[cleanhtml(location.replace('"', ''))] = location
                    if line.startswith('mp3_licence:'):
                        mp3_licence = line.replace('mp3_licence:', '').strip()
                        if mp3_licence:
                            licenceDict[cleanhtml(mp3_licence.replace('"', ''))] = mp3_licence
                    if line.startswith('mp3_source:'):
                        mp3_source = line.replace('mp3_source:', '').strip()
                        if mp3_source:
                            sourceDict[cleanhtml(mp3_source.replace('"', ''))] = mp3_source
                        next

    outfile.write('<!-- This code was auto-generated using the script: -->\n')
    outfile.write('<!-- ' + os.path.basename(sys.argv[0])  +' -->\n')
    outfile.write('<!-- Any changes WILL be overwritten! -->\n\n')

    outfile.write('Rhythm:\n')
    outfile.write('<select id="rhythm-box" name="rhythm">\n')
    outfile.write('    <option value="">Any</option>\n')
    for key in rhythmDict:
        outfile.write('    <option value="' + cgi.escape(rhythmDict[key], quote=True) + '">' + key + '</option>\n')
    outfile.write('    <option value="ENTER YOUR NEW RHYTHM HERE">Other</option>\n')
    outfile.write('</select>\n')

    outfile.write('Location:\n')
    outfile.write('<select id="location-box" name="location">\n')
    outfile.write('    <option value="">Any</option>\n')
    for key in locationDict:
        outfile.write('    <option value="' + cgi.escape(locationDict[key], quote=True) + '">' + key + '</option>\n')
    outfile.write('    <option value="ENTER YOUR NEW LOCATION HERE">Other</option>\n')
    outfile.write('</select>\n')

    outfile.write('MP3 licence:\n')
    outfile.write('<select id="mp3_licence-box" name="mp3_licence">\n')
    outfile.write('    <option value="">Any</option>\n')
    for key in licenceDict:
        outfile.write('    <option value="' + cgi.escape(licenceDict[key], quote=True) + '">' + key + '</option>\n')
    outfile.write('    <option value="ENTER YOUR NEW MP3 LICENCE HERE">Other</option>\n')
    outfile.write('</select>\n')

    outfile.write('MP3 source:\n')
    outfile.write('<select id="mp3_source-box" name="mp3_source">\n')
    outfile.write('    <option value="">Any</option>\n')
    for key in sourceDict:
        outfile.write('    <option value="' + cgi.escape(sourceDict[key], quote=True) + '">' + key + '</option>\n')
    outfile.write('    <option value="ENTER YOUR NEW MP3 SOURCE HERE">Other</option>\n')
    outfile.write('</select>\n')

    outfile.write('<!-- End of ' + os.path.basename(sys.argv[0])  +' code -->\n')
