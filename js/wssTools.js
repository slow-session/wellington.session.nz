"use strict";

const wssTools = (function () {
    function downloadABCFile(text) {
        // set the filename for downloading
        let filename = slugify(getABCheaderValue("T:", text)) + ".abc";

        downloadFile(filename, text);
    }

    function downloadFile(filename, text) {
        let pom = document.createElement("a");
        pom.setAttribute(
            "href",
            "data:application/download;charset=utf-8," +
            encodeURIComponent(text)
        );
        pom.setAttribute("download", filename);

        if (document.createEvent) {
            let event = document.createEvent("MouseEvents");
            event.initEvent("click", true, true);
            pom.dispatchEvent(event);
        } else {
            pom.click();
        }
    }

    function slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "-") // Replace spaces with -
            .replace(/[^\w\-]+/g, "") // Remove all non-word chars
            .replace(/\-\-+/g, "-") // Replace multiple - with single -
            .replace(/^-+/, "") // Trim - from start of text
            .replace(/-+$/, ""); // Trim - from end of text
    }

    function getCheckedCheckboxesFor(checkboxName) {
        let checkboxes = document.querySelectorAll(
            'input[name="' + checkboxName + '"]:checked'
        );
        let values = [];
        Array.prototype.forEach.call(checkboxes, function (el) {
            values.push(el.value);
        });
        return values;
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function show_iframe(url) {
        // Add other sources as needed
        if (url.startsWith("https://www.youtube.com/")) {
            let myURL = url.replace("&t=", "?start=").split("v=")[1];

            return `<div class="container-iframe"><iframe class="responsive-iframe" aria-label="iframe showing youtube video" src="https://www.youtube.com/embed/${myURL}" frameborder="0" allowfullscreen></iframe></div>`;

        } else if (url.startsWith("https://www.facebook.com/")) {
            let myURL = encodeURI(url);

            return `<div class="container-iframe"><iframe class="responsive-iframe" aria-label="iframe showing facebook video" src="https://www.facebook.com/plugins/video.php?href=${myURL}&show_text=0&mute=0"  style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="false"></iframe></div>`;

        } else if (url.startsWith("https://vimeo.com/")) {
            let myURL = url.split("vimeo.com/")[1];

            return `<div class="container-iframe"><iframe class="responsive-iframe" aria-label="iframe showing vimeo video" src="https://player.vimeo.com/video/${myURL}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>`;
        } else if (url.startsWith("https://soundcloud.com/")) {
            let myURL = encodeURI(url);

            return `<div class="container-iframe"><iframe class="responsive-iframe" aria-label="iframe showing soundcloud video" src="https://w.soundcloud.com/player/?url=${myURL}&hide_related=true" width="100%"></iframe></div>`;

        } else if (url.startsWith("https://media.comhaltas.ie/video/")) {
            let myURL = encodeURI(url);

            return `<div class="container-iframe"><video class="responsive-iframe" aria-label="iframe showing comhaltas video" controls><source src="${myURL}" type="video/mp4"></video></div>`;

        } else {
            // Don't recognize this URL
            return "";
        }
    }

    function getABCheaderValue(key, tuneABC) {
        // Extract the value of one of the ABC keywords e.g. T: Out on the Ocean
        const KEYWORD_PATTERN = new RegExp(`^\\s*${key}`);

        const lines = tuneABC.split(/[\r\n]+/).map(line => line.trim());
        const keyIdx = lines.findIndex(line => line.match(KEYWORD_PATTERN));
        if (keyIdx < 0) {
            return '';
        } else {
            return lines[keyIdx].split(":")[1].trim();
        }
    }

    function enterSearch(searchBox, submitSearch) {
        let enterSearch = document.getElementById(searchBox);
        enterSearch.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById(submitSearch).click();
            }
        });
    }

    return {
        downloadABCFile: downloadABCFile,
        downloadFile: downloadFile,
        slugify: slugify,
        getCheckedCheckboxesFor: getCheckedCheckboxesFor,
        toTitleCase: toTitleCase,
        show_iframe: show_iframe,
        enterSearch: enterSearch,
    };
})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = wssTools;
}
