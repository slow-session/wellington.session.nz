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
         var tunesCounter = 0;

         // create table headers
         var appendString = '<table id="tunes"> \
         <thead> \
         <tr> \
            <th style="width: 50%;">File Name</th> \
            <th style="width: 10%;">Parts</th> \
            <th style="width: 20%;">Repeats</th> \
         </tr> \
         </thead> \
         <tbody>';


        for (var key in store) { // Iterate over the original data
            var item = store[key];
            // We assume generated tables start at ID 200 - this lets us have
            // singleTune items in the window.store for mixed pages like the
            // slowsession page
            if (item.tuneID < 200) {
                continue;
            }
            appendString += createTableRow(item);
            tunesCounter++;
        }

         appendString += '</tbody></table>';
         tunesTable.innerHTML = appendString;
     }

     function createTableRow(item) {
         var tableRow = '<tr>';

         // build the four columns
         tableRow += '<td>' + item.titleID + '</td>';
         if (item.repeats && item.parts) {
             tableRow += '<td>' + item.parts + '</td>';
             tableRow += '<td>' + item.repeats + '</td>';
         } else {
             var parts = '';
             if (item.abc) {
                 var partCount = calculateParts(item.rhythm, item.abc);
                 var partName = 'A';
                 for (i = 0; i < partCount; i++) {
                     parts += partName + partName;
                     partName = nextChar(partName);
                 }
             } else {
                 parts = 'AABB';
             }
             var repeats = calculateRepeats();
             tableRow += '<td>' + parts + '</td>';
             tableRow += '<td>' + repeats + '</td>';
         }

         tableRow += '</tr>';

         return tableRow;
     }

     displayTunesTable(window.store);
     return false;

 })();
