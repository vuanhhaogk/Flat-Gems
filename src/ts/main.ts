let game = new Phaser.Game()

let bootState = {
    preload: function(){

    },
    create: function(){

    }
}

game.state.add('boot', bootState)
game.state.add('loader', loaderState)
game.state.add('game', gameState)

window.onload = () => {
    game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE
    game.scale.pageAlignHorizontally = true
    game.scale.pageAlignVertically = true
    
    game.state.start('boot')
}
