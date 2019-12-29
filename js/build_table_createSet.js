 /*
  * Code for building index of tunes and searching it
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

  var tuneIDs = [];

  function appendSetTunes(mdfile, tuneID) {
  	document.getElementById('setTitles').innerHTML += mdfile + "<br />";
  	document.getElementById('setTunes').innerHTML += mdfile + ", ";
  	document.getElementById(tuneID).style.backgroundColor = 'khaki';
  	tuneIDs.push(tuneID);
  }

  function Reset() {
      document.getElementById('createSetMD').reset();
  	document.getElementById('setTitles').innerHTML = '';
      document.getElementById('setTunes').innerHTML = '[';
      document.getElementById('setMD').innerHTML = '';
  	var tLen = tuneIDs.length;
  	for (i = 0; i < tLen; i++) {
  		document.getElementById(tuneIDs[i]).style.backgroundColor = '';
  	}
  	tuneIDs = [];
  }

  function showForm(textArea, myForm) {
      var elements = document.getElementById(myForm).elements;
      var obj = {};
      var date = new Date();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      var locationNotProcessed = 1;

      document.getElementById(textArea).innerHTML = '---\n';
      for(var i = 0 ; i < elements.length ; i++){
          var item = elements.item(i);

  		if (item.name == "") {
  			continue;
  		}
          if (item.value == "Build the MD file") {
              continue;
          }

          switch(item.name) {
  			case 'title':
  				if (item.value == '') {
  					alert("'Title' is required");
          			return false;
  				}
  				obj[item.name] = item.value;
  				break;
  			case 'rhythm':
  				if (item.value == '') {
  					alert("'Rhythm' is required");
  		        	return false;
  				}
  				obj[item.name] = item.value;
  				break;
            case 'location':
  				if (item.value == '') {
  					alert("'Location' is required");
  		        	return false;
      			}
      			obj[item.name] = item.value;
      			break;
  			case 'contributor':
  				if (item.value == '') {
  					alert("'Contributed by' is required");
  	        		return false;
  				}
  				obj[item.name] = item.value;
  				break;
            case 'date':
                obj[item.name] = year + '-' + (month<=9 ? '0' + month : month) + '-' + (day <= 9 ? '0' + day : day)
                break;
  			case 'tunes':
  				obj[item.name] = document.getElementById('setTunes').value.concat(']').replace(', ]', ']');
  				break;
              default:
                  obj[item.name] = item.value;
          }
          document.getElementById(textArea).innerHTML += item.name + ': ' + obj[item.name] + '\n';
      }
      document.getElementById(textArea).innerHTML += '---\n';

      // Set the filename for downloading
      document.getElementById("filename").innerHTML = slugify(obj["title"]) + '.md'
  }

 (function() {
     function displayTunesTable(results, store) {
         var tunesTable = document.getElementById('tunesTable');
         var tunesCount = document.getElementById('tunesCount');
         var tunesCounter = 0;

         // create table headers
         var appendString = '<table id="tunes" class="tuneSelect tablesorter"> \
         <thead> \
         <tr> \
           <th style="width:10%;min-width:75px;">Add Tune</th> \
           <th style="width:35%;">Name &#x25B2;&#x25BC;</th> \
           <th style="width:6%;">Rhythm<br />&#x25B2;&#x25BC;</th> \
           <th style="width:4%;">Key<br />&#x25B2;&#x25BC;</th> \
         </tr> \
         </thead> \
         <tbody>';

         if (results.length) { // Are there any results?
             for (var i = 0; i < results.length; i++) { // Iterate over the results
                 var item = store[results[i].ref];
                 appendString += createTableRow(item);
                 addTextArea(item);
                 tunesCounter++;
             }
         } else {
             for (var key in store) { // Iterate over the original data
                 var item = store[key];
                 appendString += createTableRow(item);
                 addTextArea(item);
                 tunesCounter++;
             }
         }
         appendString += '</tbody></table>';
         tunesTable.innerHTML = appendString;
         tunesCount.innerHTML = tunesCounter;
     }

     function createTableRow(item) {
         var tableRow = '';
         var tuneID = 'ABC' + item.tuneID;

         // build the columns
         tableRow += '<tr id="tr' + item.tuneID + '">';
         tableRow += '<td><input type="button" class="loopButton" ';
         tableRow += 'onclick="appendSetTunes(\''  + item.mdFile + '\', \'tr' + item.tuneID + '\')" value="Select">';
         tableRow += '<td class="tuneTitle" style="text-align:left"><span title="Tune played in: ' + item.location + '">';
         tableRow += '<a href="' + item.url + '">' + item.title + '</a></span></td>';
         tableRow += '<td>' + item.rhythm + '</td>';
         tableRow += '<td>' + item.key + '</td>';
         tableRow += '</tr>';
         return tableRow;
     }

     function addTextArea(item) {
         var textAreas = document.getElementById("abc-textareas");
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
     var rhythm = getQueryVariable('tune-rhythm');
     if (rhythm) {
         searchTerm += rhythm + ' ';
         var e = document.getElementById('tune-rhythm-box');
         if (e) {
             e.value = rhythm;
         }
     }
     var tags = getQueryVariable('tune-tags');
     if (tags) {
         searchTerm += tags + ' ';
         var e = document.getElementById('tune-tags-box');
         if (e) {
             e.value = tags;
         }
     }
     var location = getQueryVariable('tune-location');
     if (location) {
         searchTerm += location;
         var e = document.getElementById('tune-location-box');
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
             if (results.length > 10) {
                createArchiveSlider('tableSlider');
                document.getElementById("tunes").addEventListener("scroll", scroll_indicator);
            }
         } else {
             document.getElementById('tunesCount').innerHTML = 0;
         }
     } else {
         displayTunesTable('', window.store);
         if (Object.keys(store).length > 10) {
             createArchiveSlider('tableSlider');
             document.getElementById("tunes").addEventListener("scroll", scroll_indicator);
         }
     }
     return false;
 })();
