"use strict";

function downloadABCFile(text) {
  // set the filename for downloading
  let filename = slugify(getABCheaderValue("T:", text)) + ".abc";

  downloadFile(filename, text);
}

function downloadFile(filename, text) {
  var pom = document.createElement("a");
  pom.setAttribute(
    "href",
    "data:application/download;charset=utf-8," + encodeURIComponent(text)
  );
  pom.setAttribute("download", filename);

  if (document.createEvent) {
    var event = document.createEvent("MouseEvents");
    event.initEvent("click", true, true);
    pom.dispatchEvent(event);
  } else {
    pom.click();
  }
}

function printDotsImage(svg) {
  if (testForMobile()) {
    alert("Sorry, printing not working from mobile devices");
  } else {
    $(svg).printThis();
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
  var checkboxes = document.querySelectorAll(
    'input[name="' + checkboxName + '"]:checked'
  );
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
  submit_button.style.opacity = 1.0;
  submit_button.style.cursor = "pointer";
}

function show_iframe(url) {
  // Add other sources as needed
  if (url.startsWith("https://www.youtube.com/")) {
    url = url.replace("&t=", "?start=");
    document.write(
      '<div class="container-iframe"><iframe   class="responsive-iframe" src="https://www.youtube.com/embed/' +
        url.split("v=")[1] +
        '" frameborder="0" allowfullscreen></iframe></div>'
    );
  } else if (url.startsWith("https://www.facebook.com/")) {
    document.write(
      '<div class="container-iframe"><iframe   class="responsive-iframe" src="https://www.facebook.com/plugins/video.php?href=' +
        encodeURI(url) +
        '&show_text=0&mute=0"  style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="false"></iframe></div>'
    );
  } else if (url.startsWith("https://vimeo.com/")) {
    document.write(
      '<div class="container-iframe"><iframe   class="responsive-iframe" src="https://player.vimeo.com/video/' +
        url.split("vimeo.com/")[1] +
        '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>'
    );
  } else if (url.startsWith("https://soundcloud.com/")) {
    document.write(
      '<div class="container-iframe"><iframe   class="responsive-iframe" src="https://w.soundcloud.com/player/?url=' +
        encodeURI(url) +
        '&hide_related=true" width="100%"></iframe></div>'
    );
  } else if (url.startsWith("https://media.comhaltas.ie/video/")) {
    document.write(
      '<div class="container-iframe"><video class="responsive-iframe" controls><source src="' +
        encodeURI(url) +
        '" type="video/mp4"></video></div>'
    );
  }
}
