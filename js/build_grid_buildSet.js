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

    for (i = 0; i < tuneIDs.length; i++) {
        document.getElementById("gr" + tuneIDs[i]).style.backgroundColor = "";
    }
    tuneIDs = [];
}

(function () {
    function displayTunesGrid(results, store) {
        let tunesGrid = document.getElementById("tunesGrid");
        let tunesCount = document.getElementById("tunesCount");
        let tunesCounter = 0;
        let appendString = '';

        // create table headers
        if (wssTools.testForMobile()) {
            appendString =
                '<div id="tunes" class="tunes3columnLayout mobileScrolling">';
        } else {
            appendString = '<div id="tunes" class="tunes3columnLayout">';
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

        appendString += "</div>";
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
            '<span><input type="button" class="filterButton" onclick="addABCtune(' +
            item.tuneID +
            ')" value="Select"></span>';
        gridRow += "<span>" + item.key + " " + item.rhythm + "</span>";

        return gridRow;
    }

    function getQueryVariable(variable) {
        let query = window.location.search.substring(1);
        let vars = query.split("&");

        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");

            if (pair[0] === variable) {
                return decodeURIComponent(pair[1].replace(/\+/g, "%20"));
            }
        }
    }

    // create the searchTerm from the form data and reflect the values chosen in the form
    let searchTerm = "";
    let title = getQueryVariable("title");
    if (title) {
        searchTerm = title + " ";
        document.getElementById("title-box").setAttribute("value", title);
    }
    let rhythm = getQueryVariable("rhythm");
    if (rhythm) {
        searchTerm += rhythm + " ";
        let e = document.getElementById("rhythm-box");
        if (e) {
            e.value = rhythm;
        }
    }

    // Define the index terms for lunr search
    let tuneIndex = lunr(function () {
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

    // Get results
    if (searchTerm) {
        // Get lunr to perform a search
        let results = tuneIndex.search(searchTerm);

        // sort the results
        results.sort((a, b) => a.ref - b.ref);

        if (results.length) {
            displayTunesGrid(results, window.store);
        } else {
            document.getElementById("tunesCount").innerHTML = 0;
        }
    } else {
        displayTunesGrid("", window.store);
    }
    return false;
})();