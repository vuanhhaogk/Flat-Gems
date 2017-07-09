var menuState = {
    preload: function () {
    },
    create: function () {
        var title = game.add.sprite(game.width / 2, game.height / 3, 'title');
        title.anchor.setTo(.5);
        title.scale.setTo(1, 0);
        title.alpha = 0;
        game.add.tween(title.scale).to({ x: 1, y: 1 }, 300, Phaser.Easing.Linear.None, true);
        game.add.tween(title).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);
        var menu = game.add.group();
        menu.x = game.width / 2;
        menu.y = game.height / 2 + 30;
        var menu_newgame = game.add.button(0, 0, 'menu_newgame', this.newgame, this);
        menu_newgame.anchor.setTo(.5);
        menu.add(menu_newgame);
        menu_newgame.x = -100;
        menu_newgame.alpha = 0;
        game.add.tween(menu_newgame).to({ x: 0, alpha: 1 }, 300, Phaser.Easing.Linear.None, true);
        var menu_help = game.add.button(0, 36, 'menu_help', this.help, this);
        menu_help.anchor.setTo(.5);
        menu.add(menu_help);
        menu_help.x = 100;
        menu_help.alpha = 0;
        if (localStorage.getItem('plat_gem_continue_data')) {
            var menu_continue = game.add.button(0, 36, 'menu_continue', this["continue"], this);
            menu_continue.anchor.setTo(.5);
            menu.add(menu_continue);
            menu_continue.x = 100;
            menu_continue.alpha = 0;
            game.add.tween(menu_continue).to({ x: 0, alpha: 1 }, 300, Phaser.Easing.Linear.None, true);
            menu_help.y = 72;
            menu_help.x = -100;
        }
        game.add.tween(menu_help).to({ x: 0, alpha: 1 }, 300, Phaser.Easing.Linear.None, true);
    },
    newgame: function () {
    },
    "continue": function () {
    },
    help: function () {
    }
};
