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

 (function () {
     function displayTunesGrid(results, store) {
        var tunesGrid = document.getElementById('tunesGrid');
        
         // create table headers
         if (testForMobile()) {
             var appendString = '<div id="tunes" class="tunesPottsLayout mobileScrolling">';
         } else {
             var appendString = '<div id="tunes" class="tunesPottsLayout">';
         }

        
        for (var key in store) { // Iterate over the original data
            var item = store[key];
            appendString += createGridRow(item);

        } 
        appendString += '</div';
        tunesGrid.innerHTML = appendString;
     }

     function createGridRow(item) {
        var gridRow = '';

        // build the two columns
        gridRow += '<span><a href="' + item.url + '">' + item.title + '</a></span>'; 

         return gridRow;
     }

     displayTunesGrid('', window.store);

     return false;

 })();