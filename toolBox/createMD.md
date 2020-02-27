---
layout: page
title: Create MD File
permalink: /createMD/
---

<fieldset style="display: inline-block; vertical-align: middle;">
  <legend>Enter the MD file details:</legend>
  <div class="container">
  {% include createMD_options.html%}
  </div>
</fieldset>

<div class="row"></div>

<div id="mdModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content">
        <span class="close">×</span>
        <h2>Check the MD file details:</h2>
        <div class="container">
            <textarea id="md" rows="20" cols="58" style="background-color: #ebebeb" spellcheck="false"></textarea>
            <!-- Allow the user to save their MD-->
            <form>
                <span title="Download the MD data you've entered. Don't lose your work!">      
                    <input value='Download MD' type='button' class="filterButton"         onclick='downloadFile(document.getElementById("filename").value, document.getElementById("md").value)' />
                </span>
            </form>
        </div>
    </div>
</div>

<div class="row"></div>

<textarea id="filename" style="display:none;"></textarea>

<style type="text/css">
    .container {
        width: 500px;
        clear: both;
    }
    .container input {
        width: 100%;
        margin-bottom: 5px;
        clear: both;
    }
    .container input[type=checkbox] {
        width: 5%;
        margin-bottom: 5px;
        float: left;
        clear: right;
    }
    .container select {
        width: 100%;
        margin-bottom: 5px;
        clear: both;
    }

</style>

<script>
// Get the modal
var modal = document.getElementById("mdModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function showForm(textArea, myForm) {
    var elements = document.getElementById(myForm).elements;
    var obj = {};
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var locationNotProcessed = 1;

    // Display the output in the modal area
    modal.style.display = "block";

    document.getElementById(textArea).innerHTML = '---\n';
    for(var i = 0 ; i < elements.length ; i++){
        var item = elements.item(i);

        if (item.value == "Show MD File") {
            continue;
        }
        switch(item.name) {
            case 'titleID':
                obj[item.name] = slugify(obj["title"]) + '.md';
                break;
            case 'key':
                obj[item.name] = toTitleCase(item.value);
                break;
            case 'location':
                if (locationNotProcessed) {
                    obj[item.name] = '';
                    var locationString = '';
                    var locationArray = getCheckedCheckboxesFor(item.name);
                    for (var j = 0; j < locationArray.length; j++) {   
                        locationString += locationArray[j] + ' ';
                    }
                    if (locationString) {
                        obj[item.name] = locationString;
                    }
                    locationNotProcessed = 0;
                } else {
                    continue;
                }
                break;
            case 'date':
                obj[item.name] = year + '-' + (month<=9 ? '0' + month : month) + '-' + (day <= 9 ? '0' + day : day)
                break;
            case 'mp3_file':
                if (item.value == 'yes') {
                    obj[item.name] = '/mp3/' + slugify(obj["title"]) + '.mp3';
                } else {
                    obj[item.name] = '';
                }
                break;
            case 'abc':
                var lines = item.value.split('\n');
                obj[item.name] = '|\n';
                for (var j = 0; j < lines.length; j++) {
                    // Get key from ABC here!!
                    if(lines[j].includes("K:", 0)) {
                        abckey = lines[j].split(':')[1].trim();
                        if (obj['key'] != abckey) {
                            alert('md key: ' + obj['key'] + ' != abc key: ' + abckey);
                        }
                    }
                    obj[item.name] += '    ' + lines[j].replace(/^\s*/, '') + '\n';
                }
                break;
            default:
                obj[item.name] = item.value;
        }
        document.getElementById(textArea).innerHTML += item.name + ': ' + obj[item.name] + '\n';
    }
    document.getElementById(textArea).innerHTML += '---\n';

    // Set the filename for downloading
    document.getElementById("filename").innerHTML = slugify(obj["title"]) + '.md'
}
</script>
