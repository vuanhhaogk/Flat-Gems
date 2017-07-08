var loaderState = {
    preload: function () {
        var bg = game.add.sprite(game.width / 2, game.height / 2, 'loader_bg');
        bg.anchor.setTo(.5);
        var br = game.add.sprite(game.width / 2, game.height / 2, 'loader_br');
        br.anchor.y = .5;
        br.x = (game.width - br.width) / 2;
        game.load.setPreloadSprite(br);
        game.load.bitmapFont('zorque_32px_white', 'assets/images/zorque_32px_white.png', 'assets/images/zorque_32px_white.xml');
        game.load.bitmapFont('zorque_32px_pink', 'assets/images/zorque_32px_pink.png', 'assets/images/zorque_32px_pink.xml');
        game.load.image('prompt_bg', 'assets/images/prompt_bg.png');
        game.load.image('white_button_bg', 'assets/images/white_button_bg.png');
    },
    create: function () {
        game.state.start('menu');
    }
};
