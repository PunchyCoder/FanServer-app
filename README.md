# FanServer-app
**Search a database of anime series titles/view trailers**

<br>

## Struggles
* Adding basic toggle funcion to syopsis-display on button click. The key was to use event.stopImmediatPropagation... google it.
* Looked all over for a way to make container grow to fit content; found width/height: fit-content; Simply amazing.
* Figured out the synopsis/trailer button event-logic was a pain. I wasn't referencing the right element in jQuery; code needs refinement.
* More struggles coming soon.

<br>

## Tasks
* ~~__Synopsis-button expands card & displays synopsis when clicked__~~
* ~~__Trailer button expands card & displays trailer when clicked__~~
* ~~__Trailer-button hides Synopsis and vise versa__~~
* ~~__Fetchs video forEach resulting title__~~
* If video/trailer not available => display error message => stand-in image?
* Limit synopsis verbosity? => add "read more" link/button. 
* Stuff...
* Add search by genre?
  * add input
  * add search param
  * find genre endpoint(s)
  * list genres searched 
  * display pills
  
<br>

### Notes
- It might be worthwhile to make a list of features/objectives to complete on here(README) and ~~cross em' off~~ as I develop.
- I'm beginning to kinda' enjoy the process of logging my struggles and at least part of my process. I may do something more in-depth.
