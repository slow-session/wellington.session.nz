"use strict";

function printDiv(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
}

function downloadFile(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute(
        'href',
        'data:application/download;charset=utf-8,' + encodeURIComponent(text)
    );
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

function getABCtitle(tuneStr) {
    var title = '';
    var lines = tuneStr.split("\n");
    var i;

    for (i = 0; i < lines.length; i += 1) {
        if (lines[i].match(/^T:/)) {
            title = lines[i].replace(/T:\s?/, '');
            break;
        }
    }
    return title;
}

function getCheckedCheckboxesFor(checkboxName) {
    var checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked');
    var values = [];
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

function enable_button() {
    submit_button.disabled = false;
    submit_button.style.opacity=1.0;
    submit_button.style.cursor='pointer';
}
