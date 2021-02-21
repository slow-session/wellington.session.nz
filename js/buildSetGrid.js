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
"use strict";

const buildSetGrid = (function () {
    function displaySetGrid(results, store) {
        let tunesGrid = document.getElementById("tunesGrid");
        let tunesCount = document.getElementById("tunesCount");
        let tunesCounter = 0;
        let appendString = '';

        // create div for tunes grid
        tunesGrid.classList.add("tunes3columnLayout");
        if (wssTools.testForMobile()) {
          tunesGrid.classList.add("mobileScrolling");
        }

        if (results.length) {
            // Are there any results?
            for (let i = 0; i < results.length; i++) {
                // Iterate over the results
                let item = store[results[i].ref];

                if (item.abc) {
                    appendString += createGridRow(item);
                    tunesCounter++;
                }
            }
        } else {
            for (let key in store) {
                // Iterate over the original data
                let item = store[key];
                if (item.abc) {
                    appendString += createGridRow(item);
                    tunesCounter++;
                }
            }
        }

        tunesGrid.innerHTML = appendString;
        tunesCount.innerHTML = tunesCounter;
    }

    function createGridRow(item) {
        let gridRow = "";

        // build the first three columns
        gridRow +=
            '<span id="gr' +
            item.tuneID +
            '"><a href="' +
            item.url +
            '">' +
            item.title +
            "</a></span>";
        gridRow +=
            '<span><input type="button" class="filterButton" onclick="buildSetGrid.addABCtune(' +
            item.tuneID +
            ')" value="Select"></span>';
        gridRow += "<span>" + item.key + " " + item.rhythm + "</span>";

        return gridRow;
    }

    let tuneIDs = [];

    function addABCtune(tuneID) {
        let item = store[tuneID];

        document.getElementById("setTuneTitles").innerHTML += item.title + "<br />";
        document.getElementById("gr" + tuneID).style.backgroundColor = "khaki";

        tuneIDs.push(tuneID);
    }

    function loadTextarea() {
        let regex = new RegExp("X:.*\n");

        for (let i = 0; i < tuneIDs.length; i++) {
            let item = store[tuneIDs[i]];

            if (i == 0) {
                textAreaABC.value = item.abc;
            } else {
                textAreaABC.value += item.abc.replace(regex, "");
            }
        }
        if (tuneIDs.length) {
            document.getElementById("paperHeader").style.display = "none";

            audioPlayer.displayABC(textAreaABC.value);
        }

    }

    function Reset() {
        document.getElementById("paperHeader").style.display = "inline";
        document.getElementById("setTuneTitles").innerHTML = "";

        textAreaABC.value = '';

        document.getElementById("abcPaper").style.paddingBottom = "0px";
        document.getElementById("abcPaper").style.overflow = "auto";

        for (let i = 0; i < tuneIDs.length; i++) {
            document.getElementById("gr" + tuneIDs[i]).style.backgroundColor = "";
        }
        tuneIDs = [];
    }

    let tuneIndex = '';
    
    function initialiseLunrSearch() {
        // create the searchTerm from the form data and reflect the values chosen in the form

        // Define the index terms for lunr search
        tuneIndex = lunr(function () {
            this.field("id");
            this.field("title", {
                boost: 10,
            });
            this.field("rhythm");
        });

        // Add the search items to the search index
        for (let key in window.store) {
            // Add the data to lunr
            tuneIndex.add({
                id: key,
                title: window.store[key].title,
                rhythm: window.store[key].rhythm,
            });
        }
    }

    function formSearch(formInputs) {
        const regex = /[A-Za-z]/g;
        let searchTerm = "";
        let searchResults = "";

        for (const formInput of formInputs) {
            if (formInput.match(regex)) {
                searchTerm += `${formInput} `;
            }
        }

        // Get results
        if (searchTerm) {
            searchResults = tuneIndex.search(searchTerm); // Get lunr to perform a search

            if (searchResults.length) {
                // sort the results
                searchResults.sort((a, b) => a.ref - b.ref);
                displaySetGrid(searchResults, window.store);
            } else {
                document.getElementById("tunesGrid").innerHTML = '';
                document.getElementById("tunesCount").innerHTML = 0;
            }
        } else {
            displaySetGrid(searchResults, window.store);
        }
        wssTools.disableSearchButton()
    }

    function formReset(formInputs) {
        let searchResults = '';
        
        for (const formInput of formInputs) {
            document.getElementById(formInput).value = '';
        }
        displaySetGrid(searchResults, window.store);
    }

    return {
        displaySetGrid: displaySetGrid,
        initialiseLunrSearch: initialiseLunrSearch,
        formSearch: formSearch,
        formReset: formReset,
        addABCtune: addABCtune,
        loadTextarea: loadTextarea,
        Reset: Reset,
    };

})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = buildSetGrid;
}