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

"use strict";

const buildABCsource = (function () {

    function displayABCsource() {
        let abcText = document.getElementById("abcText");

        // create file headers
        let appendString = "% \n% File sourced from: " + window.location.href + "\n";
        appendString += "% Generated on: " + new Date() + "\n%\n";

        for (let key in store) {
            // Iterate over the original data
            let item = store[key];
            appendString += createABCitem(item);
        }

        abcText.innerHTML = DOMPurify.sanitize(appendString);
    }

    function createABCitem(item) {
        let gridRow = "";

        // build the ABC item
        let newABC = decodeURI(item.abc).replace(/X:.*/, "X: " + item.tuneID);

        if (newABC) {
            gridRow += newABC + "\n";
        }

        return gridRow;
    }

    return {
        displayABCsource: displayABCsource,
    };

})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = buildABCsource;
}
