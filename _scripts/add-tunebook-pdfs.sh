#!/bin/sh
#
# You may need to change SOURCEDIR to match your directory structure 
#
SOURCEDIR="${HOME}/GitHub/wellington-large-files"

cd ${SOURCEDIR}

abc2pdf () {
    ABCFILE = $1
    # Convert a text file with abc musical notation (abcnotation.com)
    # to a PDF, using abc2ps.
    TMPPS=$(mktemp /tmp/temp.XXXXXXX).ps
    PDF=$(basename "${ABCFILE%.abc}.pdf")
    echo $PDF
    abcm2ps "$@" -q -x -N3 -O $TMPPS
    abcmaddidx.tcl -nx $TMPPS $TMPPS-index
    ps2pdf $TMPPS-index $PDF
    rm $TMPPS $TMPPS-index
}

#
# Get the list of files to process
#
cd ${SOURCEDIR}/tunebooks
ABCFILES=$(echo *abc)
echo "Processing: ${ABCFILES} "

for ABCFILE in ${ABCFILES}
do
    abc2pdf ${ABCFILE}
done
