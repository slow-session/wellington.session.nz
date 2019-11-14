---
layout: page
title: Soundfont
permalink: /soundfont/
---

<script src="/js/soundfont-player.min.js"></script>

<script>
Soundfont.instrument(new AudioContext(), 'fiddle').then(function (instrument) {
    instrument.play('C4');
    instrument.play('E4');
    instrument.play('G4');

})
</script>
