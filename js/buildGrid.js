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

"use strict";

const buildGrid = (function () {
    function displayPottsTunes(store) {
        let tunesGrid = document.getElementById("tunesGrid");
        let appendString = '';

        // create div for tunes grid
        tunesGrid.classList.add("tunes1columnLayout");

        for (let key in store) {
            // Iterate over the original data
            let item = store[key];
            appendString += '<span><a href="' + item.url + '">' + item.title + "</a></span>";
        }
        tunesGrid.innerHTML = appendString;
    }

    function displayObrienTunes(results, store) {
        let tunesGrid = document.getElementById("tunesGrid");
        let tunesCount = document.getElementById("tunesCount");
        let tunesCounter = 0;
        let appendString = '';

        // create div for tunes grid
        tunesGrid.classList.add("tunes2columnLayout");

        if (results.length) {
            // Are there any results?
            for (let i = 0; i < results.length; i++) {
                // Iterate over the results
                let item = store[results[i].ref];
                appendString += '<span><a href="' + item.url + '">' + item.title + "</a></span>";
                appendString += "<span>" + item.key + " " + item.rhythm + "</span>";
                tunesCounter++;
            }
        } else {
            for (let key in store) {
                // Iterate over the original data
                let item = store[key];
                appendString += '<span><a href="' + item.url + '">' + item.title + "</a></span>";
                appendString += "<span>" + item.key + " " + item.rhythm + "</span>";
                tunesCounter++;
            }
        }
        tunesGrid.innerHTML = appendString;
        tunesCount.innerHTML = tunesCounter;
    }

    function displayNorthernFiddlerTunes(results, store) {
        let tunesGrid = document.getElementById("tunesGrid");
        let tunesCount = document.getElementById("tunesCount");
        let tunesCounter = 0;
        let appendString = '';

        // create div for tunes grid
        tunesGrid.classList.add("tunes3columnLayout");

        if (results.length) {
            // Are there any results?
            for (let i = 0; i < results.length; i++) {
                // Iterate over the results
                let item = store[results[i].ref];
                appendString += '<span><a href="' + item.url + '">' + item.title + "</a></span>";
                appendString += "<span>" + item.key + " " + item.rhythm + "</span>";
                appendString += "<span>" + item.mp3_source + " Page " + item.page + "</span>";
                tunesCounter++;
            }
        } else {
            for (let key in store) {
                // Iterate over the original data
                let item = store[key];
                appendString += '<span><a href="' + item.url + '">' + item.title + "</a></span>";
                appendString += "<span>" + item.key + " " + item.rhythm + "</span>";
                appendString += "<span>" + item.mp3_source + " Page " + item.page + "</span>";
                tunesCounter++;
            }
        }
        tunesGrid.innerHTML = appendString;
        tunesCount.innerHTML = tunesCounter;
    }

    function displayTunesArchive(results, store) {
        let tunesGrid = document.getElementById("tunesGrid");
        let tunesCount = document.getElementById("tunesCount");
        let tunesCounter = 0;
        let appendString = '';

        // create div for tunes grid
        tunesGrid.classList.add("tunes3columnLayout");

        if (results.length) {
            // Are there any results?
            for (let i = 0; i < results.length; i++) {
                // Iterate over the results
                let item = store[results[i].ref];
                appendString += '<span><a href="' + item.url + '">' + item.title + "</a></span>";
                appendString +=
                    '<span><input class="filterButton" type="button" onclick="audioPlayer.selectTune(window.store, ' +
                    item.tuneID +
                    ');" value="Play Now" /></span>';
                appendString += "<span>" + item.key + " " + item.rhythm + "</span>";

                tunesCounter++;
            }
        } else {
            for (let key in store) {
                // Iterate over the original data
                let item = store[key];
                appendString += '<span><a href="' + item.url + '">' + item.title + "</a></span>";
                appendString +=
                    '<span><input class="filterButton" type="button" onclick="audioPlayer.selectTune(window.store, ' +
                    item.tuneID +
                    ');" value="Play Now" /></span>';
                appendString += "<span>" + item.key + " " + item.rhythm + "</span>";

                tunesCounter++;
            }
        }

        tunesGrid.innerHTML = appendString;
        tunesCount.innerHTML = tunesCounter;
    }

    function displayFocusTunes(divID, storeName, storeObject) {
        // create div for tunes grid
        document.getElementById(divID).classList.add("tunes3columnLayout");

        let appendString = '';
        for (let key in storeObject) {
            // Iterate over the original data
            let item = storeObject[key];

            appendString += `<span><a href="${item.url}">${item.title}</a></span>
                  <span><input class="filterButton" type="button" 
                  onclick="audioPlayer.selectTune(${storeName}, ${item.tuneID});" value="Play Now">
                  </span>
                  <span>${item.key} ${item.rhythm}</span>`;
        }
        appendString += "</div>";
        document.getElementById(divID).innerHTML = appendString;
    }

    let tuneIndex = null;

    function initialiseLunrSearch() {
        // create the searchTerm from the form data and reflect the values chosen in the form

        // Define the index terms for lunr search
        tuneIndex = lunr(function () {
            this.field("id");
            this.field("title", {
                boost: 10,
            });
            this.field("rhythm");
            this.field("mp3_source");
        });

        // Add the search items to the search index
        for (let key in window.store) {
            // Add the data to lunr
            tuneIndex.add({
                id: key,
                title: window.store[key].title,
                rhythm: window.store[key].rhythm,
                mp3_source: window.store[key].mp3_source,
            });
        }
    }

    function displayGrid(tuneBook, searchResults, store) {

        switch (tuneBook) {
            case 'potts':
                displayPottsTunes(store);
                break;
            case 'obrien':
                displayObrienTunes(searchResults, store);
                break;
            case 'northernfiddler':
                displayNorthernFiddlerTunes(searchResults, store);
                break;
            default:
                displayTunesArchive(searchResults, store);
        }
    }
    
    function formSearch(tuneBook, searchTerm) {
        let searchResults = "";

        // Get results
        if (searchTerm) {
            searchResults = tuneIndex.search(searchTerm); // Get lunr to perform a search

            if (searchResults.length) {
                // sort the results
                searchResults.sort((a, b) => a.ref - b.ref);
                displayGrid(tuneBook, searchResults, window.store);
            } else {
                document.getElementById("tunesGrid").innerHTML = 'No results found!';
                document.getElementById("tunesCount").innerHTML = 0;
            }
        } else {
            displayGrid(tuneBook, searchResults, window.store);
        }
    }

    function formReset(tuneBook, formInput) {
        let searchResults = '';

        document.getElementById(formInput).value = '';
        displayGrid(tuneBook, searchResults, window.store);
    }

    return {
        displayGrid: displayGrid,
        initialiseLunrSearch: initialiseLunrSearch,
        formSearch: formSearch,
        formReset: formReset,
        displayFocusTunes: displayFocusTunes,
    };

})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = buildGrid;
}
