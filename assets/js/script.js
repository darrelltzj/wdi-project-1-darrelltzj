// jquery on press - OK
// Raindrop
// collision detection
// Create Image Generator / movement - invert when left
// animate images
// timer / end game
// event listener for resize
// pause
// mouse
// initialize
// mouse

$(document).ready(function () {
  var canvasTag = $('#gameCanvas')[0]
  var ctx = canvasTag.getContext("2d")

  $('#gameCanvas')[0].width = window.innerWidth
  $('#gameCanvas')[0].height = window.innerHeight

  var background = {
    width: canvasTag.width,
    height: canvasTag.height,
    posX: 0,
    posY: 0,
    frames: ['background.jpg'],
    selectedFrame: 0,
  }

  var catFrames = [
    'bunny.gif',
    'cat.gif',
    'bettle.gif',
    'splat.png'
  ]
  var cat = new Character(0.11, 0.97, catFrames, 2, 3)

  var raindropsArr = []
  function spawnRaindrops () {
    if (raindropsArr.length <= 7) {
      this.raindrop = new Raindrops
      raindropsArr.push(this.raindrop)
    }
  }
  function Raindrops () {
    this.sizePercent = 0.01
    this.width = this.sizePercent * canvasTag.width
    this.height = this.width
    this.posX = this.randomX()
    this.posY = this.height
    this.frames = ['raindrop.png', 'splash.png', 'splat.png']
    this.selectedFrame = 0
    this.velocity = 0
    this.gravity = 0.1
  }
  Raindrops.prototype.randomX = function () {
    return Math.round(Math.random() * canvasTag.width)
  }
  Raindrops.prototype.move = function () {
    this.posY += this.velocity
    this.velocity += this.gravity
  }

  function Character(sizePercent, posYOffsetPercent, frames, reverseFrameIndex, velocity) {
    this.sizePercent = sizePercent
    this.posYOffsetPercent = posYOffsetPercent

    this.width = this.sizePercent * canvasTag.width
    this.height = this.width //need to adjust to % of canvas
    this.posX = (canvasTag.width - this.width) / 2
    this.posY = this.posYOffsetPercent * canvasTag.height - this.height
    this.frames = frames
    this.selectedFrame = 0
    this.reverseFrameIndex = reverseFrameIndex

    this.faceRight = true
    this.velocity = velocity

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

    this.move()
  }
  Character.prototype.move = function () {
    if(this.rightPressed && this.posX < canvasTag.width - this.width) {
      this.posX += this.velocity
      this.faceRight = true
      this.changeFrame()
    }

    else if(this.leftPressed && this.posX > 0) {
      this.posX -= this.velocity
      this.faceRight = false
      this.changeFrame()
    }
  }
  Character.prototype.changeFrame = function () {
    if (this.faceRight) {
      if (this.selectedFrame === 1 || this.selectedFrame >= this.reverseFrameIndex) {
        this.selectedFrame = 0
      }
      else {
        this.selectedFrame += 1
      }
    }
    else {
      if (this.selectedFrame === this.frames.length - 1 || this.selectedFrame <= this.reverseFrameIndex - 1) {
        this.selectedFrame = 2
      }
      else {
        this.selectedFrame += 1
      }
    }
  }
  Character.prototype.resize = function () {
    this.width = this.sizePercent * canvasTag.width
    this.height = this.width //need to adjust to % of canvas
    // this.posX = (canvasTag.width - this.width) / 2
    this.posY = this.posYOffsetPercent * canvasTag.height - this.height
  }

  function createFrame(item) {
    this.image = new Image()
    this.image.src = 'assets/img/' + item.frames[item.selectedFrame]
    ctx.drawImage(this.image, item.posX, item.posY, item.width, item.height)
  }

  function resize() {
    $('#gameCanvas')[0].width = window.innerWidth
    $('#gameCanvas')[0].height = window.innerHeight
    cat.resize()
  }

  function run() {
    ctx.clearRect(0, 0, canvasTag.width, canvasTag.height)
    // resize() // use listener
    createFrame(background)
    spawnRaindrops()
    raindropsArr.filter(function (raindrop) {
      // console.log(raindrop.posY <= canvasTag.height,raindropsArr)
      return raindrop.posY <= canvasTag.height
    })
    // console.log(raindropsArr.length)
    raindropsArr.forEach(function (raindrop) {
      createFrame(raindrop)
      raindrop.move()
    })
    // console.log(raindropsArr)
    createFrame(cat)
    cat.control()
  }
  setInterval(run,10)
})
