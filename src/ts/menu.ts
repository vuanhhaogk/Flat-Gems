let menuState = {
    preload: function(){

    },
    create: function(){
        game.add.sprite(0, 0, 'menu_bg')

        let title = game.add.sprite(game.width/2, game.height/3, 'title')
        title.anchor.setTo(.5)
        title.scale.setTo(1, 0)
        title.alpha = 0
        game.add.tween(title.scale).to({x: 1, y: 1}, 300, Phaser.Easing.Linear.None, true)
        game.add.tween(title).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true)

        let menu = game.add.group()
        menu.x = game.width/2
        menu.y = game.height/2

        let menu_newgame = game.add.button(0, 0, 'menu_newgame', this.newgame, this)
        menu_newgame.anchor.setTo(.5)
        menu.add(menu_newgame)
        menu_newgame.x = -game.width/4
        menu_newgame.alpha = 0
        game.add.tween(menu_newgame).to({x: 0, alpha: 1}, 300, Phaser.Easing.Linear.None, true)

        let menu_help = game.add.button(0, FONT_SIZE * 2, 'menu_help', this.help, this)
        menu_help.anchor.setTo(.5)
        menu.add(menu_help)
        menu_help.x = game.width/4
        menu_help.alpha = 0

        if (localStorage.getItem('plat_gem_continue_data')){
            let menu_continue = game.add.button(0, FONT_SIZE * 2, 'menu_continue', this.continue, this)
            menu_continue.anchor.setTo(.5)
            menu.add(menu_continue)
            menu_continue.x = game.width/4
            menu_continue.alpha = 0
            game.add.tween(menu_continue).to({x: 0, alpha: 1}, 300, Phaser.Easing.Linear.None, true)

            menu_help.y = FONT_SIZE * 4
            menu_help.x = -game.width/4
        }

        game.add.tween(menu_help).to({x: 0, alpha: 1}, 300, Phaser.Easing.Linear.None, true)
    },
    newgame: function(){
        game.state.start('game')
    },
    continue: function(){

    },
    help: function(){

    }
}
