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


function displayFocusTunesGrid(divID, storeName, storeObject) {
    
    // create div for tunes grid
    if (testForMobile()) {
        var appendString = `<div id="${divID}" class="tunesArchiveLayout mobileScrolling">`;
    } else {
        var appendString = `<div id="${divID}" class="tunesArchiveLayout">`;
    }

    for (var key in storeObject) { // Iterate over the original data
        var item = storeObject[key];

        appendString += `<span><a href="${item.url}">${item.title}</a></span>
            <span><input class="filterButton" type="button" 
            onclick="selectTune(${storeName}, ${item.tuneID});" value="Play Now">
            </span>
            <span>${item.key} ${item.rhythm}</span>`;
    
    }
    appendString += '</div>';
    document.getElementById(divID).innerHTML = appendString;
}
