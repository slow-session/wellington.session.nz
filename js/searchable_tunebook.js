//
// Derived from: http://jekyll.tips/jekyll-casts/jekyll-search-using-lunr-js/
//

(function() {
  function displaySearchResults(searchTerm, results, store) {
    var searchResults = document.getElementById('tunebook');
    var d = new Date();
    d.toDateString();
    var appendString = '<h1>Wellington Session Tunebook</h1>';
    appendString += '<p>Created on: ' +  d.toDateString() + '</p>';
    if (searchTerm) {
        appendString += '<p>You selected: <strong>' + searchTerm + '</strong></p>';
    }
        
    if (results.length) { // Are there any results?
        // Sort the results by ascending ID - this equates to ascending ascii title
        var keys = [];
        for (var i = 0; i < results.length; i++) {
            keys.push(results[i].ref);
        }
        keys.sort(function(a, b){return a-b});
        
        for (var sortkey of keys) {
            var item = store[sortkey];
            appendString +=  "<p>%%staffwidth 540\n" + item.abc + '</p>';
        }       
    } else {       
        for (var key in store) { // Iterate over the original data
            var item = store[key];
            appendString +=  "<p>%%staffwidth 540\n" + item.abc + '</p>';
        }
    }
    searchResults.innerHTML = appendString;
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
      document.getElementById('tunebook').innerHTML = window.store[key].title;
      tuneIndex.add({
        'id': key,
        'title': window.store[key].title,
        'rhythm': window.store[key].rhythm,
        'tags': window.store[key].tags
      });
  }
    
  // Get results
  var results = tuneIndex.search(searchTerm); // Get lunr to perform a search
      
  displaySearchResults(searchTerm, results, window.store);

  return false;
})();
