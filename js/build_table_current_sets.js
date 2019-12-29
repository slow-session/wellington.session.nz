 /*
  * Code for building index of sets and searching it
  *
  * Version: 1.0
  * Date: 7 Dec 2016
  *
  * Developed as part of websites for https://wellington.session.nz
  * by Ted Cizadlo and Andy Linton
  * Code available at:
  * https://github.com/slow-session/wellington.session.nz/blob/master/js/audioID_controls.js
  * Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) Licence.
  *
  * Derived from: http://jekyll.tips/jekyll-casts/jekyll-search-using-lunr-js/
  */

 (function() {
     function displaySetsTable(results, setStore) {
         var setsTable = document.getElementById('tunesTable');
         var setsCount = document.getElementById('tunesCount');
         var setsCounter = 0;

         // Find the tuneIDs that correspond to each set
         mapSetToTuneIDs();

         // create table headers
         var appendString = '<table id="tunes" class="tuneSelect tablesorter"> \
         <thead> \
         <tr> \
            <th style="width:25%;">Set Name &#x25B2;&#x25BC;</th> \
            <th style="width:6%;">Rhythm<br />&#x25B2;&#x25BC;</th> \
            <th style="width:29%;">Titles</th> \
            <th>Play Now</th> \
         </tr> \
         </thead> \
         <tbody>';

         if (results.length) { // Are there any results?
             for (var i = 0; i < results.length; i++) { // Iterate over the results
                 var item = setStore[results[i].ref];
                 appendString += createTableRow(item);
                 setsCounter++;
             }
         } else {
             for (var key in setStore) { // Iterate over the original data
                 var item = setStore[key];
                 appendString += createTableRow(item);
                 setsCounter++;
             }
         }
         appendString += '</tbody></table></div>';
         setsTable.innerHTML = appendString;
         setsCount.innerHTML = setsCounter;
     }

     function createTableRow(item) {
         var tableRow = '';
         var setID = 'ABC' + item.setID;
         var tuneIDs = item.tuneIDs.split(',');

         // build the first three columns
         tableRow += '<tr>';
         tableRow += '<td class="setTitle"><span title="Set played in: ' + item.location + '">';
         tableRow += '<a href="' + item.url + '">' + item.title + '</a></span></td>';
         tableRow += '<td>' + item.rhythm + '</td>';
         tableRow += '<td><table style="width: 100%;">';
         for (var i = 0; i < tuneIDs.length; i++) {
             var url = store[tuneIDs[i]].url;
             var title = store[tuneIDs[i]].title;
             var key = store[tuneIDs[i]].key;

             tableRow += '<tr class="tdArchive" style="background-color:transparent;"><td>';
             tableRow += '<a href="'+ url + '">' +  title + ' (' + key + ')</a>';
             tableRow += '</td></tr>';
         }
         tableRow += '</table></td>';
         tableRow += '<td><table style="width: 100%;">';
         for (var i = 0; i < tuneIDs.length; i++) {
             var tuneID = tuneIDs[i];

             tableRow += '<tr class="tdArchive" style="background-color:transparent;"><td>';
             tableRow += '<input class="filterButton" type="button" onclick="changeTune(' + tuneID + ');" value="Play Now" />';
             tableRow += '</td></tr>';
         }
         tableRow += '</table></td></tr>';

         return tableRow;
     }

     function mapSetToTuneIDs() {
         var SetToTuneIDs = {};
         for (var setKey in setStore) {
              var setTunes = setStore[setKey].setTunes;
              for (var i = 0; i < setTunes.length; i++) {
                  for (var tuneKey in store) {
                      var tune = store[tuneKey];
                      if (setTunes[i] == tune.tuneID) {
                          setStore[setKey].tuneIDs += tuneKey + ',';
                      }
                  }
              }
              // Strip off trailing ','
              setStore[setKey].tuneIDs = setStore[setKey].tuneIDs.slice(0, -1);
         }
     }

     function getQueryVariable(variable) {
         var query = window.location.search.substring(1);
         var vars = query.split('&');

         for (var i = 0; i < vars.length; i++) {
             var pair = vars[i].split('=');

             if (pair[0] === variable) {
                 return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
             }
         }
     }

     // create the searchTerm from the form data and reflect the values chosen in the form
     var searchTerm = '';
     var title = getQueryVariable('title');
     if (title) {
         searchTerm = title + ' ';
         document.getElementById('title-box').setAttribute("value", title);
     }
     var setTitles = getQueryVariable('title');
     if (setTitles) {
         searchTerm += setTitles + ' ';
     }
     var rhythm = getQueryVariable('rhythm');
     if (rhythm) {
         searchTerm += rhythm;
         var e = document.getElementById('rhythm-box');
         if (e) {
             e.value = rhythm;
         }
     }

     // Define the index terms for lunr search
     var setIndex = lunr(function() {
         this.field('id');
         this.field('title', {
             boost: 10
         });
         this.field('rhythm');
     });

     // Add the search items to the search index
     for (var key in window.setStore) { // Add the data to lunr
         setIndex.add({
             'id': key,
             'title': window.setStore[key].title,
             'rhythm': window.setStore[key].rhythm,
         });
     }

     // Get results
     if (searchTerm) {
         var results = setIndex.search(searchTerm); // Get lunr to perform a search

         if (results.length) {
             displaySetsTable(results, window.setStore);
             if (results.length > 3) {
                createArchiveSlider('tableSlider');
                document.getElementById("tunes").addEventListener("scroll", scroll_indicator);
            }
         } else {
             document.getElementById('tunesCount').innerHTML = 0;
         }
     } else {
         displaySetsTable('', window.setStore);
         if (Object.keys(store).length > 3) {
            createArchiveSlider('tableSlider');
            document.getElementById("tunes").addEventListener("scroll", scroll_indicator);
        }
     }
     return false;
 })();
