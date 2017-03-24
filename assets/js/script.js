// jquery on press - OK
// Raindrop
//Create Image Generator
//collision detection
// mouse

$(document).ready(function () {
  var canvasTag = $('#gameCanvas')[0]
  var ctx = canvasTag.getContext("2d")

  var characterWidth = 70
  var characterHeight = 70
  var characterPosX = (canvasTag.width - characterWidth) / 2
  var characterPosY = canvasTag.height - characterHeight

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

  function drawCharacter() {
    // ctx.beginPath();
    var character = new Image();
    character.src = "assets/img/bettle-crawling.gif";
    ctx.drawImage(character, characterPosX, characterPosY, characterWidth, characterHeight);
    // ctx.closePath();
  }

  function draw() {
    ctx.clearRect(0, 0, canvasTag.width, canvasTag.height)
    drawCharacter()
    if(rightPressed && characterPosX < canvasTag.width - characterWidth) {
      characterPosX += 7;
    }
    else if(leftPressed && characterPosX > 0) {
      characterPosX -= 7;
    }
  }

  setInterval(draw,10)
})
