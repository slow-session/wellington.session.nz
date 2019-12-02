 /*
  * Code for building index of tunes and searching it
  *
  * Version: 1.0
  * Date: 7 Dec 2016
  *
  * Developed as part of website for http://wellington.session.nz
  * by Ted Cizadlo and Andy Linton
  * Code available at:
  * https://github.com/slow-session/wellington.session.nz/blob/master/js/audioID_controls.js
  * Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) Licence.
  *
  * Derived from: http://jekyll.tips/jekyll-casts/jekyll-search-using-lunr-js/
  */

 (function() {
     function displayTunesTable(store) {
         var tunesTable = document.getElementById('tunesTable');

         // create table headers
         var appendString = '';

         for (var key in store) { // Iterate over the original data
             var item = store[key];
             // We assume generated tables start at ID 200 - this lets us have
             // singleTune items in the window.store for mixed pages like the
             // slowsession page
             if (item.tuneID < 200) {
                 continue;
             }
             appendString += createTableRow(item);
         }
         tunesTable.innerHTML = appendString;
     }

     function createTableRow(item) {
         var tableRow = '';
         if (!(item.repeats && item.parts)) {
             tableRow += item.titleID + ':' + item.mp3 + ':';
             var parts = '';
             var length = 0;
             if (item.abc) {
                 var partCount = calculateParts(item.rhythm, item.abc);
                 var partName = 'A';
                 if (partCount == 1) {
                     parts += 'AB';
                 } else {
                     for (i = 0; i < partCount; i++) {
                         parts += partName + partName;
                         partName = nextChar(partName);
                     }
                 }
                 length = calculateTuneLength(item.rhythm, partCount);
             } else {
                 parts += 'AABB';
                 length = calculateTuneLength(item.rhythm, 2);
             }
             tableRow += parts + ':' + item.rhythm + ':' + length + '<br />';
         }
         return tableRow;
     }

     var tuneLength = {
          "reel": 19.0,
          "hornpipe": 19.0,
          "barndance": 19.0,
          "mazurka": 14.3,
          "waltz": 14.3,
          "jig": 14.3,
          "slide": 14.3,
          "slip jig": 10.7,
          "polka": 9.5,
          "default": 19.0,
      };

      function calculateTuneLength(rhythm, parts) {
          if (tuneLength[rhythm]) {
              return tuneLength[rhythm] * parts;
          } else {
              return tuneLength['default'] * parts;
          }
      }

     displayTunesTable(window.store);
     return false;

 })();
