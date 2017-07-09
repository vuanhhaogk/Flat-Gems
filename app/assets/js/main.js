var MAX_GAME_HEIGHT = 640;
var MIN_GAME_HEIGHT = 480;
var GAME_WIDTH = 360;
var game;
var bootState = {
    preload: function () {
        game.stage.backgroundColor = '#f06292';
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.load.image('loader_bg', 'assets/images/loader_bg.png');
        game.load.image('loader_br', 'assets/images/loader_br.png');
    },
    create: function () {
        game.state.start('loader');
    }
};
window.onload = function () {
    if (screen.orientation)
        screen.orientation.lock('portrait');
    var width = GAME_WIDTH;
    var height;
    var ratio = window.innerWidth / width;
    var screen_height = window.innerHeight / ratio;
    if (screen_height <= MAX_GAME_HEIGHT) {
        if (screen_height >= MIN_GAME_HEIGHT) {
            height = screen_height;
        }
        else
            height = MIN_GAME_HEIGHT;
    }
    else
        height = MAX_GAME_HEIGHT;
    game = new Phaser.Game(width, height, Phaser.AUTO, '', null, false, false);
    game.state.add('boot', bootState);
    game.state.add('loader', loaderState);
    game.state.add('menu', menuState);
    game.state.add('game', gameState);
    game.state.start('boot');
};
