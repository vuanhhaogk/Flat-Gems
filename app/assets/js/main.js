var MAX_GAME_HEIGHT = 640;
var MIN_GAME_HEIGHT = 480;
var GAME_WIDTH = 360;
var game;
var bootState = {
    preload: function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.load.image('test_screen', 'assets/images/test_screen.png');
        game.load.bitmapFont('zorque-32px-white', 'assets/images/zorque-32px-white.png', 'assets/images/zorque-32px-white.xml');
        game.load.bitmapFont('zorque-32px-pink', 'assets/images/zorque-32px-pink.png', 'assets/images/zorque-32px-pink.xml');
        game.load.image('test_button', 'assets/images/test_button.png');
    },
    create: function () {
        var bg = game.add.sprite(0, 0, 'test_screen');
        bg.anchor.setTo(.5);
        bg.x = game.width / 2;
        bg.y = game.height / 2;
        game.add.bitmapText(100, 140, 'zorque-32px-white', game.width + "x" + game.height, 32);
        game.add.bitmapText(100, 180, 'zorque-32px-white', 'Bitmap Fonts!', 18);
        game.add.bitmapText(100, 260, 'zorque-32px-pink', 'Bitmap Fonts!', 32);
        game.add.bitmapText(100, 300, 'zorque-32px-pink', 'Bitmap Fonts!', 18);
        game.add.button(100, 400, 'test_button', function () {
            game.scale.startFullScreen();
        });
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
            height = MAX_GAME_HEIGHT;
    }
    else
        height = MAX_GAME_HEIGHT;
    game = new Phaser.Game(width, height);
    game.state.add('boot', bootState);
    game.state.add('loader', loaderState);
    game.state.add('game', gameState);
    game.state.start('boot');
};
