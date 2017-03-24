// jquery on press - OK
// Raindrop
//Create Image Generator
//collision detection
// mouse
// animate images

$(document).ready(function () {
  var canvasTag = $('#gameCanvas')[0]
  var ctx = canvasTag.getContext("2d")

  var characterSizePercent = 0.11
  var characterPosYOffsetPercent = 0.97
  var characterWidth = characterSizePercent * canvasTag.width
  var characterHeight = characterWidth
  var characterPosX = (canvasTag.width - characterWidth) / 2
  var characterPosY = characterPosYOffsetPercent * canvasTag.height - characterHeight

  var rightPressed = false;
  var leftPressed = false;

  $(document).on('keydown', function (e) {
    if(e.keyCode == 39) {
      rightPressed = true
    }
    else if(e.keyCode == 37) {
      leftPressed = true
    }
  })
  $(document).on('keyup', function (e) {
    if(e.keyCode == 39) {
      rightPressed = false
    }
    else if(e.keyCode == 37) {
      leftPressed = false
    }
  })

  // function Character() {
  //
  // }
  //
  // Character.prototype.checkMovement = function () {
  //
  // }

  function drawCharacter() {
    // ctx.beginPath();
    var character = new Image();
    character.src = 'assets/img/cat.gif';
    ctx.drawImage(character, characterPosX, characterPosY, characterWidth, characterHeight);
    // ctx.closePath();
  }

  function drawBackground() {
    // ctx.beginPath();
    var background = new Image();
    background.src = 'assets/img/background.jpg';
    ctx.drawImage(background, 0, 0, canvasTag.width, canvasTag.height);
    // ctx.closePath();
  }

  function resize() {
    $('#gameCanvas')[0].width = window.innerWidth
    $('#gameCanvas')[0].height = window.innerHeight
    characterWidth = characterSizePercent * canvasTag.width
    characterHeight = characterWidth
    characterPosY = characterPosYOffsetPercent * canvasTag.height - characterHeight
  }

  function draw() {
    ctx.clearRect(0, 0, canvasTag.width, canvasTag.height)
    resize()
    drawBackground()
    drawCharacter()

    if(rightPressed && characterPosX < canvasTag.width - characterWidth) {
      characterPosX += 3;
    }
    else if(leftPressed && characterPosX > 0) {
      characterPosX -= 3;
    }
  }
  setInterval(draw,10)
})
