// # Avoid the Raindrops
// =======================
// darrelltzj for GA WDI 9

$(document).ready(function () {
  // #---Game Canvas and Environment Variables---
  var canvasTag = $('#gameCanvas')[0]
  var ctx = canvasTag.getContext('2d')
  $('#gameCanvas')[0].width = window.innerWidth
  $('#gameCanvas')[0].height = window.innerHeight

  // offsetPercent to offset character to floor of background image
  var offsetPercent = 0.97
  var gameEnvironment = {
    width: canvasTag.width,
    height: canvasTag.height,
    posX: 0,
    posY: 0,
    imageFolder: 'background',
    selectedFrame: 0,
    imageFormat: '.jpg'
  }

  // #---Timer Variables---
  var timerId = 0
  var totalTimeCount = 0
  var second = 0
  var minute = 0

  // #---Game Status Variables---
  var pause = false
  var gameOver = true

  // #---Raindrop Variables---
  var raindropSpawnDuration = 20
  var raindropRemovalDuration = 5
  var raindropsArr = []
  var raindropSpawnTimer = raindropSpawnDuration

  // #---Hit Indicator vaviables---
  var indicatorTimer = 25
  var activateIndicator = false
  var indicatorX = 0
  var indicatorY = 0

  // #---Player Selection Variables---
  var singlePlayer = true
  var playerOneControl = 1
  var playerTwoControl = 2
  var startingPlayerCount = 1

  // #---Player Character Array---
  var characterArr = []
  // #---Create cats---
  // (sizePercent, posX, heightWidthRatio, posYOffsetPercent, mainImageFolder, imageFormat, frameLength, velocity, playerControl)
  var cat = new Character(0.11, (0.8 * canvasTag.width), (342 / 575), offsetPercent, 'cat', '.png', 8, 4.5, playerOneControl)
  var cat2 = new Character(0.11, (0.1 * canvasTag.width), (342 / 575), offsetPercent, 'cat2', '.png', 8, 4.5, playerTwoControl)

  // #---Resize Variables---
  var oldCanvasWidth = canvasTag.width
  var oldCatPosX = cat.posX
  var oldCat2PosX = cat2.posX

  // #---Mute Toggle Variables---
  var mute = false

  // #---Raindrops' Functions---
  function spawnRaindrops () {
    if (raindropsArr.length === 0 || raindropSpawnTimer <= 0) {
      this.raindrop = new Raindrops()
      raindropsArr.push(this.raindrop)
      raindropSpawnTimer = raindropSpawnDuration
    }
    raindropSpawnTimer--
  }
  function checkRaindrops () {
    raindropsArr.forEach(function (raindrop, i) {
      createFrame(raindrop)
      raindrop.collisionDetection()
      raindrop.selectFrame()
      raindrop.move()
      if (raindrop.collided) {
        if (raindrop.raindropRemovalTime === 0) {
          raindropsArr.splice(i, 1)
        }
        else {
          raindrop.raindropRemovalTime--
        }
      }
    })
  }

  // #---Raindrop Contructor and Prototype---
  function Raindrops () {
    this.sizePercent = 0.016
    this.width = this.sizePercent * canvasTag.width
    this.height = this.width
    this.posX = this.randomX()
    this.posY = 0
    this.imageFolder = 'raindrop'
    this.selectedFrame = 0
    this.imageFormat = '.png'
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
  Raindrops.prototype.selectFrame = function () {
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
          indicatorX = this.posX
          indicatorY = this.posY - (this.height)
          activateIndicator = true
          $('#meow')[0].play()
        }
      }.bind(this))
    }
  }

  // #---Characters' Functions---
  function checkCharacterLives () {
    characterArr.forEach(function (character, i) {
      if (character.lives === 0) {
        characterArr.splice(i, 1)
      }
    })
  }
  function drawCharacter () {
    characterArr.forEach(function (character) {
      createFrame(character)
    })
    if (startingPlayerCount === 1) {
      displayCatLives()
    }
    else if (startingPlayerCount === 2) {
      displayCatLives()
      displayCat2Lives()
    }
  }

  // # Character Contructor and Prototype
  function Character (sizePercent, posX, heightWidthRatio, posYOffsetPercent, mainImageFolder, imageFormat, frameLength, velocity, playerControl) {
    this.sizePercent = sizePercent
    this.posYOffsetPercent = posYOffsetPercent

    this.heightWidthRatio = heightWidthRatio
    this.width = this.sizePercent * canvasTag.width
    this.height = this.heightWidthRatio * this.width
    this.posX = posX
    this.posY = 0.97 * canvasTag.height - this.height

    this.mainImageFolder = mainImageFolder
    // orientation: 0 is right 1 is left
    this.orientation = 0
    this.selectedFrame = 0
    this.imageFormat = imageFormat
    this.frameLength = frameLength
    this.imageFolder = this.mainImageFolder + '/' + this.orientation
    this.frameChangeDelay = Math.floor(24 / this.frameLength)

    this.faceRight = true
    this.velocity = velocity

    this.playerControl = playerControl

    this.lives = 9

    this.rightPressed = false
    this.leftPressed = false
  }

  // ## Controls: mouse: 0, left / right: 1, WASD: 2
  Character.prototype.control = function () {
    if (this.playerControl === 0) {
      $(document).on('mousemove', function (e) {
        e.preventDefault()
        var relativeX = e.clientX - canvasTag.offsetLeft
        if (relativeX > 0 && relativeX < canvasTag.width) {
          if ((this.posX + this.width) < relativeX) {
            this.rightPressed = true
            this.leftPressed = false
          }
          else if (this.posX > relativeX) {
            this.leftPressed = true
            this.rightPressed = false
          }
          else {
            this.leftPressed = false
            this.rightPressed = false
          }
        }
      }.bind(this))
    }
    else if (this.playerControl === 1) {
      $(document).on('keydown', function (e) {
        e.preventDefault()
        if (e.keyCode === 39) {
          this.rightPressed = true
        }
        else if (e.keyCode === 37) {
          this.leftPressed = true
        }
      }.bind(this))

      $(document).on('keyup', function (e) {
        e.preventDefault()
        if (e.keyCode === 39) {
          this.rightPressed = false
        }
        else if (e.keyCode === 37) {
          this.leftPressed = false
        }
      }.bind(this))
    }
    else if (this.playerControl === 2) {
      $(document).on('keydown', function (e) {
        e.preventDefault()
        if (e.keyCode === 68) {
          this.rightPressed = true
        }
        else if (e.keyCode === 65) {
          this.leftPressed = true
        }
      }.bind(this))

      $(document).on('keyup', function (e) {
        e.preventDefault()
        if (e.keyCode === 68) {
          this.rightPressed = false
        }
        else if (e.keyCode === 65) {
          this.leftPressed = false
        }
      }.bind(this))
    }

    this.move()
    this.faceOrientation()
    this.controlAnimation()
  }
  Character.prototype.move = function () {
    if (this.rightPressed && this.posX < canvasTag.width - this.width) {
      this.posX += this.velocity
      this.faceRight = true
    }

    else if (this.leftPressed && this.posX > 0) {
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
    this.imageFolder = this.mainImageFolder + '/' + this.orientation
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
      this.frameChangeDelay = Math.floor(24 / this.frameLength)
    }
    else {
      this.frameChangeDelay--
    }
  }
  Character.prototype.resize = function () {
    this.width = this.sizePercent * canvasTag.width
    this.height = this.heightWidthRatio * this.width
    this.posY = this.posYOffsetPercent * canvasTag.height - this.height
  }

  // #---Draw Image and Text on Canvas Functions---
  function createFrame (item) {
    var image = new Image()
    image.src = 'assets/img/' + item.imageFolder + '/' + item.selectedFrame + item.imageFormat
    ctx.drawImage(image, item.posX, item.posY, item.width, item.height)
  }
  function displayHit (posX, posY) {
    if (indicatorTimer === 0) {
      activateIndicator = false
      indicatorTimer = 25
    }
    else if (activateIndicator) {
      ctx.font = '72px Comfortaa, cursive'
      ctx.fillStyle = '#716969'
      ctx.fillText('-1', posX, posY)
    }
  }
  function displayTime () {
    ctx.font = '40px Comfortaa, cursive'
    ctx.fillStyle = '#716969'
    ctx.fillText(minute + ' : ' + second, (0.5 * (canvasTag.width - ctx.measureText(minute + ' : ' + second).width)), (0.07 * canvasTag.height))
  }
  function displayCatLives () {
    ctx.font = '32px Comfortaa, cursive'
    ctx.fillStyle = '#716969'
    ctx.fillText('Player One:  ' + cat.lives, (0.8 * canvasTag.width), (0.07 * canvasTag.height))
  }
  function displayCat2Lives () {
    ctx.font = '32px Comfortaa, cursive'
    ctx.fillStyle = '#716969'
    ctx.fillText('Player Two:  ' + cat2.lives, (0.04 * canvasTag.width), (0.07 * canvasTag.height))
  }
  function displayStage (stage) {
    ctx.font = '72px Comfortaa, cursive'
    ctx.fillStyle = '#716969'
    ctx.fillText('Stage ' + stage, 0.5 * (canvasTag.width - ctx.measureText('Stage ' + stage).width), (0.4 * canvasTag.height))
    ctx.font = '16px Comfortaa, cursive'
    ctx.fillStyle = '#2D2E2E'
    ctx.fillText('Press Space to Pause', 0.5 * (canvasTag.width - ctx.measureText('Press Space to Pause').width), (0.52 * canvasTag.height))
  }
  function displayBrace () {
    ctx.font = '72px Comfortaa, cursive'
    ctx.fillStyle = '#716969'
    ctx.fillText('Get Ready', 0.5 * (canvasTag.width - ctx.measureText('Get Ready').width), (0.4 * canvasTag.height))
    ctx.font = '16px Comfortaa, cursive'
    ctx.fillStyle = '#2D2E2E'
    ctx.fillText('Press Space to Pause', 0.5 * (canvasTag.width - ctx.measureText('Press Space to Pause').width), (0.52 * canvasTag.height))
  }
  function displayPause () {
    ctx.font = '72px Comfortaa, cursive'
    ctx.fillStyle = '#716969'
    ctx.fillText('Game Paused', 0.5 * (canvasTag.width - ctx.measureText('Game Paused').width), (0.4 * canvasTag.height))
    ctx.font = '16px Comfortaa, cursive'
    ctx.fillStyle = '#2D2E2E'
    ctx.fillText('Press Space to Resume', 0.5 * (canvasTag.width - ctx.measureText('Press Space to Resume').width), (0.52 * canvasTag.height))
  }
  function displayGameOver () {
    ctx.font = '72px Comfortaa, cursive'
    ctx.fillStyle = '#716969'
    ctx.fillText('Game Over', 0.5 * (canvasTag.width - ctx.measureText('Game Over').width), (0.4 * canvasTag.height))
    ctx.font = '16px Comfortaa, cursive'
    ctx.fillStyle = '#2D2E2E'
    ctx.fillText('Press Space to Restart', 0.5 * (canvasTag.width - ctx.measureText('Press Space to Restart').width), (0.52 * canvasTag.height))
  }
  function displayStart () {
    ctx.font = '80px Comfortaa, cursive'
    ctx.fillStyle = '#716969'
    ctx.fillText('Avoid the Raindrops', 0.5 * (canvasTag.width - ctx.measureText('Avoid the Raindrops').width), (0.28 * canvasTag.height))
    ctx.font = '16px Comfortaa, cursive'
    ctx.fillStyle = '#2D2E2E'
    ctx.fillText('Press Space to Start', 0.5 * (canvasTag.width - ctx.measureText('Press Space to Start').width), (0.4 * canvasTag.height))
  }
  function displaySingle () {
    var image = new Image()
    image.src = 'assets/img/start/singlePlayerToggle.png'
    ctx.drawImage(image, (0.43 * canvasTag.width), (0.55 * canvasTag.height), (0.14 * canvasTag.width), (12 / 30 * 0.14 * canvasTag.width))
  }
  function displayDouble () {
    var image = new Image()
    image.src = 'assets/img/start/doublePlayerToggle.png'
    ctx.drawImage(image, (0.43 * canvasTag.width), (0.55 * canvasTag.height), (0.14 * canvasTag.width), (12 / 30 * 0.14 * canvasTag.width))
  }
  function displayArrow () {
    var image = new Image()
    image.src = 'assets/img/start/arrow.png'
    ctx.drawImage(image, (0.63 * canvasTag.width), (0.56 * canvasTag.height), (0.06 * canvasTag.width), (0.06 * canvasTag.width))
  }
  function displayWasd () {
    var image = new Image()
    image.src = 'assets/img/start/wasd.png'
    ctx.drawImage(image, (0.3 * canvasTag.width), (0.57 * canvasTag.height), (0.06 * canvasTag.width), (187 / 288 * 0.06 * canvasTag.width))
  }
  function displayMouseOne () {
    var image = new Image()
    image.src = 'assets/img/start/mouse.png'
    ctx.drawImage(image, (0.63 * canvasTag.width), (0.56 * canvasTag.height), (0.05 * canvasTag.width), (0.05 * canvasTag.width))
  }
  function displayMouseTwo () {
    var image = new Image()
    image.src = 'assets/img/start/mouse.png'
    ctx.drawImage(image, (0.3 * canvasTag.width), (0.56 * canvasTag.height), (0.05 * canvasTag.width), (0.05 * canvasTag.width))
  }
  function displayAudioStatus () {
    if (mute) {
      var image = new Image()
      image.src = 'assets/img/start/mute.png'
      ctx.drawImage(image, (0.97 * canvasTag.width), (0.03 * canvasTag.height), (0.02 * canvasTag.width), (0.02 * canvasTag.width))
    }
  }

  // #---Timer Functions---
  function twoDigit (digit) {
    return (digit < 10) ? '0' + digit.toString() : digit.toString()
  }
  function updateTime () {
    if (!gameOver && !pause) {
      totalTimeCount++
      second = twoDigit(Math.floor(totalTimeCount % 60))
      minute = twoDigit(Math.floor(totalTimeCount / 60))
    }
  }
  function startTimer () {
    timerId = setInterval(updateTime, 1000)
  }
  function pauseTimer () {
    if (pause) {
      clearInterval(timerId)
    }
  }

  // #---Raindrop frequency / Stage Control---
  function controlStages () {
    if (!gameOver) {
      switch (true) {
        case (totalTimeCount > 0 && totalTimeCount <= 2):
          raindropSpawnDuration = 20
          displayBrace()
          break
        case (totalTimeCount > 2 && totalTimeCount <= 4):
          raindropSpawnDuration = 16
          break
        case (totalTimeCount > 4 && totalTimeCount <= 6):
          raindropSpawnDuration = 12
          displayStage(1)
          break
        case (totalTimeCount > 6 && totalTimeCount <= 18):
          raindropSpawnDuration = 12
          break
        case (totalTimeCount > 18 && totalTimeCount <= 20):
          raindropSpawnDuration = 8
          displayStage(2)
          break
        case (totalTimeCount > 20 && totalTimeCount <= 32):
          raindropSpawnDuration = 8
          break
        case (totalTimeCount > 32 && totalTimeCount <= 34):
          raindropSpawnDuration = 5
          displayStage(3)
          break
        case (totalTimeCount > 34 && totalTimeCount <= 48):
          raindropSpawnDuration = 5
          break
        case (totalTimeCount > 48 && totalTimeCount <= 50):
          raindropSpawnDuration = 20
          break
        case (totalTimeCount > 50 && totalTimeCount <= 52):
          raindropSpawnDuration = 4
          displayStage(4)
          break
        case (totalTimeCount > 52 && totalTimeCount <= 76):
          raindropSpawnDuration = 4
          break
        case (totalTimeCount > 76 && totalTimeCount <= 78):
          raindropSpawnDuration = 3
          displayStage(5)
          break
        case (totalTimeCount > 78 && totalTimeCount <= 90):
          raindropSpawnDuration = 3
          break
        case (totalTimeCount > 90):
          raindropSpawnDuration = 2
          displayStage('Bonus')
          break
        default:
          raindropSpawnDuration = 20
      }
    }
  }

  // #---Pause Functions---
  function activatePause () {
    if (!gameOver) {
      pause = true
    }
  }
  function pauseToggle () {
    if (!gameOver) {
      if (pause) {
        $(document).on('keydown', function (e) {
          if (e.keyCode === 32) {
            pause = false
          }
        })
      }
      else {
        $(document).on('keydown', function (e) {
          if (e.keyCode === 32) {
            pause = true
          }
        })
      }
    }
  }
  function pauseCanvas() {
    $('#gameTheme')[0].pause()
    $('#coverTheme')[0].play()
    $('#coverTheme')[0].loop = true
    ctx.clearRect(0, 0, canvasTag.width, canvasTag.height)
    createFrame(gameEnvironment)
    pauseToggle()
    displayPause()
    displayTime()
    drawCharacter()
    displayAudioStatus()
    if (pause) {
      requestAnimationFrame(pauseCanvas)
    }
    else {
      $('#coverTheme')[0].currentTime = 0
      $('#coverTheme')[0].pause()
      startTimer()
      requestAnimationFrame(runCanvas)
    }
  }
  $(window).on('blur', activatePause)

  // #---Screen resize Functions---
  function activateResize () {
    $('#gameCanvas')[0].width = window.innerWidth
    $('#gameCanvas')[0].height = window.innerHeight
    gameEnvironment.width = canvasTag.width
    gameEnvironment.height = canvasTag.height
    cat.resize()
    cat.posX = (canvasTag.width / oldCanvasWidth) * oldCatPosX
    cat2.resize()
    cat2.posX = (canvasTag.width / oldCanvasWidth) * oldCat2PosX
    activatePause()
  }
  $(window).on('resize', activateResize)

  // #---Main Game Running Function---
  function runCanvas() {
    $('#gameTheme')[0].play()
    $('#gameTheme')[0].loop = true
    ctx.clearRect(0, 0, canvasTag.width, canvasTag.height)
    createFrame(gameEnvironment)
    cat.control()
    cat2.control()
    pauseToggle()
    checkGameOver()
    controlStages()
    spawnRaindrops()
    checkRaindrops()
    checkCharacterLives()
    displayTime()
    drawCharacter()
    displayAudioStatus()
    if (activateIndicator) {
      displayHit(indicatorX, indicatorY)
      indicatorTimer--
    }
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

  // #---Game Over Functions---
  function checkGameOver () {
    if (characterArr.length === 0) {
      gameOver = true
    }
  }
  function checkRestart () {
    $(document).on('keydown', function (e) {
      if (e.keyCode === 32) {
        document.location.reload()
      }
    })
  }
  function runGameOverCanvas () {
    ctx.clearRect(0, 0, canvasTag.width, canvasTag.height)
    createFrame(gameEnvironment)
    displayGameOver()
    spawnRaindrops()
    checkRaindrops()
    displayTime()
    drawCharacter()
    checkRestart()
    displayAudioStatus()
    if (gameOver) {
      requestAnimationFrame(runGameOverCanvas)
    }
  }

  // #---Start Functions---
  function checkStart () {
    $(document).on('keydown', function (e) {
      if (e.keyCode === 32 && gameOver) {
        e.preventDefault()
        gameOver = false
      }
    })
  }
  function togglePlayer () {
    if (singlePlayer) {
      $(document).on('keydown', function (e) {
        e.preventDefault()
        if (e.keyCode === 39 || e.keyCode === 37 || e.keyCode === 65 || e.keyCode === 68) {
          singlePlayer = false
          if (gameOver) {
            $('#bloop')[0].play()
          }
        }
      })
    }
    else if (!singlePlayer) {
      $(document).on('keydown', function (e) {
        e.preventDefault()
        if (e.keyCode === 39 || e.keyCode === 37 || e.keyCode === 65 || e.keyCode === 68) {
          singlePlayer = true
          if (gameOver) {
            $('#bloop')[0].play()
          }
        }
      })
    }
  }
  function toggleControl () {
    $(document).on('keydown', function (e) {
      e.preventDefault()
      if (e.keyCode === 38 || e.keyCode === 40) {
        if (gameOver) {
          $('#bloop')[0].play()
        }
        if (playerOneControl === 1) {
          playerOneControl = 0
          playerTwoControl = 2
        }
        else if (playerOneControl === 0) {
          playerOneControl = 1
        }
      }
      if (e.keyCode === 87 || e.keyCode === 83) {
        if (gameOver) {
          $('#bloop')[0].play()
        }
        if (playerTwoControl === 2 && playerOneControl !== 0) {
          playerTwoControl = 0
        }
        else if (playerTwoControl === 0) {
          playerTwoControl = 2
        }
      }
    })
  }
  function setPlayer () {
    if (singlePlayer) {
      cat.playerControl = playerOneControl
      characterArr.push(cat)
      startingPlayerCount = 1
    }
    else if (!singlePlayer) {
      cat.playerControl = playerOneControl
      cat2.playerControl = playerTwoControl
      characterArr.push(cat)
      characterArr.push(cat2)
      startingPlayerCount = 2
    }
  }
  function initialize () {
    $('#coverTheme')[0].play()
    $('#coverTheme')[0].loop = true
    ctx.clearRect(0, 0, canvasTag.width, canvasTag.height)
    createFrame(gameEnvironment)
    displayStart()
    checkStart()
    togglePlayer()
    toggleControl()
    displayAudioStatus()
    if (singlePlayer) {
      displaySingle()
      if (playerOneControl === 0) {
        displayMouseOne()
      }
      else if (playerOneControl === 1) {
        displayArrow()
      }
      // displayArrow() // if else
    }
    else if (!singlePlayer) {
      displayDouble()
      if (playerOneControl === 0) {
        displayMouseOne()
      }
      else if (playerOneControl === 1) {
        displayArrow()
      }
      if (playerTwoControl === 0) {
        displayMouseTwo()
      }
      else if (playerTwoControl === 2) {
        displayWasd()
      }
    }
    if (!gameOver) {
      $('#coverTheme')[0].currentTime = 0
      $('#coverTheme')[0].pause()
      setPlayer()
      startTimer()
      requestAnimationFrame(runCanvas)
    }
    else {
      requestAnimationFrame(initialize)
    }
  }
  initialize()

  // #---Mute Listener---
  $(document).on('keydown', function (e) {
    e.preventDefault()
    if (e.keyCode === 77) {
      if (mute) {
        mute = false
        $('.audio')[0].muted = false
        $('#coverTheme')[0].muted = false
        $('#gameTheme')[0].muted = false
        $('#bloop')[0].muted = false
        $('#meow')[0].muted = false
      }
      else if (!mute) {
        mute = true
        $('.audio')[0].muted = true
        $('#coverTheme')[0].muted = true
        $('#gameTheme')[0].muted = true
        $('#bloop')[0].muted = true
        $('#meow')[0].muted = true
      }
    }
  })

  // #---Escape to restart---
  $(document).on('keydown', function (e) {
    if (e.keyCode === 27) {
      document.location.reload()
    }
  })
})
