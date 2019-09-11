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
     function displayTunesTable(results, store) {
         var tunesTable = document.getElementById('tuneTable');
         var tunesCount = document.getElementById('tunes-count');
         var tunesCounter = 0;

         // create table headers
         var appendString = '<table id="tunes" class="tuneSelect tablesorter"> \
         <thead> \
         <tr> \
            <th style="width: 50%;">Tune Name &#x25B2;&#x25BC;</th> \
            <th style="width: 20%;">Play Now</th> \
            <th style="width: 10%;">Key &#x25B2;&#x25BC;</th> \
            <th style="width: 20%;">Rhythm &#x25B2;&#x25BC;</th> \
         </tr> \
         </thead> \
         <tbody>';

         if (results.length) { // Are there any results?
             for (var i = 0; i < results.length; i++) { // Iterate over the results
                 var item = store[results[i].ref];
                 appendString += createTableRow(item);
                 tunesCounter++;
             }
         } else {
             for (var key in store) { // Iterate over the original data
                 var item = store[key];
                 appendString += createTableRow(item);
                 tunesCounter++;
             }
         }
         appendString += '</tbody></table>';
         tunesTable.innerHTML = appendString;
         tunesCount.innerHTML = 'Displaying ' + tunesCounter + ' tunes';
     }

     function createTableRow(item) {
         var tableRow = '';
         // build the four columns
         tableRow += '<tr id="tr' + item.tuneID + '">';
         tableRow += '<td class="tdArchive"><span title="Go to Tunepage">';
         tableRow += '<a href="' + item.url + '">' + item.title + '</a>';
         tableRow += '</span></td>';
         tableRow += '<td><input class="filterButton" type="button" onclick="changeTune(' + item.tuneID + ');" value="Play Now" /></td>';
         tableRow += '<td>' + item.key + '</td>';
         tableRow += '<td>' + item.rhythm + '</td>';
         tableRow += '</tr>';

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
          var rhythm = getQueryVariable('rhythm');
          if (rhythm) {
              searchTerm += rhythm + ' ';
              var e = document.getElementById('rhythm-box');
              if (e) {
                  e.value = rhythm;
              }
          }
          var tags = getQueryVariable('tags');
          if (tags) {
              searchTerm += tags + ' ';
              var e = document.getElementById('tags-box');
              if (e) {
                  e.value = tags;
              }
          }
          var location = getQueryVariable('location');
          if (location) {
              searchTerm += location;
              var e = document.getElementById('location-box');
              if (e) {
                  e.value = location;
              }
          }
          // Define the index terms for lunr search
          var tuneIndex = lunr(function() {
              this.field('id');
              this.field('title', {
                  boost: 10
              });
              this.field('rhythm');
              this.field('tags');
              this.field('location');
          });

          // Add the search items to the search index
          for (var key in window.store) { // Add the data to lunr
              tuneIndex.add({
                  'id': key,
                  'title': window.store[key].title,
                  'rhythm': window.store[key].rhythm,
                  'tags': window.store[key].tags,
                  'location': window.store[key].location
              });
          }

          // Get results
          if (searchTerm) {
              var results = tuneIndex.search(searchTerm); // Get lunr to perform a search

              if (results.length) {
                  displayTunesTable(results, window.store);
              } else {
                  document.getElementById('tuneTable').innerHTML = '<strong>No results found!</strong>';
              }
          } else {
              displayTunesTable('', window.store);
          }
          return false;

 })();
