#!/bin/sh
#
# You may need to change the TUNEBOOKDIR variable
# to match your directory structure 
#
TUNEBOOKDIR="${HOME}/GitHub/wellington-large-files/tunebooks"

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
if [ -d ${TUNEBOOKDIR} ]
then
    cd ${TUNEBOOKDIR}
    ABCFILES=$(echo *abc)
    echo "Processing: ${ABCFILES} "

    for ABCFILE in ${ABCFILES}
    do
        abc2pdf ${ABCFILE}
    done
else
    echo "Directory '${TUNEBOOKDIR}' not found!"
    echo
    echo "Don't run '$(basename ${0})' on the webserver host."
fi
