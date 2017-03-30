# Avoid the Raindrops
**Avoid the Raindrops** is a game developed at General Assembly's Web Development Immersive (WDI) Course. Black the cat dislikes the rain. In the game, each player controls their version of Black the cat by maneuvering it along the screen's x-axis. Each cat has nine lives and loses one whenever it comes into contact with a rain droplet. As the game progresses, the frequency of the raindrops increases. The aim is for each player to last the longest. The game ends when the winning player loses all its lives.

*Avoid the Raindrops requires a physical keyboard and is best played on Chrome Version 56 or later.*

## How to play
The instructions below explain how the game can be controlled and played.

### Key Control Summary
| Key           | Function      |
| ------------- |:-------------:|
| Escape        | Reload / Restart|
| Space         | Proceed / Pause |
| m             | Mute / Unmute   |
| Up Arrow      | Player 1 Select|
| Left Arrow    | Player 1 Left  |
| Down Arrow    | Player 1 Select|
| Right Arrow   | Player 1 Right |
| w             | Player 2 Select|
| a             | Player 2 Left  |
| s             | Player 2 Select|
| d             | Player 2 Right |

### Player Selection
The game starts off at the player control selection page and can be played with either one or between two players. Use the *Left* and *Right* arrows or the *a* and *d* keys to toggle between single and double players.

Players can use either the mouse or the keyboard to control their cats. Only one player can select the mouse. Users may use the *Up* and *Down* arrows and the *w* and *s* keys to select their preferred controls.

Once players are comfortable with their control selections, they may press *Space* to begin the game.

### Controlling Black the Cat
The cat for player 1 starts on the right while the cat for player 2 starts on the left.

Keyboard Controls:
Player 1 uses the *Left* and *Right* arrows while player 2 uses the *a* and *d* keys to maneuver the cat left and right respectively.

Mouse Control:
If the mouse control was selected, shifting the cursor to either side of the cat would move it towards the respective directions. Placing the cursor within the cat's width would cause the cat to be stationary.

## About the Code

### Built With
[HTML Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) and [jQuery](https://jquery.com/) Application programming interface (API).

### Flow Chart


### Character Animation
The initial plan was to use this gif to simulate the cat running.
![Cat Gif](http://rs1366.pbsrc.com/albums/r779/mariperquinto/0550661001369318673_zpsc3a722ef.gif~c200)

However, as HTML Canvas API was used in the making of the game, the canvas has to be cleared each time to remove and replace the previous positions of the characters and raindrops. The cat gif thus remains stationary like this:

![Stationary cat](http://i.imgur.com/IK7Vw7H.png)

To work around this, the cat gif layers were separated.

![0](http://i.imgur.com/IK7Vw7H.png)
![1](http://i.imgur.com/IK7Vw7H.png)
![2](http://i.imgur.com/aDt2t02.png)
![3](http://i.imgur.com/OYO7J6R.png)
![4](http://i.imgur.com/RLy5z6y.png)
![5](http://i.imgur.com/uRbDIfe.png)
![6](http://i.imgur.com/NAs7ws1.png)
![7](http://i.imgur.com/0cIhzMR.png)

The code to control the cat's frame lies in the Character prototype *animateFrame*. Here is how it looks like:
```
Character.prototype.animateFrame = function () {
  if (this.frameChangeDelay === 0) {
    if (this.selectedFrame === this.frameLength - 1) {
      this.selectedFrame = 0
    }
    else {
      this.selectedFrame++
    }
    this.frameChangeDelay = Math.floor(24 / this.frameLength)
  }
  else {
    this.frameChangeDelay--
  }
}
```
What this function does is that it selects each cat's image which would later be checked in the *createFrame* function. Each time this function is called, it changes the image. When it reaches the last image, it returns to the first image. A delay was later added to prevent the image from changing too fast.

The delay was experimented around and 

The delay is estimated to be around 0.05 seconds for this set


Math.floor(24 / this.frameLength) - 3 units

[requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) ~ 1/60 seconds

### Raindrops Animation

### Collision Detection

### User Interface
Pause feature
blur change tab Listener

## Authors

## References
* Canvas API, Collision detection and the left and right movement of the cat were referenced from https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript

* *function twoDigit()* for the timer on script.js was referenced from http://stackoverflow.com/questions/5774042/format-a-number-exactly-two-in-length

## Credits
This project is purely for educational purposes. It would not have been made possible without the following sources.

Images
- White Brick Wall by Josh Hahn from http://6iee.com/332876.html
- Running Cat from http://media.photobucket.com/
- Raindrop outline shape by Esteban Oliva from http://freevector.co/vector-icons/weather/raindrop-outlined-shape.html
- Splat by Clker-Free-Vector-Images from https://pixabay.com/en/splat-black-splatter-splash-ink-311428/
- Squash player by Creative Stall from the Noun Project
- Tennis Player Vector Icon by ProSymbols from the Noun Project
- Arrow by Numero Uno from the Noun Project
- Keyboard by Paul te Kortschot from the Noun Project
- WASD key from http://labs.minutelabs.io/Relativistic-Space-Sheep/
- Mouse by Anton Håkanson from the Noun Project
- mute volume by Ján Slobodník from the Noun Project

Audio
- River Flows in You by Yiruma from https://www.youtube.com/watch?v=rrDoJ8Dk-oQ
- Rain Sound by Relax With Nature from https://www.youtube.com/watch?v=GlO3MdKTpd4
- Blop by Mark DiAngelo from http://soundbible.com/2067-Blop.html
- Cat sound effect - meow by Winry Marini from https://www.youtube.com/watch?v=HIdLXBn-Py0

==============================================================

[How to write readme - Markdown CheatSheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)  
[How to write a good readme for github repo!](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
