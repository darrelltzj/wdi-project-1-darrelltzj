// -----TO DO-----
// jquery on press - OK
// Raindrop - OK
// collision detection rain - OK
// end game - OK
// timer - OK
// Create sprite - cat // height342 width 575
// - edit faceOrientation & createFrame function
// split rightfacing and reverse facing img - OK
// need counter - change frame after a few miliseconds - OK
// - activate faceOrientation even if key is not pressed: press --> image roll 1-last-1 - OK
// stop animation when key is not pressed - OK
// rain frequency stages - check game over - OK

// pause function - save and restore
// restart & initialize options - if else in run function - gameover window and run window
// mouse control
// event listener for switch screen
// event listener for resize
// mouse Character & collision (2 player)
// Create sprite - mouse
// font
// AI
// wind

$(document).ready(function () {
  var canvasTag = $('#gameCanvas')[0]
  var ctx = canvasTag.getContext("2d")

  $('#gameCanvas')[0].width = window.innerWidth
  $('#gameCanvas')[0].height = window.innerHeight

  var gameEnvironment = {
    width: canvasTag.width,
    height: canvasTag.height,
    posX: 0,
    posY: 0,
    imageFolder: 'background',
    selectedFrame: 0,
    imageFormat: '\.jpg',
    totalTimeCount: 0,
    second: 0,
    minute: 0,
    timerId: 0,
    pause: false,
    gameOver: false,
    updateTime: function () {
      this.totalTimeCount++
      if (!this.gameOver && !this.pause) {
        this.second = this.twoDigit(Math.floor((gameEnvironment.totalTimeCount % 60)))
        this.minute = this.twoDigit(Math.floor(gameEnvironment.totalTimeCount / 60))
      }
    },
    twoDigit: function (digit) {
      return (digit < 10) ? '0' + digit.toString() : digit.toString()
    },
    startTimer: function () {
      this.timerId = setInterval(this.updateTime.bind(this), 1000)
    },
    pauseTimer: function () {
      clearInterval(this.timerId)
    },
    controlStages: function () {
      if (!this.gameOver) {
        switch(true) {
          case (this.totalTimeCount > 0 && this.totalTimeCount <= 2):
          raindropSpawnDuration = 12
          displayCategory(5)
          displayPauseInstructions()
          break
          case (this.totalTimeCount > 2 && this.totalTimeCount <= 5):
          raindropSpawnDuration = 12
          break
          case (this.totalTimeCount > 5 && this.totalTimeCount <= 7):
          raindropSpawnDuration = 8
          displayCategory(4)
          break
          case (this.totalTimeCount > 7 && this.totalTimeCount <= 10):
          raindropSpawnDuration = 8
          break
          case (this.totalTimeCount > 10 && this.totalTimeCount <= 12):
          raindropSpawnDuration = 6
          displayCategory(3)
          break
          case (this.totalTimeCount > 12 && this.totalTimeCount <= 20):
          raindropSpawnDuration = 6
          break
          case (this.totalTimeCount > 20 && this.totalTimeCount <= 22):
          raindropSpawnDuration = 4
          displayCategory(2)
          break
          case (this.totalTimeCount > 22 && this.totalTimeCount <= 40):
          raindropSpawnDuration = 4
          break
          case (this.totalTimeCount > 40 && this.totalTimeCount <= 42):
          raindropSpawnDuration = 4
          displayBrace()
          break
          case (this.totalTimeCount > 42 && this.totalTimeCount<= 44):
          raindropSpawnDuration = 4
          break
          case (this.totalTimeCount > 44 && this.totalTimeCount <= 46):
          raindropSpawnDuration = 3
          displayCategory(1)
          break
          case (this.totalTimeCount > 46):
          raindropSpawnDuration = 2
          break
          default:
          raindropSpawnDuration = 20
        }
      }
    },
    checkPause: function() {
      if (this.pause) {
        $(document).on('keydown', function (e) {
          if(e.keyCode == 32) {
            this.pause = false
          }
        }.bind(this))
      }
      else {
        $(document).on('keydown', function (e) {
          if(e.keyCode == 32) {
            this.pause = true
          }
        }.bind(this))
      }
      // this.activatePauseFrame()
    }
  }

  var offsetPercent = 0.97
  var characterArr = []

  var raindropSpawnDuration = 20
  var raindropRemovalDuration = 5
  var raindropsArr = []
  var raindropSpawnTimer = raindropSpawnDuration

  var cat = new Character(0.11, offsetPercent, 'cat', '\.png', 8, 3)
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
      raindrop.faceOrientation()
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
    this.imageFolder = 'raindrop'
    this.selectedFrame = 0
    this.imageFormat = '\.png'
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
  Raindrops.prototype.faceOrientation = function () {
    if (this.collided) {
      this.selectedFrame = 1
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

  function checkCharacterLives() {
    characterArr.forEach(function (character, i) {
      if (character.lives === 0) {
        characterArr.splice(i,1)
      }
    })
  }
  function drawCharacter() {
    characterArr.forEach(function (character) {
      createFrame(character)
    })
    displayCatLives()
  }
  function Character(sizePercent, posYOffsetPercent, mainImageFolder, imageFormat, frameLength, velocity) {
    this.sizePercent = sizePercent
    this.posYOffsetPercent = posYOffsetPercent

    this.width = this.sizePercent * canvasTag.width
    this.height = (342 / 575) * this.width //need to adjust to % of canvas?
    this.posX = (canvasTag.width - this.width) / 2
    this.posY = this.posYOffsetPercent * canvasTag.height - this.height

    this.mainImageFolder = mainImageFolder
    this.orientation = 0 //0 is right 1 is left
    this.selectedFrame = 0
    this.imageFormat = imageFormat
    this.frameLength = frameLength
    this.imageFolder = this.mainImageFolder + '\/' + this.orientation
    this.frameChangeDelay = this.frameLength / 2

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
    this.faceOrientation()
    this.controlAnimation()
  }
  Character.prototype.move = function () {
    if(this.rightPressed && this.posX < canvasTag.width - this.width) {
      this.posX += this.velocity
      this.faceRight = true
    }

    else if(this.leftPressed && this.posX > 0) {
      this.posX -= this.velocity
      this.faceRight = false
    }
  }
  Character.prototype.faceOrientation = function () {
    if (this.faceRight) {
      this.orientation = 0

      // if (this.selectedFrame >= this.reverseFrameIndex) {
      //   this.selectedFrame = 0
      // }
      // else {
      //   this.selectedFrame += 1
      // }
    }
    else if (!this.faceRight) {
      this.orientation = 1

      // if (this.selectedFrame < this.reverseFrameIndex) {
      //   this.selectedFrame = this.reverseFrameIndex
      // }
      // if (this.selectedFrame === this.frames.length - 1 || this.selectedFrame <= this.reverseFrameIndex - 1) {
      //   this.selectedFrame = this.reverseFrameIndex
      // }
      // else {
      //   this.selectedFrame += 1
      // }
    }
    this.imageFolder = this.mainImageFolder + '\/' + this.orientation
  }
  Character.prototype.controlAnimation = function () {
    if (this.rightPressed || this.leftPressed || this.selectedFrame !== 0) {
      this.animateFrame()
    }
  }
  Character.prototype.animateFrame = function () {
    if (this.frameChangeDelay === 0) {
      if (this.selectedFrame === this.frameLength - 1) {
        this.selectedFrame = 0
      }
      else {
        this.selectedFrame++
      }
      this.frameChangeDelay = this.frameLength / 2
    }
    else {
      this.frameChangeDelay--
    }
    // console.log(this.selectedFrame)
  }
  Character.prototype.resize = function () {
    this.width = this.sizePercent * canvasTag.width
    this.height = this.width //need to adjust to % of canvas
    // this.posX = (canvasTag.width - this.width) / 2
    this.posY = this.posYOffsetPercent * canvasTag.height - this.height
  }

  function isGameOver() {
    if (characterArr.length === 0) {
      gameEnvironment.gameOver = true
      displayGameOver()
      raindropSpawnDuration = 20
    }
    // document.location.reload()
  }

  function createFrame(item) {
    this.image = new Image()
    this.image.src = 'assets/img/' + item.imageFolder + '\/' + item.selectedFrame + item.imageFormat
    ctx.drawImage(this.image, item.posX, item.posY, item.width, item.height)
  }

  function displayTime() {
    ctx.font = "40px Arial"
    ctx.fillStyle = "#716969"
    ctx.fillText(gameEnvironment.minute + " : " + gameEnvironment.second, (0.46 * canvasTag.width), (0.05 * canvasTag.height))
  }
  function displayCatLives() {
    ctx.font = "32px Arial"
    ctx.fillStyle = "#716969"
    ctx.fillText("Cat\'s Lives: " + cat.lives, (0.01 * canvasTag.width), (0.05 * canvasTag.height))
  }
  function displayCategory(category) {
    ctx.font = "72px Arial"
    ctx.fillStyle = "#716969"
    ctx.fillText("Category " + category, (0.37 * canvasTag.width), (0.4 * canvasTag.height))
  }
  function displayBrace() {
    ctx.font = "72px Arial"
    ctx.fillStyle = "#716969"
    ctx.fillText("Get Ready", (0.37 * canvasTag.width), (0.4 * canvasTag.height))
  }
  function displayPauseInstructions() {
    ctx.font = "16px Arial"
    ctx.fillStyle = "#2D2E2E"
    ctx.fillText("Press Space to Pause", (0.44 * canvasTag.width), (0.52 * canvasTag.height))
  }
  function displayPause() {
    ctx.font = "72px Arial"
    ctx.fillStyle = "#716969"
    ctx.fillText("Game Paused", (0.35 * canvasTag.width), (0.4 * canvasTag.height))
    displayResumeInstructions()
  }
  function displayResumeInstructions() {
    ctx.font = "16px Arial"
    ctx.fillStyle = "#2D2E2E"
    ctx.fillText("Press Space to Resume", (0.44 * canvasTag.width), (0.52 * canvasTag.height))
  }
  function displayGameOver() {
    ctx.font = "72px Arial"
    ctx.fillStyle = "#716969"
    ctx.fillText("Game Over", (0.37 * canvasTag.width), (0.4 * canvasTag.height))
  }

  function resize() {
    $('#gameCanvas')[0].width = window.innerWidth
    $('#gameCanvas')[0].height = window.innerHeight
    cat.resize()
  }

  function pause() {
    ctx.clearRect(0, 0, canvasTag.width, canvasTag.height)
    createFrame(gameEnvironment)
    displayPause()
    drawCharacter()
    gameEnvironment.checkPause()
    displayTime()
    if (gameEnvironment.pause) {
      requestAnimationFrame(pause)
    }
    else {
      gameEnvironment.startTimer()
      requestAnimationFrame(run)
    }
  }

  function run() {
    ctx.clearRect(0, 0, canvasTag.width, canvasTag.height)
    // resize() // use listener
    createFrame(gameEnvironment)
    spawnRaindrops()
    checkRaindrops()
    cat.control()
    drawCharacter()
    checkCharacterLives()
    gameEnvironment.controlStages()
    gameEnvironment.checkPause()
    isGameOver()
    displayTime()
    if (gameEnvironment.pause) {
      gameEnvironment.pauseTimer()
      requestAnimationFrame(pause)
    }
    else {
      requestAnimationFrame(run)
    }
    // console.log(gameEnvironment.totalTimeCount, cat.selectedFrame)
  }
  run()
  // setInterval(run,10)
  gameEnvironment.startTimer()
})
