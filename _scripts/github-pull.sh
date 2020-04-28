#!/bin/sh
#
# You may need to change ARCHIVEDIR and/or SOURCEDIR variables
# to match your directory structure 
#
ARCHIVEDIR='wellington.session.nz'
SOURCEDIR="${HOME}/GitHub/${ARCHIVEDIR}"

#
# Get any updates from main respository
#
cd ${SOURCEDIR}
git pull
