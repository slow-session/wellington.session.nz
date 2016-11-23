---
layout: null
---

There is one file that need to be added to the system to add a new tune.

   1) The template file (.md) which is added to the **\_tunes** (or one 
   of its subdirectories). At present, we're adding tunes to the 
   **\_tunes/comhaltas** directory but that may change in future if we
   source sound files from other locations.
  
  
We’ll work through an example using a tune called **Silver Spear**
sourced from Wellington. 

Copy the file **\_tunes/comhaltas/silver-spear.md** from the git
repository for session.nz to the corresponding directory in the git
archive for wellington.session.nz e.g.

    ---
    cd wellington.session.nz
    cp ../session.nz/_tunes/comhaltas/silver-spear.md _tunes/comhaltas/silver-spear.md
    ---
   
Save this file to the main site using git commit and git push and check the index
page to look for the new tune.


   
