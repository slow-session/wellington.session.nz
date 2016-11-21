//
// Derived from: http://jekyll.tips/jekyll-casts/jekyll-search-using-lunr-js/
//

(function() {
  function displayTunesTable(results, store) {
   
    var tunesTable = document.getElementById('tunes-table');
    
    // create table headers
    var appendString = '<table style="width:100%"  align="center" id="search-results" class="tablesorter"> \
    <thead><tr> \
    <th style="width:25%;">Tune Name &#x25B2;&#x25BC;</th> \
    <th style="width:4%;">Key<br />&#x25B2;&#x25BC;</th> \
    <th style="width:6%;">Rhythm<br />&#x25B2;&#x25BC;</th> \
    <th style="width:40%;">Audio Control</th> \
    <th style="width:25%;">Speed Adjustment</th> \
    </tr></thead><tbody>'; 
  
    if (results.length) { // Are there any results?        
        for (var i = 0; i < results.length; i++) {  // Iterate over the results
            var item = store[results[i].ref];
            appendString += createTableRow(item);
            addTextArea(item);
      }             
    } else {               
        for (var key in store) { // Iterate over the original data
            var item = store[key];
            appendString += createTableRow(item);
            addTextArea(item);
        }      
    }
    appendString += '</tbody></table>';
    
    tunesTable.innerHTML = appendString;
  }
    
  function createTableRow(item) {
       var tableRow = '';
       
       // build the first three columns
       tableRow += '<tr>';
       tableRow += '<td><a href="' + item.url + '">' + item.title + '</a></td>';
       tableRow += '<td>' + item.key + '</td>';
       tableRow += '<td>' + item.rhythm + '</td>';

      if(item.mp3){
          tableRow += '<td style="text-align:center">';
          // build the audio player for each tune          
          tableRow += '<audio id="A' + item.tuneID + '" title="' + item.title + '" controls loop preload="none">';
          tableRow += ' <source src="' + item.mp3 + '" type="audio/mpeg"></audio>';
          // build the loop mechanism for each tune
          tableRow += '<br /><span title="Play tune, select loop starting point, then select loop end point">';
          tableRow += '<input type="button" id="B1' + item.tuneID + '" value="Loop Start" onclick="SetPlayRange(A' + item.tuneID + ',0,B1' + item.tuneID + ', B2' + item.tuneID + ')">';
          tableRow += '<input type="button" id="B2' + item.tuneID + '" value=" Loop End " onclick="SetPlayRange(A' + item.tuneID + ',1,B1' + item.tuneID + ', B2' + item.tuneID + ')">';
          tableRow += '<input type="button" value="Reset" onclick="SetPlayRange(A' + item.tuneID + ',2,B1' + item.tuneID + ',B2' + item.tuneID + ')">';
          tableRow += '</span></td>';          
     
          // build the slow down slider for each tune
          tableRow += '<td style="text-align:center">';
          tableRow += '<form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">';
          tableRow += '<input name="flevel" id="RS' + item.tuneID + '"';
          tableRow += ' type="range" min="50" max="120" value="100"';
          tableRow += ' onchange="setPlaySpeed(value/100, A' + item.tuneID + ')">';
          tableRow += '<output name="level">100</output>%';
          tableRow += '</form></td></tr>';
      } else {
          tableRow += '<td style="text-align:center">';
          // build the abc player for each tune 
          tableRow += '<span title="No MP3 available. Play and stop tune from ABC source">';          
          tableRow += '<input type="button" value="Play ABC" id="play" onclick="abcSliderChanged(320, ABC' + item.tuneID + ')"><br />';
          tableRow += '<input type="button" value="Stop" id="stop" onclick="stopABC(ABC' + item.tuneID +')">';
          tableRow += '</span></td>';
          
          // build the slow down slider for each tune
          tableRow += '<td style="text-align:center">';
          tableRow += '<form onsubmit="return false" oninput="level.value = Math.round(flevel.valueAsNumber/3.2)">';
          tableRow += '<input name="flevel" id="RSM' + item.tuneID + '" type="range" min="160" max="384" value="320" ';
          tableRow += 'placeholder="' + item.tuneID  + '" paired="A' + item.tuneID + '" onchange="abcSliderChanged(value, ABC' + item.tuneID +')">';
          tableRow += '<output name="level">100</output>%';
          tableRow += '</form></td></tr>';
      }; 
      return tableRow;
  }
  
  function addTextArea(item) {
      var textAreas = document.getElementById("abc-textareas");
      
      if(!item.mp3){
          // unroll ABC to handle repeats and different endings for parts
          textAreas.innerHTML +=  '<textarea id="ABC' + item.tuneID + '" style="display:none;">' + preProcessABC(item.abc) + '</textarea>';
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
  var rhythm = getQueryVariable('rhythm');
  if (rhythm) {
      searchTerm += rhythm + ' ';
      var e = document.getElementById('rhythm-box');
      if(e) {
          e.value = rhythm;
      }
  }
  var tags = getQueryVariable('tags');
  if (tags) {
      searchTerm += tags;
      var e = document.getElementById('tags-box');
      if(e) {
          e.value = tags;
      }
  }
  
  // Define the index terms for lunr search
  var tuneIndex = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('rhythm');
      this.field('tags');
  });

  // Add the search items to the search index
  for (var key in window.store) { // Add the data to lunr
      tuneIndex.add({
        'id': key,
        'title': window.store[key].title,
        'rhythm': window.store[key].rhythm,
        'tags': window.store[key].tags
      });
  }
    
  // Get results
  if (searchTerm) {
      var results = tuneIndex.search(searchTerm); // Get lunr to perform a search
      
      if (results.length) {
          displayTunesTable(results, window.store);
      } else {
          document.getElementById('tunes-table').innerHTML = '<strong>No results found!</strong>';
      }
  } else {
      displayTunesTable('', window.store);
  }
  return false;
})();
