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

 (function() {
   function displayTunesGrid(results, store) {
     var tunesGrid = document.getElementById('tunesGrid');
     var tunesCount = document.getElementById('tunesCount');
     var tunesCounter = 0;

     // create table headers
     if (testForMobile()) {
       var appendString = '<div id="tunes" class="tunesObrienLayout mobileScrolling">';
     } else {
       var appendString = '<div id="tunes" class="tunesObrienLayout">';
     }

     if (results.length) { // Are there any results?
       for (var i = 0; i < results.length; i++) { // Iterate over the results
         var item = store[results[i].ref];
         appendString += createGridRow(item);
         tunesCounter++;
       }
     } else {
       for (var key in store) { // Iterate over the original data
         var item = store[key];
         // We assume generated tables start at ID 200 - this lets us have
         // singleTune items in the window.store for mixed pages like the
         // slowsession page
         if (item.tuneID < 200) {
           continue;
         }
         appendString += createGridRow(item);
         tunesCounter++;
       }
     }
     appendString += '</div';
     tunesGrid.innerHTML = appendString;
     tunesCount.innerHTML = tunesCounter;
   }

   function createGridRow(item) {
     var gridRow = '';

     // build the two columns
     gridRow += '<span><a href="' + item.url + '">' + item.title + '</a></span>';
     gridRow += '<span>' + item.key + ' ' + item.rhythm + '</span>';

     return gridRow;
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
   var rhythm = getQueryVariable('rhythm');
   if (rhythm) {
     searchTerm += rhythm + ' ';
     var e = document.getElementById('rhythm-box');
     if (e) {
       e.value = rhythm;
     }
   }
   // Define the index terms for lunr search
   var tuneIndex = lunr(function() {
     this.field('id');
     this.field('title', {
       boost: 10
     });
     this.field('rhythm');
   });

   // Add the search items to the search index
   for (var key in window.store) { // Add the data to lunr
     tuneIndex.add({
       'id': key,
       'title': window.store[key].title,
       'rhythm': window.store[key].rhythm,
     });
   }

   // Get results
   if (searchTerm) {
     var results = tuneIndex.search(searchTerm); // Get lunr to perform a search

     if (results.length) {
       displayTunesGrid(results, window.store);
     } else {
       document.getElementById('tunesCount').innerHTML = 0;
     }
   } else {
     displayTunesGrid('', window.store);
   }
   return false;

 })();
