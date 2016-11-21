//
// Derived from: http://jekyll.tips/jekyll-casts/jekyll-search-using-lunr-js/
//

(function() {
  function displaySearchResults(results, store) {
     var t0 = performance.now();
    var searchResults = document.getElementById('search-results');
    // create table headers
    //<table style="width:100%"  align="center" id="search-results" class="tablesorter"></table> 
    var appendString = '<thead><tr> \
    <th style="width:25%;">Tune Name &#x25B2;&#x25BC;</th> \
    <th style="width:4%;">Key<br />&#x25B2;&#x25BC;</th> \
    <th style="width:6%;">Rhythm<br />&#x25B2;&#x25BC;</th> \
    <th style="width:40%;">Audio Control</th> \
    <th style="width:25%;">Speed Adjustment</th> \
    </tr></thead><tbody>'; 
    var td=[];
    td[0]='Tune Name &#x25B2;&#x25BC';
    td[1]='Key<br />&#x25B2;&#x25BC';
    td[2]='Rhythm<br />&#x25B2;&#x25BC';
    td[3]='Audio Control';
    td[4]='Speed Adjustment';

    var header = searchResults.createTHead();
    var row = header.insertRow(0);
    var i, cell;
    for(i=0;i<5;i++){
        cell = row.insertCell(i);
        cell.innerHTML = td[i];
    }

var rowNum=1;
    if (results.length) { // Are there any results?
        for (var i = 0; i < results.length; i++) {  // Iterate over the results
            var item = store[results[i].ref];
            appendString += createTableRow(item,searchResults,rowNum++);
      }       
    } else {       
        for (var key in store) { // Iterate over the original data
            var item = store[key];
            appendString += createTableRow(item,searchResults,rowNum++);
        }
    }

     appendString+='</tbody>';
    //searchResults.innerHTML = appendString;
    var t1 = performance.now();
alert("Call took " + (t1 - t0) + " milliseconds.");
  }
 
 
    
  function createTableRow(item,table,rowNum) {
       var tableRow = '';
       var td=[];
       // build the first three columns
/*       tableRow += '<tr>';
       tableRow += '<td><a href="' + item.url + '">' + item.title + '</a></td>';
       tableRow += '<td>' + item.key + '</td>';
       tableRow += '<td>' + item.rhythm + '</td>';
*/
        td[0]='<a href="' + item.url + '">' + item.title + '</a>';
        td[1]=item.key;
        td[2]=item.rhythm;
      if(item.mp3){
          // build the audio player for each tune          
/*          tableRow += '<td style="text-align:center"><audio id="A' + item.tuneID + '"';
          tableRow += ' title="' + item.title + '" controls loop preload="none" controls="controls"';
          tableRow += ' paired="RS' + item.tuneID + '">';
          tableRow += ' <source src="' + item.mp3 + '" type="audio/mpeg"></audio>';
          // build the loop mechanism for each tune
          tableRow += '<br /><span title="Play tune, select loop starting point, then select loop end point">';
          tableRow += '<input type="button" id="B1' + item.tuneID + '" value="Loop Start" onclick="SetPlayRange(A' + item.tuneID + ',0,B1' + item.tuneID + ', B2' + item.tuneID + ')">';
          tableRow += '<input type="button" id="B2' + item.tuneID + '" value=" Loop End " onclick="SetPlayRange(A' + item.tuneID + ',1,B1' + item.tuneID + ', B2' + item.tuneID + ')">';
          tableRow += '<input type="button" value="Reset" onclick="SetPlayRange(A' + item.tuneID + ',2,B1' + item.tuneID + ',B2' + item.tuneID + ')">';
          tableRow += '</span></td>'; 
*/         
        td[3]= '<audio id="A' + item.tuneID + '"'+
          ' title="' + item.title + '" controls loop preload="none" controls="controls"'+
          ' paired="RS' + item.tuneID + '">'+
          ' <source src="' + item.mp3 + '" type="audio/mpeg"></audio>'+
          '<br /><span title="Play tune, select loop starting point, then select loop end point">'+
          '<input type="button" id="B1' + item.tuneID + '" value="Loop Start" onclick="SetPlayRange(A' + item.tuneID + ',0,B1' + item.tuneID + ', B2' + item.tuneID + ')">'+
          '<input type="button" id="B2' + item.tuneID + '" value=" Loop End " onclick="SetPlayRange(A' + item.tuneID + ',1,B1' + item.tuneID + ', B2' + item.tuneID + ')">'+
          '<input type="button" value="Reset" onclick="SetPlayRange(A' + item.tuneID + ',2,B1' + item.tuneID + ',B2' + item.tuneID + ')">'+
          '</span>';          

          // build the loop mechanism for each tune
/*          tableRow += '<br /><span title="Play tune, select loop starting point, then select loop end point">';
          tableRow += '<input type="button" id="B1' + item.tuneID + '" value="Loop Start" onclick="SetPlayRange(A' + item.tuneID + ',0,B1' + item.tuneID + ', B2' + item.tuneID + ')">';
          tableRow += '<input type="button" id="B2' + item.tuneID + '" value=" Loop End " onclick="SetPlayRange(A' + item.tuneID + ',1,B1' + item.tuneID + ', B2' + item.tuneID + ')">';
          tableRow += '<input type="button" value="Reset" onclick="SetPlayRange(A' + item.tuneID + ',2,B1' + item.tuneID + ',B2' + item.tuneID + ')">';
          tableRow += '</span></td>';          
*/
          // build the slow down slider for each tune
/*          tableRow += '<td style="text-align:center"><form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">';
          tableRow += '<input name="flevel" id="RS' + item.title + '"';
          tableRow += ' type="range" min="50" max="120" value="100" placeholder="'+ item.title + '"';
          tableRow += ' paired="A' + item.tuneID + '"';
          tableRow += ' onchange="setPlaySpeed(value/100, A' + item.tuneID + ')">';
          tableRow += '<output name="level">100</output>%</form></td>';
          tableRow += '</tr>';
*/
        td[4]='<td style="text-align:center"><form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">'+
          '<input name="flevel" id="RS' + item.title + '"'+
          ' type="range" min="50" max="120" value="100" placeholder="'+ item.title + '"'+
          ' paired="A' + item.tuneID + '"'+
          ' onchange="setPlaySpeed(value/100, A' + item.tuneID + ')">'+
          '<output name="level">100</output>%</form>';
          tableRow += '</tr>';

      } else {
          // build the midi player for each tune 
/*          tableRow += '<td style="text-align:center"><span title="No MP3 available. Play and stop tune from ABC source">';          
          tableRow += '<input type="button" value="Play ABC" id="play" onclick="midiSliderChanged(320, ABC' + item.tuneID + ')"><br />';
          tableRow += '<input type="button" value="Stop" id="stop" onclick="stopMidi(ABC' + item.tuneID +')">';
          tableRow += '</span></td>';
*/
        td[3]='<td style="text-align:center"><span title="No MP3 available. Play and stop tune from ABC source">'+        
          '<input type="button" value="Play ABC" id="play" onclick="midiSliderChanged(320, ABC' + item.tuneID + ')"><br />'+
          '<input type="button" value="Stop" id="stop" onclick="stopMidi(ABC' + item.tuneID +')">'+
          '</span>';

          // build the slow down slider for each tune
/*          tableRow += '<td style="text-align:center"><span title="Set speed of playback">';
          tableRow += '<form onsubmit="return false" oninput="level.value = Math.round(flevel.valueAsNumber/3.2)">';
          tableRow += '<input name="flevel" id="RSM' + item.tuneID + '" type="range" min="160" max="384" value="320" ';
          tableRow += 'placeholder="' + item.tuneID  + '" paired="A' + item.tuneID + '" onchange="midiSliderChanged(value, ABC' + item.tuneID +')">';
          tableRow += '<output name="level">100</output>%';
          tableRow += '</form>';
          tableRow += '</span></td></tr>';
*/
        td[4]='<td style="text-align:center"><span title="Set speed of playback">'+
          '<form onsubmit="return false" oninput="level.value = Math.round(flevel.valueAsNumber/3.2)">'+
          '<input name="flevel" id="RSM' + item.tuneID + '" type="range" min="160" max="384" value="320" '+
          'placeholder="' + item.tuneID  + '" paired="A' + item.tuneID + '" onchange="midiSliderChanged(value, ABC' + item.tuneID +')">'+
          '<output name="level">100</output>%'+
          '</form>'+
          '</span>';

//          tableRow += '<textarea id="ABC' + item.tuneID + '" style="display:none;">' + preProcessABC(item.abc) + '</textarea>';
      }; 
      addRow(table,td,rowNum);
      return;// tableRow;
  }
  function addRow(table,td,rowNum) {
    var row = table.insertRow(rowNum);
    var i, cell;
    for(i=0;i<5;i++){
        cell = row.insertCell(i);
        cell.innerHTML = td[i];
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
      document.getElementById('search-term').innerHTML = window.store[key].title;
      tuneIndex.add({
        'id': key,
        'title': window.store[key].title,
        'rhythm': window.store[key].rhythm,
        'tags': window.store[key].tags
      });
  }
  
  // Clear the search-term area
  document.getElementById('search-term').innerHTML = '';
  
  
    // Get results
  if (searchTerm) {
 
      var results = tuneIndex.search(searchTerm); // Get lunr to perform a search
      
      if (results.length) {
          displaySearchResults(results, window.store);
      } else {
          document.getElementById('search-term').innerHTML = '<strong>No results found!</strong>';
      }
  } else {

      displaySearchResults('', window.store);
  }
      

  return false;
})();
