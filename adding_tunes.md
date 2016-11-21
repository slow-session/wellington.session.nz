---
layout: null
---

There are two files that need to be added to the system to add a new tune.

  1) The sound file (.mp3) which is added to the **mp3** directory.

  2) The template file (.md) which is added to the **\_tunes** (or one of its subdirectories). At present, we're adding tunes to the **\_tunes/comhaltas** directory but that may change in future if we source sound files from other locations.
  
  The template looks like this:

    ---
    title: 
    key: 
    rhythm: 
    mode: 
    date: 2016-5-11
    tags: new
    mp3_file: 
    mp3_url: https://comhaltas.ie/music/detail/XXXXX/ 
    abc_source: The Session
    abc_url: https://thesession.org/tunes/NNN
    abc: |
    
    ---
  
  We'll work through an example using a tune called **Silver Spear**.
  
Our first action is to load **silver-spear.mp3** to the **mp3** directory. You can test that using the URL:

    http://localhost:4000/mp3/silver-spear.mp3
    
Then we create a file called **\_tunes/comhaltas/silver-spear.md** and load the contents of the above template into it using your favourite editor.

    ---
    title: Silver Spear
    key: 
    rhythm: 
    mode: 
    date: 2016-5-12
    tags: new
    mp3_file: /mp3/silver-spear.mp3
    mp3_url: https://comhaltas.ie/music/detail/XXXXX/ 
    abc_source: The Session
    abc_url: https://thesession.org/tunes/NNN
    abc: |
    
    ---

The **mp3\_file:** tag should point to the **mp3** file - the **mp3** filename and the **md** filenames should **match**

Set the **date:** field to today's date.

Next we'll add the **abc** data from The Session website. In your browser go to:

    https://thesession.org/tunes

and use the Search box to find **Silver Spear**. In many cases there may be several variations of the ABC notation for the tune. Try to choose the one that matches the recording (or if you don't read ABC or the dots, pick the first one!). Cut and paste the ABC into the .md file - **be careful to use spaces and not tabs to indent the data**.

You can get several other bits of information from here as well. 

  * The **NNN** value for the abc\_url: field
  * The key:, mode: and rhythm: fields
  
  The ABC data should be well formed.  The player we are using is quite rudimentary.
  Known limitations:    grace notes are ignored
                        if there are pick-up notes there should be no bar line preceding them
                        if there are no pick-up notes the tune should start with a bar line
                        very few ornaments are played
  
The .md file should now look like:
    
![abc2.png missing](/images/abc1.png)

Finally we need to complete the **XXXXX** section of the **mp3\_url:** field. Go to the Comhaltas web site:

    https://comhaltas.ie

and search for **Silver Spear**.

You may have to scroll down the results to find the reference you're looking for e.g.

    https://comhaltas.ie/music/detail/silver_spear/
    
Finally, our .md file should look like:

![abc2.png missing](/images/abc2.png)

Save this file to the main site using git commit and git push and check the index page to look for the new tune.


   