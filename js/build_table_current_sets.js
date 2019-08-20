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
     function displaySetsTable(results, store) {
         var setsTable = document.getElementById('sets-table');
         var setsCount = document.getElementById('sets-count');
         var setsCounter = 0;

         // create table headers
         var appendString = '<div style="overflow-x:auto;"> \
         <table style="width:100%"  align="center" id="search-results" class="tablesorter"> \
         <thead> \
         <tr> \
           <th style="width:20%;">Set Name &#x25B2;&#x25BC;</th> \
           <th style="width:6%;">Rhythm<br />&#x25B2;&#x25BC;</th> \
           <th style="width:29%;">Titles</th> \
           <th style="width:45%;">Audio Player</th> \
         </tr> \
         </thead> \
         <tbody>';

         if (results.length) { // Are there any results?
             for (var i = 0; i < results.length; i++) { // Iterate over the results
                 var item = store[results[i].ref];
                 appendString += createTableRow(item);
                 setsCounter++;
             }
         } else {
             for (var key in store) { // Iterate over the original data
                 var item = store[key];
                 appendString += createTableRow(item);
                 setsCounter++;
             }
         }
         appendString += '</tbody></table></div>';
         setsTable.innerHTML = appendString;
         setsCount.innerHTML = 'Displaying ' + setsCounter + ' sets';
     }

     function createTableRow(item) {
         var tableRow = '';
         var setID = 'ABC' + item.setID;
         var tuneSources = item.tuneSources.split(',');
         var setURLs = item.setURLs.split(',');

         // build the first three columns
         tableRow += '<tr>';
         tableRow += '<td class="setTitle"><span title="Set played in: ' + item.location + '">';
         tableRow += '<a href="' + item.url + '">' + item.title + '</a></span></td>';
         tableRow += '<td>' + item.rhythm + '</td>';
         tableRow += '<td><table style="width: 100%;">';
         for (var i = 0; i < setURLs.length; i++) {
             tableRow += '<tr style="height: 77px; background-color:transparent;"><td  style="vertical-align: center;">' + setURLs[i] + '</td></tr>';
         }
         tableRow += '</table></td><td><table style="width: 100%;">';
         for (var i = 0; i < tuneSources.length; i++) {
             var setTuneID = (item.setID * 10) + i;
             // Can't use this on old javascript engines
             // if (tuneSources[i].includes('mp3')) {
             if (tuneSources[i].indexOf('mp3') !== -1) {
                 tableRow += '<tr id="tr' + setTuneID + '" style="background-color:transparent;"><td>' + createMP3player(setTuneID, tuneSources[i], 'mp3player_tablerow') + '</td></tr>';
                 console.log("Sliders for: " + setTuneID);
                 sliderArray1.push("playPosition" + setTuneID);
                 sliderArray2.push("RS" + setTuneID);
             } else {
                 var textAreas = document.getElementById("abc-textareas");
                 tableRow += '<tr id="tr' + setTuneID + '" style="background-color:transparent;"><td>' + createABCplayer(setTuneID, 'abcplayer_tablerow', item.instrument) + '</td></tr>';
                 textAreas.innerHTML += '<textarea id="ABC' + setTuneID + '" style="display:none;">' + preProcessABC(decodeURI(tuneSources[i])) + '</textarea>';
             }
         }
         tableRow += '</table></td></tr>';

         return tableRow;
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
         this.field('setTitles');
         this.field('rhythm');
     });

     // Add the search items to the search index
     for (var key in window.store) { // Add the data to lunr
         setIndex.add({
             'id': key,
             'title': window.store[key].title,
             'setTitles': window.store[key].setTitles.replace(/\'/g, ''),
             'rhythm': window.store[key].rhythm,
         });
     }

     // Get results
     if (searchTerm) {
         var results = setIndex.search(searchTerm); // Get lunr to perform a search

         if (results.length) {
             displaySetsTable(results, window.store);
         } else {
             document.getElementById('sets-table').innerHTML = '<strong>No results found!</strong>';
         }
     } else {
         displaySetsTable('', window.store);
     }
     return false;
 })();
