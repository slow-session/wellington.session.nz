---
layout: null
---

Session tunes
=============

A collection of tunes for the Wellington Irish session.

A static website
----------------

This is a static website that use Jekyll to process files and generate the
website. Each tune is included as a markdown file in the `_tunes` collection.

An example of the front-matter for Flooded Road to Glenties, in the file
`_tunes/flooded-road-to-glenties.md`, is given below:

```
---
title: Flooded Road to Glenties
titleID:    a
key: Bdor
rhythm: reel
mode:
date: 2017-01-12
location: Arrowtown Wellington
notes:
tags: slowsession
regtuneoftheweek:
slowtuneoftheweek: 2017-01-18
mp3_file: /mp3/flooded-road-to-glenties.mp3
mp3_licence: "© Fergal Scahill. All Rights Reserved."
mp3_source: <a href="https://www.facebook.com/FergalScahillMusic/">Fergal Scahill</a>, member of <a href="http://www.webanjo3.com/">We Banjo 3</a>
mp3_url: https://www.facebook.com/video/video.php?v=1189223307840669
alt_mp3_url: https://www.youtube.com/watch?v=zdqWfnJhmgY
source: Wellington
abc_source: The Session
abc_url: https://thesession.org/tunes/3440
abc: |
    X: 1
    T: The Flooded Road To Glenties
    R: reel
    M: 4/4
    L: 1/8
    K: Bdor
    |:A|FB~B2 cfec|Bcec BAFE|FB~B2 ceaf|gfeg ~f3e|
    fafe cfec|~B3A Bcfg|af~f2 fecB|cfec ~B3:|
    |:c|dB~B2 aBgB|fB~B2 ceAc|dB~B2 abaf|gfeg ~f3e|
    fafe Bcec|~B3A Bcef|a3b~f3 f|ecAc ~B3:|
---
```

Use the webpage:

 * <https://wellington.session.nz/createMD>

to supply similar information to add new tunes to the collection. Put an MP3
file that matches the one generated by the script in the `mp3` folder in order
for the audio to play.

Loading changes to live website
-------------------------------

Once you've pushed updates to the **Branch: master** these changes need to be incorporated to the
**Branch: gh-pages**.

Using the website:

 * <https://github.com/slow-session/wellington.session.nz>

 you can issue a **Pull** request to get the changes from the **master** branch into the **gh-pages** branch.

  * Select the button **New pull request**
  * You should now see a screen headed **Compare changes**
  * Set *base:* to **gh-pages** and *compare:* to **master**
    * **Make sure you get these in the right order otherwise you'll downgrade the master branch to be the same as the gh-pages branch**
  * If you're happy that the changes should be committed to the live website, press **Create pull request**
    * You should see a message like: *asjl  wants to merge 1 commit into gh-pages from master*
  * Choose **Merge pull request** and then **Confirm Merge**
    * You should see a message like: *asjl  merged 1 commit into gh-pages from master 12 seconds ago*
  * Check the website <https://wellington.session.nz/> to make sure the changes are correct.

Open source
-----------

This code open source (released under the licence at:

 * <https://github.com/slow-session/wellington.session.nz/blob/master/LICENSE>

You are very welcome to copy the code and customise it for your own purposes.
