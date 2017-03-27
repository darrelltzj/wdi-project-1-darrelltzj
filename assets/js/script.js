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
// pause function - save and restore - check when game Over - OK
// restart - OK

// initialize options - if else in runCanvas function - gameover window and runCanvas window
// mouse control
// event listener for resize
// mouse Character & collision (2 player)
// Create sprite - mouse
// font
// AI
// wind
// Mouse by Anton Håkanson from the Noun Project //robot head by Hea Poh Lin from the Noun Project //Keyboard by Paul te Kortschot from the Noun Project // Tennis Player Vector Icon by ProSymbols from the Noun Project // Squash player by Creative Stall from the Noun Project
// event listener for switch screen - requestAnimationFrame() continues to runCanvas // http://minutelabs.io/

$(document).ready(function () {
  var canvasTag = $('#gameCanvas')[0]
  var ctx = canvasTag.getContext("2d")

  $('#gameCanvas')[0].width = window.innerWidth
  $('#gameCanvas')[0].height = window.innerHeight

  var offsetPercent = 0.97 //for background image
  var gameEnvironment = {
    width: canvasTag.width,
    height: canvasTag.height,
    posX: 0,
    posY: 0,
    imageFolder: 'background',
    selectedFrame: 0,
    imageFormat: '\.jpg'
  }

  var timerId = 0
  var totalTimeCount = 0
  var second = 0
  var minute = 0
  var pause = false
  var gameOver = false
  var characterArr = []

  var raindropSpawnDuration = 20
  var raindropRemovalDuration = 5
  var raindropsArr = []
  var raindropSpawnTimer = raindropSpawnDuration

  var cat = new Character(0.11, offsetPercent, 'cat', '\.png', 8, 3)
  characterArr.push(cat)
  // var mouse = new Character(0.11, offsetPercent, 'cat', '\.png', 8, 3)
  // characterArr.push(mouse)

  function spawnRaindrops () {
    if (raindropsArr.length === 0) {
      this.raindrop = new Raindrops
      raindropsArr.push(this.raindrop)
    }
    else if (raindropSpawnTimer <= 0) {
      this.raindrop = new Raindrops
      raindropsArr.push(this.raindrop)
      raindropSpawnTimer = raindropSpawnDuration
    }
    raindropSpawnTimer-- //SHIFT THIS TO UPDATETIME FOR ACCURATE COUNT
  }
  function checkRaindrops () {
    raindropsArr.forEach(function (raindrop, i) {
      createFrame(raindrop)
      raindrop.collisionDetection()
      raindrop.faceOrientation() //CHANGE!
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
    }
    else if (!this.faceRight) {
      this.orientation = 1
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
  // Character.prototype.resize = function () {
  //   this.width = this.sizePercent * canvasTag.width
  //   this.height = this.width //need to adjust to % of canvas
  //   // this.posX = (canvasTag.width - this.width) / 2
  //   this.posY = this.posYOffsetPercent * canvasTag.height - this.height
  // }

  function createFrame(item) {
    var image = new Image()
    image.src = 'assets/img/' + item.imageFolder + '\/' + item.selectedFrame + item.imageFormat
    ctx.drawImage(image, item.posX, item.posY, item.width, item.height)
  }
  function displayTime() {
    ctx.font = "40px Arial"
    ctx.fillStyle = "#716969"
    ctx.fillText(minute + " : " + second, (0.46 * canvasTag.width), (0.05 * canvasTag.height))
    // ctx.fillText(gameEnvironment.minute + " : " + gameEnvironment.second, (0.46 * canvasTag.width), (0.05 * canvasTag.height))
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
  function displayPause() {
    ctx.font = "72px Arial"
    ctx.fillStyle = "#716969"
    ctx.fillText("Game Paused", (0.35 * canvasTag.width), (0.4 * canvasTag.height))
    ctx.font = "16px Arial"
    ctx.fillStyle = "#2D2E2E"
    ctx.fillText("Press Space to Pause", (0.44 * canvasTag.width), (0.52 * canvasTag.height))
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
    ctx.font = "16px Arial"
    ctx.fillStyle = "#2D2E2E"
    ctx.fillText("Press Space to Restart", (0.44 * canvasTag.width), (0.52 * canvasTag.height))
  }
  // function resize() {
  //   $('#gameCanvas')[0].width = window.innerWidth
  //   $('#gameCanvas')[0].height = window.innerHeight
  //   cat.resize()
  // }

  function twoDigit (digit) {
    return (digit < 10) ? '0' + digit.toString() : digit.toString()
  }
  function updateTime() {
    totalTimeCount++
    if (!gameOver && !pause) {
      second = twoDigit(Math.floor(totalTimeCount % 60))
      minute = twoDigit(Math.floor(totalTimeCount / 60))
    }
  }
  function startTimer () {
    timerId = setInterval(updateTime, 1000)
  }
  function pauseTimer () {
    clearInterval(timerId)
  }

  function controlStages () {
    if (!gameOver) {
      switch(true) {
        case (totalTimeCount > 0 && totalTimeCount <= 2):
        raindropSpawnDuration = 12
        displayCategory(5)
        break
        case (totalTimeCount > 2 && totalTimeCount <= 5):
        raindropSpawnDuration = 12
        break
        case (totalTimeCount > 5 && totalTimeCount <= 7):
        raindropSpawnDuration = 8
        displayCategory(4)
        break
        case (totalTimeCount > 7 && totalTimeCount <= 10):
        raindropSpawnDuration = 8
        break
        case (totalTimeCount > 10 && totalTimeCount <= 12):
        raindropSpawnDuration = 6
        displayCategory(3)
        break
        case (totalTimeCount > 12 && totalTimeCount <= 20):
        raindropSpawnDuration = 6
        break
        case (totalTimeCount > 20 && totalTimeCount <= 22):
        raindropSpawnDuration = 4
        displayCategory(2)
        break
        case (totalTimeCount > 22 && totalTimeCount <= 40):
        raindropSpawnDuration = 4
        break
        case (totalTimeCount > 40 && totalTimeCount <= 42):
        raindropSpawnDuration = 4
        displayBrace()
        break
        case (totalTimeCount > 42 && totalTimeCount<= 44):
        raindropSpawnDuration = 4
        break
        case (totalTimeCount > 44 && totalTimeCount <= 46):
        raindropSpawnDuration = 3
        displayCategory(1)
        break
        case (totalTimeCount > 46 && totalTimeCount <= 50):
        raindropSpawnDuration = 3
        break
        case (totalTimeCount > 50):
        raindropSpawnDuration = 2
        break
        default:
        raindropSpawnDuration = 20
      }
    }
  }

  function activatePause () {
    if (!gameOver) {
      pause = true
    }
  }
  function pauseToggle () {
    if (!gameOver) {
      if (pause) {
        $(document).on('keydown', function (e) {
          if(e.keyCode == 32) {
            pause = false
          }
        }.bind(this))
      }
      else {
        $(document).on('keydown', function (e) {
          if(e.keyCode == 32) {
            pause = true
          }
        }.bind(this))
      }
    }
  }
  function pauseCanvas() {
    ctx.clearRect(0, 0, canvasTag.width, canvasTag.height)
    createFrame(gameEnvironment)
    pauseToggle()
    displayPause()
    displayTime()
    drawCharacter()
    if (pause) {
      requestAnimationFrame(pauseCanvas)
    }
    else {
      startTimer()
      requestAnimationFrame(runCanvas)
    }
  }
  $(window).on('blur', activatePause)

  function runCanvas() {
    ctx.clearRect(0, 0, canvasTag.width, canvasTag.height)
    createFrame(gameEnvironment)
    cat.control()
    pauseToggle()
    checkGameOver()
    controlStages()
    spawnRaindrops()
    checkRaindrops()
    checkCharacterLives()
    displayTime()
    drawCharacter()
    if (gameOver) {
      raindropSpawnDuration = 20
      requestAnimationFrame(runGameOverCanvas)
    }
    else if (pause) {
      pauseTimer()
      requestAnimationFrame(pauseCanvas)
    }
    else {
      requestAnimationFrame(runCanvas)
    }
  }

  function checkGameOver () {
    if (characterArr.length === 0) {
      gameOver = true
    }
  }
  function runGameOverCanvas () {
    createFrame(gameEnvironment)
    displayGameOver()
    checkRestart()
    spawnRaindrops()
    checkRaindrops()
    displayTime()
    drawCharacter()
    requestAnimationFrame(runGameOverCanvas)
  }
  function checkRestart () {
    $(document).on('keydown', function (e) {
      if(e.keyCode == 32) {
        activateRestart()
      }
    }.bind(this))
  }
  function activateRestart () {
    document.location.reload()
  }

  startTimer()
  runCanvas()
})
