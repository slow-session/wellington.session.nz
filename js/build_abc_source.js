/*
 * Code for building index of tunes and searching it
 *
 * Version: 1.0
 * Date: 7 Dec 2016
 *
 * Developed as part of website for http://dev.session.nz
 * by Ted Cizadlo and Andy Linton
 * Code available at:
 * https://github.com/slow-session/dev.session.nz/blob/master/js/audioID_controls.js
 * Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) Licence.
 *
 * Derived from: http://jekyll.tips/jekyll-casts/jekyll-search-using-lunr-js/
 */


function displayABCsource() {
        var abcText = document.getElementById('abcText');
                
        // create table headers
        var appendString = '% \n% File generated on: ' + new Date() + '\n%\n';
        var tuneIDoffset = 0;
                
        
        
        for (var key in store) { // Iterate over the original data
            var item = store[key];
            if (!tuneIDoffset) {
                tuneIDoffset = item.tuneID
            }
            appendString += createABCitem(item, tuneIDoffset);
        }

        abcText.innerHTML = appendString;
    }

    function createABCitem(item, tuneIDoffset) {
        var gridRow = '';

        // build the ABC item
        var newABC = decodeURI(item.abc).replace(/X:.*\n/, 'X: ' + (item.tuneID - tuneIDoffset + 1) + '\n')
        
        if (newABC) {
            gridRow += newABC + '\n';
        }
        
        return gridRow;
    }



