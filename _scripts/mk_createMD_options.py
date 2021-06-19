#!/usr/bin/env python3
# encoding: utf-8

import html
import os
import re
import sys
#
# You will need to change these variables to
# match your directory structure
#
from pathlib import Path

def usage():
    sys.stdout = sys.stderr
    print('Usage: {0} <archiveName> '.format(sys.argv[0]))
    sys.exit(2)

if len(sys.argv) != 2:
    usage()

archiveName = sys.argv[1]

homeDir = str(Path.home())

tunesDir = homeDir + '/GitHub/' + archiveName + '/_tunes'
optionsFile = homeDir + '/GitHub/' + archiveName + '/_includes/createMD_options.html'

cleanr = re.compile('<.*?>')

def cleanhtml(raw_html):
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext

rhythmDict = {}
mp3licenceDict = {}
mp3sourceDict = {}
licenceUsedBy = {}
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
                        if rhythm.count(","):
                            continue
                        if rhythm:
                            rhythmDict[cleanhtml(rhythm.replace('"', ''))] = rhythm
                    if line.startswith('mp3_source:'):
                        mp3_source = line.replace('mp3_source:', '').strip()
                        if mp3_source:
                            mp3_source_key = cleanhtml(mp3_source.replace('"', ''))
                            mp3sourceDict[mp3_source_key] = mp3_source
                    if line.startswith('mp3_licence:'):
                        mp3_licence = line.replace('mp3_licence:', '').strip()
                        if mp3_licence:
                            mp3_licence_key = cleanhtml(mp3_licence.replace('"', ''))
                            mp3_licence_key = mp3_licence_key.strip("'")
                            mp3licenceDict[mp3_licence_key] = mp3_licence
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
    outfile.write("""
<form id="createMD" method="get">
    <label>Title:<sup>*</sup></label>
    <input type="text" id="title-box" name="title" value="">

    <input type="hidden" id="titleID-box" name="titleID" value=""><br />

    <label>Key:<sup>*</sup></label>
    <input type="text" id="key-box" name="key" list="key" value="">
    <datalist id="key">
        <option value="Ddor">Ddor</option>
        <option value="Dmaj">Dmaj</option>
        <option value="Dmix">Dmix</option>
        <option value="Gdor">Gdor</option>
        <option value="Gmaj">Gmaj</option>
        <option value="Gmix">Gmix</option>
        <option value="Ador">Ador</option>
        <option value="Amaj">Amaj</option>
        <option value="Amix">Amix</option>
        <option value="Bdor">Bdor</option>
        <option value="Bmix">Bmix</option>
        <option value="Cmaj">Cmaj</option>
        <option value="Edor">Edor</option>
        <option value="Fmaj">Fmaj</option>
    </datalist>

    <label>Rhythm:<sup>*</sup></label>
    <input type="text" id="rhythm-box" name="rhythm" list="rhythm" value="">
    <datalist id="rhythm">
""")

    for key in sorted(rhythmDict.keys()):
        outfile.write('        <option value="' + html.escape(rhythmDict[key], quote=True) + '">' + key + '</option>\n')

    outfile.write("""
    </datalist>

    <label>Notes:</label>
    <input type="text" id="notes-box" name="notes" value="">

    <input type="hidden" id="date-box" name="date" value=""><br />
    <input type="hidden" id="regtuneoftheweek-box" name="regtuneoftheweek" value="">
    <input type="hidden" id="slowtuneoftheweek-box" name="slowtuneoftheweek" value="">
    
    <p></p>
    <hr>

    <h3>MP3 version of the tune</h3>

    <label>MP3 file available</label>
    <input type="checkbox" name="mp3_file" checked>
    
    <p></p>

    <p>If an MP3 version of the tune is available, please provide these details:</p>

      <label>Number of Repeats:</label>
    <input type="number" id="repeats-box" name="repeats" list="repeats" placeholder="e.g. 2">
    <datalist id="repeats">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
    </datalist>
    <br />

    <label>Parts:</label>
    <input type="text" id="parts-box" name="parts" list="parts" placeholder="e.g. AABB">
    <datalist id="parts">
        <option value="AABB">AABB</option>
        <option value="AABBCC">AABBCC</option>
        <option value="AB">AB</option>
    </datalist>
    <br />

    <label>MP3 source:</label>
    <input type="text" id="mp3_source-box" name="mp3_source" list="mp3_source">
    <datalist id="mp3_source">
""")
    for key in sorted(mp3sourceDict.keys()):
        outfile.write('        <option value="' + key + '">' + key + '</option>\n')
    
    outfile.write("""
    </datalist>

    <div class="licenceUsed">
    <h3>Licences Used</h3>
""")

    for key in sorted(licenceUsedBy.keys()):
        
        outfile.write('    <p><small><strong>' + key + '</strong> uses these licences:<br />\n')
        for licenceUsed in licenceUsedBy[key]:
            outfile.write('    ' + licenceUsed + ' ')
        outfile.write('</small></p>\n')

    outfile.write("""
    </div>
    
    <label>MP3 licence:</label>
    <input type="text" name="mp3_licence" id="mp3_licence-box" list="mp3_licence">
    <datalist id="mp3_licence">
""")

    for key in sorted(mp3licenceDict.keys()):
        outfile.write('    <option value="' + key + '">' + key + '</option>\n')
    
    outfile.write("""    </datalist>

    <label>MP3 url:</label>
    <input type="text" id="mp3_url-box" name="mp3_url" value="" placeholder="e.g. https://www.youtube.com/watch?v=Hzi7OhSzysw&t=126">

    <label>Alternative MP3 url:</label>
    <input type="text" id="alt_mp3_url-box" name="alt_mp3_url" value="" placeholder="e.g. https://media.comhaltas.ie/video/cl277/cl277_6_Med.mp4">

    <p></p>
    <hr>

    <h3>ABC version of the tune</h3>

    <label>ABC source:</label>
    <input type="text" name="abc_source" id="abc_source-box" list="abc_source">
    <datalist id="abc_source">
    <option value="The Session">The Session</option>
""")

    for key in sorted(abcsourceDict.keys()):
        if 'The Session' in key:
            break
        outfile.write('    <option value="' + html.escape(abcsourceDict[key], quote=True) + '">' + key + '</option>\n')
    
    outfile.write("""    </datalist>

    <label>ABC url:</label>
    <input type="text" id="abc_url-box" name="abc_url" value="" placeholder="e.g. https://thesession.org/tunes/1555">

    <label>ABC:<sup>*</sup></label>
    <textarea id="abc-box" name="abc" class="abcText" rows="13" spellcheck="false"></textarea>

    <input type="button" class="filterButton" onclick="wssTools.showMDform('createMD', 'mdTextArea')" value="Show MD File">
</form>
""")

    outfile.write('<!-- End of ' + os.path.basename(sys.argv[0])  +' code -->\n')
