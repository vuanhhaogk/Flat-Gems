var loaderState = {
    preload: function () {
        var bg = game.add.sprite(game.width / 2, game.height / 2, 'loader_bg');
        bg.anchor.setTo(.5);
        var br = game.add.sprite(game.width / 2, game.height / 2, 'loader_br');
        br.anchor.y = .5;
        br.x = (game.width - br.width) / 2;
        game.load.setPreloadSprite(br);
        game.load.bitmapFont('zorque', 'assets/images/zorque.png', 'assets/images/zorque.xml');
        game.load.bitmapFont('zorque_pink', 'assets/images/zorque_pink.png', 'assets/images/zorque_pink.xml');
        game.load.image('title', 'assets/images/title.png');
        game.load.image('menu_newgame', 'assets/images/menu_newgame.png');
        game.load.image('menu_continue', 'assets/images/menu_continue.png');
        game.load.image('menu_help', 'assets/images/menu_help.png');
        game.load.image('menu_button', 'assets/images/menu_button.png');
        game.load.image('replay_button', 'assets/images/replay_button.png');
        game.load.spritesheet('pp_button', 'assets/images/play_pause_button.png', 80, 80);
        game.load.image('yes_button', 'assets/images/yes_button.png');
        game.load.image('no_button', 'assets/images/no_button.png');
        game.load.image('red_gem', 'assets/images/red_gem.png');
        game.load.image('blue_gem', 'assets/images/blue_gem.png');
        game.load.image('green_gem', 'assets/images/green_gem.png');
        game.load.image('orange_gem', 'assets/images/orange_gem.png');
        game.load.image('yellow_gem', 'assets/images/yellow_gem.png');
        game.load.image('gray_gem', 'assets/images/gray_gem.png');
        game.load.image('game_bg', 'assets/images/game_bg.png');
        game.load.image('menu_bg', 'assets/images/menu_bg.png');
        game.load.image('next_level_bg', 'assets/images/next_level_bg.png');
        game.load.image('popup_bg_1', 'assets/images/popup_bg_1.png');
        game.load.image('popup_bg_2', 'assets/images/popup_bg_2.png');
        game.load.json('levels', 'assets/data/levels.json');
    },
    create: function () {
        game.state.start('menu');
    }
};
