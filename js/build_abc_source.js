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

    // create file headers
    var appendString = '% \n% File sourced from: ' + window.location.href + '\n';
    appendString += '% Generated on: ' + new Date() + '\n%\n';
    
    for (var key in store) { // Iterate over the original data
        var item = store[key];
        appendString += createABCitem(item);
    }

    abcText.innerHTML = DOMPurify.sanitize(appendString);
}

function createABCitem(item) {
    var gridRow = '';

    // build the ABC item
    var newABC = decodeURI(item.abc).replace(/X:\s*/g, 'X: ' + item.tuneID)

    if (newABC) {
        gridRow += newABC + '\n';
    }

    return gridRow;
}