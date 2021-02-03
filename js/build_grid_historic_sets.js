/*
 * Code for building index of sets and searching it
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

(function () {
    function displaySetsGrid(results, setStore) {
        var setsTable = document.getElementById("tunesGrid");
        var setsCount = document.getElementById("tunesCount");
        var setsCounter = 0;

        // Find the tuneIDs that correspond to each set
        mapSetToTuneIDs();

        if (wssTools.testForMobile()) {
            var appendString =
                '<div id="tunes" class="tunes3columnLayout mobileScrolling">';
        } else {
            var appendString = '<div id="tunes" class="tunes3columnLayout">';
        }


        if (results.length) {
            // Are there any results?
            for (var i = 0; i < results.length; i++) {
                // Iterate over the results
                var item = setStore[results[i].ref];
                appendString += createGridRow(item);
                setsCounter++;
            }
        } else {
            for (var key in setStore) {
                // Iterate over the original data
                var item = setStore[key];
                appendString += createGridRow(item);
                setsCounter++;
            }
        }
        appendString += "</div>";
        setsTable.innerHTML = appendString;
        setsCount.innerHTML = setsCounter;
    }

    function createGridRow(item) {
        var gridRow = "";
        var setID = "ABC" + item.setID;
        var tuneIDs = item.tuneIDs.split(",");

        // build the first three columns
        gridRow +=
            '<span title="Set played in: ' +
            item.location +
            '">';
        gridRow += '<a href="' + item.url + '">' + item.title + '</a>';
        gridRow += '&nbsp;(' + item.rhythm + ')';
        gridRow += '</span>';
        gridRow += '<span class="setRow">';
        for (var i = 0; i < tuneIDs.length; i++) {
            var url = store[tuneIDs[i]].url;
            var title = store[tuneIDs[i]].title;
            var key = store[tuneIDs[i]].key;

            gridRow += '<div>';
            gridRow += '<a href="' + url + '">' + title + " (" + key + ")</a>";
            gridRow += "</div>";
        }
        gridRow += "</span>";
        gridRow += '<span class="setRow">';
        for (var i = 0; i < tuneIDs.length; i++) {
            var tuneID = tuneIDs[i];

            gridRow +=
                '<input class="filterButton setChild" type="button" onclick="audioPlayer.selectTune(store,' +
                tuneID +
                ');" value="Play Now" />';
        }
        gridRow += "</span>";

        return gridRow;
    }

    function mapSetToTuneIDs() {
        var SetToTuneIDs = {};
        for (var setKey in setStore) {
            var setTunes = setStore[setKey].setTunes;
            for (var i = 0; i < setTunes.length; i++) {
                for (var tuneKey in store) {
                    var tune = store[tuneKey];
                    if (setTunes[i] == tune.tuneID) {
                        setStore[setKey].tuneIDs += tuneKey + ",";
                    }
                }
            }
            // Strip off trailing ','
            setStore[setKey].tuneIDs = setStore[setKey].tuneIDs.slice(0, -1);
        }
    }

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");

        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");

            if (pair[0] === variable) {
                return decodeURIComponent(pair[1].replace(/\+/g, "%20"));
            }
        }
    }

    // create the searchTerm from the form data and reflect the values chosen in the form
    var searchTerm = "";
    var title = getQueryVariable("title");
    if (title) {
        searchTerm = title + " ";
        document.getElementById("title-box").setAttribute("value", title);
    }
    var setTitles = getQueryVariable("title");
    if (setTitles) {
        searchTerm += setTitles + " ";
    }
    var rhythm = getQueryVariable("rhythm");
    if (rhythm) {
        searchTerm += rhythm;
        var e = document.getElementById("rhythm-box");
        if (e) {
            e.value = rhythm;
        }
    }

    // Define the index terms for lunr search
    var setIndex = lunr(function () {
        this.field("id");
        this.field("title", {
            boost: 10,
        });
        this.field("rhythm");
    });

    // Add the search items to the search index
    for (var key in window.setStore) {
        // Add the data to lunr
        setIndex.add({
            id: key,
            title: window.setStore[key].title,
            rhythm: window.setStore[key].rhythm,
        });
    }

    // Get results
    if (searchTerm) {
        var results = setIndex.search(searchTerm); // Get lunr to perform a search

        if (results.length) {
            displaySetsGrid(results, window.setStore);
        } else {
            document.getElementById("tunesCount").innerHTML = 0;
        }
    } else {
        displaySetsGrid("", window.setStore);
    }
    return false;
})();