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
    let tuneIDs = [];

    function displayBuildSet(results, store) {
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

                if (item.abc) {
                    appendString += `<span id="gr${item.tuneID}"><a href="${item.url}">${item.title}</a></span>
                    <span><input type="button" class="filterButton" onclick="buildSetGrid.addABCtune(${item.tuneID})" value="Select"></span>
                    <span>${item.key} ${item.rhythm}</span>`;
                    tunesCounter++;
                }
            }
        } else {
            for (let key in store) {
                // Iterate over the original data
                let item = store[key];
                if (item.abc) {
                    appendString += `<span id="gr${item.tuneID}"><a href="${item.url}">${item.title}</a></span>
                    <span><input type="button" class="filterButton" onclick="buildSetGrid.addABCtune(${item.tuneID})" value="Select"></span>
                    <span>${item.key} ${item.rhythm}</span>`;
                    tunesCounter++;
                }
            }
        }

        tunesGrid.innerHTML = appendString;
        tunesCount.innerHTML = tunesCounter;
    }

    function displayHistoricSet(results, setStore) {
        let setsTable = document.getElementById("tunesGrid");
        let setsCount = document.getElementById("tunesCount");
        let setsCounter = 0;
        let appendString = '';

        // Find the tuneIDs that correspond to each set
        mapSetToTuneIDs();

        // create div for tunes grid
        tunesGrid.classList.add("tunes3columnLayout");

        if (results.length) {
            // Are there any results?
            for (let i = 0; i < results.length; i++) {
                // Iterate over the results
                let item = setStore[results[i].ref];
                appendString += createHistoricSetRow(item);
                setsCounter++;
            }
        } else {
            for (let key in setStore) {
                // Iterate over the original data
                let item = setStore[key];
                appendString += createHistoricSetRow(item);
                setsCounter++;
            }
        }
        appendString += "</div>";
        setsTable.innerHTML = appendString;
        setsCount.innerHTML = setsCounter;
    }

    function createHistoricSetRow(item) {
        let gridRow = "";
        let setID = "ABC" + item.setID;
        let tuneIDs = item.tuneIDs.split(",");

        // build the first three columns
        gridRow +=
            '<span title="Set played in: ' +
            item.location +
            '">';
        gridRow += '<a href="' + item.url + '">' + item.title + '</a>';
        gridRow += '&nbsp;(' + item.rhythm + ')';
        gridRow += '</span>';
        gridRow += '<span class="setRow">';
        for (let i = 0; i < tuneIDs.length; i++) {
            let url = window.store[tuneIDs[i]].url;
            let title = window.store[tuneIDs[i]].title;
            let key = window.store[tuneIDs[i]].key;

            gridRow += '<div>';
            gridRow += '<a href="' + url + '">' + title + " (" + key + ")</a>";
            gridRow += "</div>";
        }
        gridRow += "</span>";
        gridRow += '<span class="setRow">';
        for (let i = 0; i < tuneIDs.length; i++) {
            let tuneID = tuneIDs[i];

            gridRow +=
                '<input class="filterButton setChild" type="button" onclick="audioPlayer.selectTune(store,' +
                tuneID +
                ');" value="Play Now" />';
        }
        gridRow += "</span>";

        return gridRow;
    }

    function mapSetToTuneIDs() {
        for (let setKey in setStore) {
            // only do this mapping once
            if (!setStore[setKey].tuneIDs) {
                let setTunes = setStore[setKey].setTunes;
                for (let i = 0; i < setTunes.length; i++) {
                    for (let tuneKey in store) {
                        let tune = store[tuneKey];
                        if (setTunes[i] == tune.tuneID) {
                            setStore[setKey].tuneIDs += tuneKey + ",";
                        }
                    }
                }
                // Strip off trailing ','
                setStore[setKey].tuneIDs = setStore[setKey].tuneIDs.slice(0, -1);
            }
        }
    }

    function addABCtune(tuneID) {
        let item = store[tuneID];

        document.getElementById("setTuneTitles").innerHTML += item.title + "<br />";
        document.getElementById("setTuneTitles").style.backgroundColor = "khaki";
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

    function newSet() {
        document.getElementById("paperHeader").style.display = "inline";
        document.getElementById("setTuneTitles").innerHTML = "";
        document.getElementById("setTuneTitles").style.backgroundColor = "";


        textAreaABC.value = '';

        document.getElementById("abcPaper").style.paddingBottom = "0px";
        document.getElementById("abcPaper").style.overflow = "auto";

        for (let i = 0; i < tuneIDs.length; i++) {
            document.getElementById("gr" + tuneIDs[i]).style.backgroundColor = "";
        }
        tuneIDs = [];
    }

    let tuneIndex = '';

    function initialiseLunrSearch(store) {
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
        for (let key in store) {
            // Add the data to lunr
            tuneIndex.add({
                id: key,
                title: store[key].title,
                rhythm: store[key].rhythm,
            });
        }
    }


    function displaySetGrid(setType, searchResults, store) {

        switch (setType) {
            case 'historic':
                displayHistoricSet(searchResults, store);
                break;
            default:
                displayBuildSet(searchResults, store);
        }
    }

    function formSearch(setType, searchTerm, store) {
        let searchResults = "";

        // Get results
        if (searchTerm) {
            searchResults = tuneIndex.search(searchTerm); // Get lunr to perform a search

            if (searchResults.length) {
                // sort the results
                searchResults.sort((a, b) => a.ref - b.ref);
                displaySetGrid(setType, searchResults, store);
            } else {
                document.getElementById("tunesGrid").innerHTML = '';
                document.getElementById("tunesCount").innerHTML = 0;
            }
        } else {
            displaySetGrid(setType, searchResults, store);
        }

    }

    function formReset(setType, formInput, store) {
        let searchResults = '';

        document.getElementById(formInput).value = '';
        displaySetGrid(setType, searchResults, store);
    }

    return {
        displaySetGrid: displaySetGrid,
        initialiseLunrSearch: initialiseLunrSearch,
        formSearch: formSearch,
        formReset: formReset,
        addABCtune: addABCtune,
        loadTextarea: loadTextarea,
        newSet: newSet,
    };

})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = buildSetGrid;
}
