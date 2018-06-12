---
layout: page
title: Editing ABC
permalink: /editingABC/
---

A little about ABC musical notation
-------

ABC musical notation is a simple way to transcribe music to paper. A tune in ABC looks like this:

    X: 1
    T: Kilglass Lakes
    R: jig
    C: John McEvoy
    S: John McEvoy @ Ceol Aneas 2016
    M: 6/8
    L: 1/8
    K: Dmaj
    |:DED DFA|BAF d2e|faf ede|fdB AFE|
    DED DFA|BAF d2e|faf ede|1 fdd d3 :|2 fdd d2 e ||
    |:faa fbb|afe ~f3|faf dBA| (3Bcd B AFE|
    DED DFA|BAF d2e|faf ede|1 fdd d2 e :|2 fdd d2 D ||

The ABC tune can be “rendered” via software to produce standard sheet music:

![music-image](/images/kilglass-lakes.png "Image from ABC source")

The first 8 lines of the example is called the header, and consists of:

    X: - a number (usually used to sort the tunes)
    T: - the title of the tune
    R: - the rhythm (jig, reel, hornpipe, etc)
    C: - composer (not needed)
    S: - source of the tune (not needed)
    M: - meter (6/8, 4/4, etc)
    L: - length of each note in the ABC (1/8 means that each letter in the ABC
        has the value of 1/8 of a measure. For example: gabc = 4 eighth notes.
        a2bc = one quarter note and 2 eighth notes. a3c = a dotted quarter
        followed by an eighth note.)
    K: - The key (Dmaj is the same as D, however Dmin and Ddor mean different
        things)

After the last line of the header (K: should always be the last line of the header)
the musical notes start. The notes are:

![notes-image](/images/notes.png)

* Octave below Middle C = **C,** : Middle C = **C** : 3rd space C = **c** : highC = **c’**
* Bar lines are indicated by the symbol **\|**
* Repeat symbols are **\|:** and **:\|**
* Common ornamentations: **3(abc** or **a/b/c** indicates a triplet, **~a** indicates a roll

There are many more options and details about ABC, but that should get you started.
See <a href="http://trillian.mit.edu/~jc/music/abc/doc/ABCtutorial.html">
http://trillian.mit.edu/~jc/music/abc/doc/ABCtutorial.html</a> for a good resource.

Use <a href="/editABC/">editABC</a> to edit a tune.
---------------

When you first open the editABC page there is already a tune (Kilglass Lakes) in
the **Edit the ABC here:** box. If you click on a note in the music, the
corresponding symbol is highlighted in the ABC notation. You can edit the note
in the ABC, and the results will instantly be seen in the music.

<img src="/images/editABC.png" alt="editABC-image" style="border:1px solid black;">

If you want to write out a tune from scratch then it's probably a good idea to leave the
code for Kilglass Lakes in place and change it bit by bit.

If you delete the text in the **Edit the ABC here:** box then the musical notation
will disappear. If you now paste in some ABC for a tune that you've got from another
source such as <a href="https://thesession.org">The Session</a> the music notation will
appear on the left hand side of the page. You can then adjust any details that you want
to change.

You can use the audio player on the page to play back the tune to check your work.
You need to restart the player after you make changes to the ABC.

When you're happy that you've got your notation just right you can use the **Download ABC**
button to save your work to your device.

Edit an existing tune page
------------

You can also edit the ABC for an existing tune page if you want to help correct mistakes. Not all
our tunes have an ABC that matches the recorded version so your help would be appreciated.

We'll use the page for <a href="/tunes/virginia-reel">The Virginia Reel</a> as an example.
If you go to that page you'll see that part of the page looks like this:

<img src="/images/virginia.png" alt="virginia-image" style="border:1px solid black;">

If you click on the **Show ABC Source** button you should now see something like this:

<img src="/images/virginia-abc.png" alt="virginia-image" style="border:1px solid black;">

You can make changes to the ABC in the same way as in the previous section. Any changes
you make here will **NOT** change the website so don't be nervous about having a go.

When you're happy with your changes save them using the **Download ABC** button. We'd love
you to send your changes to us at <a href="mailto:{{ site.email }}">{{ site.email }}</a>.
We'll review them and almost certainly use them.
