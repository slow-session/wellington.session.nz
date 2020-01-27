#!/usr/bin/env python3
# encoding: utf-8

import sys
import re
import os
import html

archiveName = 'wellington.session.nz'

#
# You will need to change these variables to
# match your directory structure
#
from pathlib import Path
homeDir = str(Path.home())

tunesDir = homeDir + '/GitHub/' + archiveName + '/_tunes'
optionsFile = homeDir + '/GitHub/' + archiveName + '/_includes/createMD_options.html'

cleanr = re.compile('<.*?>')

def cleanhtml(raw_html):
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext

rhythmDict = {}
locationDict = {}
mp3licenceDict = {}
mp3sourceDict = {}
licenceUsedBy = {}
sourceDict = {}
abcsourceDict = {}

#
# Get the data from the _tunes MD files
#
os.chdir(tunesDir)
with open(optionsFile, 'w') as outfile:
    for file in os.listdir("."):
        if file.endswith(".md"):
            with open(tunesDir + '/' + file, 'r') as infile:
                outline = ''
                mp3_source_key = ''
                mp3_licence_key = ''
                for line in infile:
                    if line.startswith('rhythm:'):
                        rhythm = line.replace('rhythm:', '').strip()
                        if rhythm:
                            rhythmDict[cleanhtml(rhythm.replace('"', ''))] = rhythm
                    if line.startswith('location:'):
                        locations = line.replace('location:', '').strip()
                        if locations:
                            for location in locations.split():
                                locationDict[cleanhtml(location.replace('"', ''))] = location
                    if line.startswith('mp3_source:'):
                        mp3_source = line.replace('mp3_source:', '').strip()
                        if mp3_source:
                            mp3_source_key = cleanhtml(mp3_source.replace('"', ''))
                            mp3sourceDict[mp3_source_key] = mp3_source

                    if line.startswith('mp3_licence:'):
                        mp3_licence = line.replace('mp3_licence:', '').strip()
                        if mp3_licence:
                            mp3_licence_key = cleanhtml(mp3_licence.replace('"', ''))
                            mp3licenceDict[mp3_licence_key] = mp3_licence
                    if line.startswith('source:'):
                        source = line.replace('source:', '').strip()
                        if source:
                            sourceDict[cleanhtml(source.replace('"', ''))] = source
                    if line.startswith('abc_source:'):
                        abc_source = line.replace('abc_source:', '').strip()
                        if abc_source:
                            abcsourceDict[cleanhtml(abc_source.replace('"', ''))] = abc_source

                if mp3_licence_key:
                    if mp3_source_key in licenceUsedBy:
                        if mp3_licence_key not in licenceUsedBy[mp3_source_key]:
                            licenceUsedBy[mp3_source_key].append(mp3_licence_key)
                    else:
                        licenceUsedBy[mp3_source_key] = [mp3_licence_key,]

    #
    # Output the form to the file
    #
    outfile.write('<!-- This code was auto-generated using the script: -->\n')
    outfile.write('<!-- ' + os.path.basename(sys.argv[0])  +' -->\n')
    outfile.write('<!-- Any changes WILL be overwritten! -->\n\n')
    outfile.write("""<form id="createMD" method="get">
    <label>Title:<sup>*</sup></label>
    <input type="text" id="title-box" name="title" value="">

    <input type="hidden" id="titleID-box" name="titleID" value=""><br />

    <label>Key:<sup>*</sup></label>
    <input type="text" id="key-box" name="key" value="">

    <label>Rhythm:<sup>*</sup></label>
    <select id="rhythm-box" name="rhythm">
        <option value="">None</option>
    """)

    for key in sorted(rhythmDict.keys()):
        outfile.write('    <option value="' + html.escape(rhythmDict[key], quote=True) + '">' + key + '</option>\n')

    outfile.write("""    <option value="ENTER YOUR NEW RHYTHM HERE">Other</option>
    </select>

    <label>Notes:</label>
    <input type="text" id="notes-box" name="notes" value="">

    <input type="hidden" id="date-box" name="date" value=""><br />
    <input type="hidden" id="regtuneoftheweek-box" name="regtuneoftheweek" value="">
    <input type="hidden" id="slowtuneoftheweek-box" name="slowtuneoftheweek" value="">
    <input type="hidden" id="tags-box" name="tags" value="">

    <br /><label>Location:</label><br />\n""")

    for key in sorted(locationDict.keys()):
        outfile.write('        <input name="location" type="checkbox" value="' + key + '"/>\n');
        outfile.write('        <label for="location">' + key + '</label><br />\n');

    outfile.write("""<br />

    <h3>Recorded version of the tune</h3>

    <label>MP3 file:</label>
    <select id="mp3_file-box" name="mp3_file">
        <option value="yes">Available</option>
        <option value="no">Not available</option>
    </select>

    <p></p>

    <p>If an MP3 version of the tune is available, please provide these details:</p>

    <label>Repeats:</label>
    <input type="text" id="repeats-box" name="repeats" value="">
    <br />

    <label>Parts:</label>
    <input type="text" id="parts-box" name="parts" value="">
    <br />

    <label>MP3 source:</label>
    <select id="mp3_source-box" name="mp3_source">
    <option value="">None</option>
    """)
    for key in sorted(mp3sourceDict.keys()):
        outfile.write('    <option value="' + html.escape(mp3sourceDict[key], quote=True) + '">' + key + '</option>\n')
    outfile.write("""    <option value="ENTER YOUR NEW MP3 SOURCE HERE">Other</option>
    </select>

    <div class="licenceUsed">
    <h3>Licences Used</h3>
    """)

    for key in sorted(licenceUsedBy.keys()):
        outfile.write('<p><small><strong>' + key + '</strong> uses these licences:<br />\n')
        for licenceUsed in licenceUsedBy[key]:
            outfile.write(licenceUsed + ' ')
        outfile.write('</small></p>\n')

    outfile.write("""
    </div>
    <label>MP3 licence:</label>
    <select id="mp3_licence-box" name="mp3_licence">
        <option value="">None</option>
    """)
    for key in sorted(mp3licenceDict.keys()):
        outfile.write('    <option value="' + html.escape(mp3licenceDict[key], quote=True) + '">' + key + '</option>\n')
    outfile.write("""    <option value="ENTER YOUR NEW MP3 LICENCE HERE">Other</option>
    </select>

    <label>MP3 url:</label>
    <input type="text" id="mp3_url-box" name="mp3_url" value="">

    <label>Alternative MP3 url:</label>
    <input type="text" id="alt_mp3_url-box" name="alt_mp3_url" value="">

    <label>Source:<sup>*</sup></label>
    <select id="source-box" name="source">
    <option value="Wellington">Wellington</option>
    """)
    for key in sorted(sourceDict.keys()):
        if 'Wellington' in key:
            break
        outfile.write('    <option value="' + html.escape(sourceDict[key], quote=True) + '">' + key + '</option>\n')
    outfile.write("""    <option value="ENTER YOUR NEW SOURCE HERE">Other</option>
    </select>

    <p></p>

    <h3>ABC version of the tune</h3>

    <label>ABC source:</label>
    <select id="abc_source-box" name="abc_source">
    <option value="The Session">The Session</option>
    """)
    for key in sorted(abcsourceDict.keys()):
        if 'The Session' in key:
            break
        outfile.write('    <option value="' + html.escape(abcsourceDict[key], quote=True) + '">' + key + '</option>\n')
    outfile.write("""    <option value="ENTER YOUR NEW SOURCE HERE">Other</option>
    </select>

    <label>ABC url:</label>
    <input type="text" id="abc_url-box" name="abc_url" value="">

    <label>ABC:<sup>*</sup></label>
    <textarea id="abc-box" name="abc" rows="13" cols="58" style="background-color: #ebebeb" spellcheck="false"></textarea>

    <input type="button" class="filterButton" onclick="showForm('md', 'createMD')" value="Show MD File">
    </form>
    """)

    outfile.write('<!-- End of ' + os.path.basename(sys.argv[0])  +' code -->\n')
