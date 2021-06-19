---
layout: page
title: Create MD File
permalink: /createMD/
---
<div class="container-createMD">
{% include createMD_options.html%}
</div>


<div id="mdModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content">
        <span class="close">×</span>
        <h2>Check the MD file details:</h2>
        <div class="container">
            <textarea id="mdTextArea" class="abcText" rows="20" spellcheck="false"></textarea>
            <!-- Allow the user to save their MD-->
            <span title="Download the MD data you've entered. Don't lose your work!">      
                <input value='Download MD' type='button' class="filterButton" onclick='wssTools.downloadFile(mdFileName, document.getElementById("mdTextArea").value)' />
            </span>
        </div>
    </div>
</div>

<script>
// Get the modal
let modal = document.getElementById("mdModal");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

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

// output file name - we'll set this later
let mdFileName = "";
</script>
