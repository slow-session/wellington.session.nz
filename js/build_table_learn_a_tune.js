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
         var tunesTable = document.getElementById('tunes-table');

         // create table headers
         var appendString = '<div> \
         <table id="tunes" class="tuneSelect"> \
         <thead> \
         <tr> \
            <th style="width: 50%;">Tune Name</th> \
            <th style="width: 15%;">Play Now</th> \
            <th style="width: 15%;">Tune Page</th> \
            <th style="width: 7%;">Key</th> \
            <th style="width: 13%;">Rhythm</th> \
         </tr> \
         </thead> \
         <tbody>';

         for (var key in store) { // Iterate over the original data
             var item = store[key];
             appendString += createTableRow(item);
         }
         appendString += '</tbody></table></div>';
         tunesTable.innerHTML = appendString;
     }

     function createTableRow(item) {
         var tableRow = '';
         // build the first three columns
         tableRow += '<tr id="tr' + item.tuneID + '">';
         tableRow += '<td>' + item.title + '</td>';
         tableRow += '<td><input class="filterButton" type="button" onclick="changeTune(' + item.tuneID + ');" value="Play" /></td>';
         tableRow += '<td><input class="filterButton" type="button" onclick="location.href=\'' + item.url + '\';" value="Tune Page" /></td>';
         tableRow += '<td>' + item.key + '</td>';
         tableRow += '<td>' + item.rhythm + '</td>';
         tableRow += '</tr>';

         return tableRow;
     }

     displayTunesTable(window.store);
     return false;

 })();
