---
layout: null
---

Updating Tunebook PDFs
======================

This script is run once a week and the resulting PDFs are uploaded to the master repository using **git push**. 
The next time *gh-pages* is updated using **git pull** these PDFs will be included. This means that the Tunebooks 
will be one revision behind the tunes shown on the site.


```
#!/bin/sh

SOURCEDIR='/Users/asjl/gitrepos/slow-session'
SITEDIR='/Users/asjl/gitrepos/slow-session/_site/abc-collections'

ARCHIVE='archive.abc'
CURRENT='current.abc'
TWOBAR='2bar.abc'

#
# Build the ABC source files in ${SITEDIR}
#
cd ${SOURCEDIR}
/usr/local/bin/jekyll build
if [ $? -ne 0 ]
then
    exit
fi

#
# Build the PDF files in ${SOURCEDIR}
#
cd ${SOURCEDIR}/abc-collections

/Users/asjl/bin/abc2pdf ${SITEDIR}/${ARCHIVE}
/Users/asjl/bin/abc2pdf ${SITEDIR}/${CURRENT}
/Users/asjl/bin/abc2pdf ${SITEDIR}/${TWOBAR}

cd ${SOURCEDIR}
#
# Push the new PDFs to the main site
# They'll get loaded next time there's an upgrade
#
/usr/local/bin/git pull 
/usr/local/bin/git add .
/usr/local/bin/git commit -m "Updating Tunebook PDFs"
/usr/local/bin/git push
```

The script abc2pdf looks like:

```
#!/bin/sh
# Convert a text file with abc musical notation (abcnotation.com)
# to a PDF, using abc2ps.
TMPPS=$(mktemp /tmp/temp.XXXXXXX).ps
PDF=$(basename "${1%.abc}.pdf")
/Users/asjl/bin/abcm2ps "$@" -q -O $TMPPS
/usr/local/bin/ps2pdf $TMPPS $PDF
#echo "Created $PDF"
rm $TMPPS
```
