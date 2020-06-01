 /*
  * Code for building index of tunes and searching it
  *
  * Version: 1.0
  * Date: 7 Dec 2016
  *
  * Developed as part of websites for https://dev.session.nz
  * by Ted Cizadlo and Andy Linton
  * Code available at:
  * https://github.com/slow-session/dev.session.nz/blob/master/js/audioID_controls.js
  * Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) Licence.
  *
  * Derived from: http://jekyll.tips/jekyll-casts/jekyll-search-using-lunr-js/
  */

 var tuneIDs = [];

 function appendABC(abcSource, tuneID, title) {
   var regex = new RegExp('X:.*\n');

   document.getElementById('ABCraw').innerHTML += abcSource + "\n";
   abcSource = abcSource.replace(regex, '');

   document.getElementById('ABCprocessed').innerHTML += preProcessABC(abcSource) + "\n";
   document.getElementById("filename").innerHTML = slugify(getABCtitle(ABCraw.value)) + '.abc';

   document.getElementById('setTuneTitles').innerHTML += unescape(title) + '<br />';
   document.getElementById('modalControls').style.display = 'block';
   document.getElementById(tuneID).style.backgroundColor = 'khaki';
   tuneIDs.push(tuneID);

   document.getElementById('paperHeader').style.display = "none";

   // create the paper for the tune dots each time the user selects tunes
   // This makes sure there's no extra white space after a reset
   if (!document.getElementById('paper0')) {
     var divPaper = document.createElement("div");
     divPaper.id = 'paper0';
     divPaper.setAttribute('class', 'paper');
     divPaper.style.maxWidth = '650px';
     document.getElementById('output').appendChild(divPaper);
   }

   abc_editor = new window.ABCJS.Editor("ABCraw", {
     paper_id: 'paper0',
     midi_id: "midi",
     warnings_id: "warnings",
     render_options: {
       responsive: 'resize'
     },
     indicate_changed: "true"
   });
 }

 function Reset() {
   document.getElementById('paperHeader').style.display = "block";
   document.getElementById('ABCraw').innerHTML = '';
   document.getElementById('ABCprocessed').innerHTML = 'X: 1';
   document.getElementById('filename').innerHTML = '';
   document.getElementById('setTuneTitles').innerHTML = '';

   // delete the paper for the tune dots after a reset
   // selecting new tunes will then create new paper
   if (elem = document.getElementById('paper0')) {
     document.getElementById('output').removeChild(elem);
   }

   document.getElementById('modalControls').style.display = 'none';
   var tLen = tuneIDs.length;
   for (i = 0; i < tLen; i++) {
     document.getElementById(tuneIDs[i]).style.backgroundColor = '';
   }
   tuneIDs = [];
 }

 (function() {
   function displayTunesGrid(results, store) {
     var tunesGrid = document.getElementById('tunesGrid');
     var tunesCount = document.getElementById('tunesCount');
     var tunesCounter = 0;

     // create table headers
     if (testForMobile()) {
       var appendString = '<div id="tunes" class="tunesArchiveLayout mobileScrolling">';;
     } else {
       var appendString = '<div id="tunes" class="tunesArchiveLayout">';
     }

     if (results.length) { // Are there any results?
       for (var i = 0; i < results.length; i++) { // Iterate over the results
         var item = store[results[i].ref];
        
         if (item.abc) {
           appendString += createGridRow(item);
           addTextArea(item);
           tunesCounter++;
         }
       }
     } else {
       for (var key in store) { // Iterate over the original data
         var item = store[key];
         if (item.abc) {
           appendString += createGridRow(item);
           addTextArea(item);
           tunesCounter++;
         }
       }
     }
     appendString += '</tbody></table></div>';
     tunesGrid.innerHTML = appendString;
     tunesCount.innerHTML = tunesCounter;
   }

   function createGridRow(item) {
     var gridRow = '';
     var tuneID = 'ABC' + item.tuneID;

     // build the first three columns
     gridRow += '<span id="tr' + item.tuneID + '"><a href="' + item.url + '">' + item.title + '</a></span>';
     gridRow += '<span><input type="button" class="filterButton" onclick="appendABC(document.getElementById(\'' + tuneID + '\').value' + ', \'tr' + item.tuneID + '\', \'' + escape(item.title) + '\')" value="Select"></span>';
     gridRow += '<span>' + item.key + ' ' + item.rhythm + '</span>';
     return gridRow;
   }

   function addTextArea(item) {
     var textAreas = document.getElementById("abc-textareas");
     //console.log(item.tuneID);
     // unroll ABC to handle repeats and different endings for parts
     textAreas.innerHTML += '<textarea id="ABC' + item.tuneID + '" style="display:none;">' + item.abc + '</textarea>';
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
     // Get lunr to perform a search
     var results = tuneIndex.search(searchTerm);
    
     // sort the results
     results.sort((a,b) => (a.ref - b.ref)); 
     
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
