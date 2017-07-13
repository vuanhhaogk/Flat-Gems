let gameState = {
    preload: function(){

    },
    create: function(){
        game.add.sprite(game.width/2, game.height/2, 'game_bg').anchor.setTo(.5)

        let tools = game.add.group()
        tools.y = game.height/8 * 7

        let menu_button = game.add.button(game.width/4, 0, 'menu_button', this.menu, this)
        menu_button.anchor.setTo(.5)
        tools.add(menu_button)

        let pp_button = game.add.button(game.width/2, 0, 'pp_button')
        pp_button.anchor.setTo(.5)
        tools.add(pp_button)

        let replay_button = game.add.button(game.width/4 * 3, 0, 'replay_button')
        replay_button.anchor.setTo(.5)
        tools.add(replay_button)

        let info = game.add.group()
        info.y = game.height/9

        info.add(game.add.bitmapText(24, -18, 'zorque', 'Score', 36))
        info.add(game.add.bitmapText(24, 18, 'zorque', 'Time', 36))

        let time_bg = game.add.sprite(game.width - 24, 18, 'loader_bg')
        time_bg.anchor.setTo(1, 0)
        info.add(time_bg)
        this.time_br = game.add.sprite(game.width - 32, 27, 'loader_br')
        this.time_br.anchor.setTo(1, 0)
        info.add(this.time_br)
        let time_crop = new Phaser.Rectangle(0, 0, this.time_br.width, this.time_br.height)
        let tw = game.add.tween(time_crop).to({x: this.time_br.width}, 10000, Phaser.Easing.Linear.None, true)
        this.time_br.crop(time_crop)

        let score_text = game.add.bitmapText(game.width - 24, -18, 'zorque', '0', 36)
        score_text.anchor.setTo(1, 0)
        info.add(score_text)

    },
    update: function(){
        this.time_br.updateCrop()
    },
    menu: function(){
        game.state.start('menu')
    }
}
