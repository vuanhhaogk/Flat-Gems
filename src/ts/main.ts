const MAX_GAME_HEIGHT = 640
const MIN_GAME_HEIGHT = 480
const GAME_WIDTH = 360

let game

let bootState = {
    preload: function(){
        game.stage.backgroundColor = '#f06292'

        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
        game.scale.pageAlignHorizontally = true
        game.scale.pageAlignVertically = true

        game.load.image('loader_bg', 'assets/images/loader_bg.png')
        game.load.image('loader_br', 'assets/images/loader_br.png')
    },
    create: function(){
        game.state.start('loader')
    }
}

window.onload = () => {
    if (screen.orientation)
        screen.orientation.lock('portrait')

    let width = GAME_WIDTH
    let height
    let ratio = window.innerWidth/width
    let screen_height = window.innerHeight/ratio
    if (screen_height <= MAX_GAME_HEIGHT){
        if (screen_height >= MIN_GAME_HEIGHT){
            height = screen_height
        } else
            height = MIN_GAME_HEIGHT
    } else
        height = MAX_GAME_HEIGHT

    game = new Phaser.Game(width, height, Phaser.AUTO, '')

    game.state.add('boot', bootState)
    game.state.add('loader', loaderState)
    game.state.add('menu', menuState)
    game.state.add('game', gameState)

    game.state.start('boot')
}
