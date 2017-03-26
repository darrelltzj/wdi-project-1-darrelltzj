// jquery on press - OK
// Raindrop - OK
// collision detection rain & character
// Create Image Generator / movement - (sprite) invert when left
// animate images
// timer / end game
// event listener for resize
// pause
// mouse
// initialize
// mouse Character
// rain frequency

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
  var offsetPercent = 0.97
  var characterArr = []

  var raindropSpawnDuration = 20
  var raindropRemovalDuration = 5
  var raindropsArr = []
  var raindropSpawnTimer = raindropSpawnDuration

  var catFrames = [
    'bunny.gif',
    'cat.gif',
    'bettle.gif',
    'splat.png'
  ]
  var cat = new Character(0.11, offsetPercent, catFrames, 2, 3)
  characterArr.push(cat)

  function spawnRaindrops () {
    if (raindropSpawnTimer <= 0) {
      this.raindrop = new Raindrops
      raindropsArr.push(this.raindrop)
      raindropSpawnTimer = raindropSpawnDuration
    }
    else if (raindropsArr.length === 0) {
      this.raindrop = new Raindrops
      raindropsArr.push(this.raindrop)
    }
    raindropSpawnTimer--
  }
  function checkRaindrops () {
    raindropsArr.forEach(function (raindrop, i) {
      createFrame(raindrop)
      raindrop.collisionDetection()
      raindrop.changeFrame()
      raindrop.move()
      if (raindrop.collided) {
        if (raindrop.raindropRemovalTime === 0) {
          raindropsArr.splice(i,1)
        }
        else {
          raindrop.raindropRemovalTime--
        }
      }
    })
  }
  function Raindrops () {
    this.sizePercent = 0.02
    this.width = this.sizePercent * canvasTag.width
    this.height = this.width
    this.posX = this.randomX()
    this.posY = 0
    this.frames = ['raindrop.png', 'splash.png', 'splat.png']
    this.selectedFrame = 0
    this.velocity = 0
    this.gravity = 0.07
    this.collided = false
    this.raindropRemovalTime = raindropRemovalDuration
  }
  Raindrops.prototype.randomX = function () {
    return Math.round(Math.random() * canvasTag.width)
  }
  Raindrops.prototype.move = function () {
    if (!this.collided) {
      this.posY += this.velocity
      this.velocity += this.gravity
    }
    else {
      this.velocity = 0
      this.gravity = 0
    }
  }
  Raindrops.prototype.changeFrame = function () {
    if (this.collided) {
      this.selectedFrame = 2
    }
    else {
      this.selectedFrame = 0
    }
  }
  Raindrops.prototype.collisionDetection = function () {
    if (this.posY + this.height >= offsetPercent * canvasTag.height) {
      this.collided = true
      this.posY = offsetPercent * canvasTag.height - this.height
    }
    else {
      characterArr.forEach(function (character) {
        if (!this.collided && this.posX > character.posX && this.posX + this.width < character.posX + character.width && (this.posY + this.height) >= character.posY) {
          this.collided = true
          this.posY = character.posY - this.height
          character.lives--
        }
      }.bind(this))
    }
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

    this.lives = 9

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
    checkRaindrops()
    createFrame(cat)
    cat.control()
    console.log(cat.lives)
  }
  setInterval(run,10)
})
