---
layout: null
---

# Session tunes

A collection of tunes for the Wellington Irish session.

## A static website

This is a static website that use Jekyll to process files and generate the
website. Each tune is included as a markdown file in the `_tunes` collection.
Tunes are organised into folders, according to the source of the audio, and
default licensing may be set for each folder in the `_config.yml` file.

An example of the front-matter for the Connachtman's Rambles, in the file
`comhaltas/connachtmans-rambles.md`, is given below. Supply similar information
to add new tunes to the collection. Put an MP3 file whose name is the same
as the title (including capitalisation) in the `mp3` folder in order for the 
audio to play.
```
---
title: "Connachtman's Rambles"
key: D
rythym: jig
mode: major
date: 2015-11-1
tags: beginner
mp3_url: https://comhaltas.ie/music/detail/connactmans_rambles/
abc_source: The Session
abc_url: https://thesession.org/tunes/19
abc: |
    X: 1
    M: 6/8
    L: 1/8
    K: Dmaj
    |:FAA dAA|BAA dAG|FAA dfe|dBB BAG|
    FAA dAA|BAA def|gfe dfe|1dBB BAG:|2 dBB B3||
    |:fbb faf|fed ede|fbb faf|fed e3|
    fbb faf|fed def|gfe dfe|1 dBB B3:|2 dBB BAG||

---
```

## Open source

This code open source (released under an [MIT licence](https://github.com/wellington-session/wellington-session.github.io/blob/master/LICENSE)). You are very welcome to copy the code and customise it for your own purposes. Get in touch with Edward Abraham ([edward@dragonfly.co.nz](mailto:edward@dragonfly.co.nz)) if you need a hand getting it set up.


## Developing

To develop the website, follow the instructions for [Jekyll](https://jekyllrb.com/).

If you are on a system with [Docker](https://www.docker.com/), you can get up and
running fast by changing into the root directory of the project and running the command:

```
docker run --rm --label=jekyll --volume=$(pwd):/srv/jekyll \
  -it -p 127.0.0.1:4000:4000 jekyll/jekyll jekyll serve
```

You should now be able to see a local version of the website by visiting `localhost:4000`
in your browser. Refresh the page to see the results of any changes you make.

Send us a pull request if you have any new features that you think we should include, or if you
have fixed any issues.

## Loading changes to live website

Once you've pushed updates to the **Branch: master** these changes need to be incorporated to the 
**Branch: gh-pages**.

Using the website <https://github.com/slow-session/wellingtonsession.org> you can issue a **Pull** request to get the changes from the **master** branch into the **gh-pages** branch.

  * Select the button **New pull request**
  * You should now see a screen headed **Compare changes**
  * Set *base:* to **gh-pages** and *compare:* to **master**
    * **Make sure you get these in the right order otherwise you'll downgrade the master branch to be the same as the gh-pages branch**
  * If you're happy that the changes should be committed to the live website, press **Create pull request**
    * You should see a message like: *asjl  wants to merge 1 commit into gh-pages from master*
  * Choose **Merge pull request** and then **Confirm Merge**
    * You should see a message like: *asjl  merged 1 commit into gh-pages from master 12 seconds ago*
  * Check the website <http://wellingtonsession.org/> to make sure the changes are correct.
  
    
