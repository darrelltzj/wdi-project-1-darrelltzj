// jquery on press - OK
// Raindrop
//collision detection
//Create Image Generator / movement - invert when left
// animate images
//event listener for resize
//pause
// mouse
//initialize

$(document).ready(function () {
  var canvasTag = $('#gameCanvas')[0]
  var ctx = canvasTag.getContext("2d")
  $('#gameCanvas')[0].width = window.innerWidth
  $('#gameCanvas')[0].height = window.innerHeight

  var cat = new Character(0.11, 0.97, 3)

  function Character(sizePercent, posYOffsetPercent, speed) {
    this.sizePercent = sizePercent
    this.posYOffsetPercent = posYOffsetPercent
    this.width = this.sizePercent * canvasTag.width
    this.height = this.width //need to adjust to % of canvas
    this.posX = (canvasTag.width - this.width) / 2
    this.posY = this.posYOffsetPercent * canvasTag.height - this.height
    this.speed = speed
    this.rightPressed = false;
    this.leftPressed = false;
  }

  Character.prototype.control = function () {

    $(document).on('keydown', function (e) {
      if(e.keyCode == 39) {
        this.rightPressed = true
      }
      else if(e.keyCode == 37) {
        this.leftPressed = true
      }
    }.bind(this))

    $(document).on('keyup', function (e) {
      if(e.keyCode == 39) {
        this.rightPressed = false
      }
      else if(e.keyCode == 37) {
        this.leftPressed = false
      }
    }.bind(this))

    if(this.rightPressed && this.posX < canvasTag.width - this.width) {
      this.posX += this.speed
    }
    else if(this.leftPressed && this.posX > 0) {
      this.posX -= this.speed
    }
  }

  Character.prototype.resize = function () {
    this.width = this.sizePercent * canvasTag.width
    this.height = this.width //need to adjust to % of canvas
    // this.posX = (canvasTag.width - this.width) / 2
    this.posY = this.posYOffsetPercent * canvasTag.height - this.height
  }

  function drawCat() {
    // ctx.beginPath();
    var catImage = new Image();
    catImage.src = 'assets/img/bunny.gif';
    ctx.drawImage(catImage, cat.posX, cat.posY, cat.width, cat.height);
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
    cat.resize()
  }

  function run() {
    ctx.clearRect(0, 0, canvasTag.width, canvasTag.height)
    // resize() // use listener
    drawBackground()
    drawCat()
    cat.control()

  }
  setInterval(run,10)
})
