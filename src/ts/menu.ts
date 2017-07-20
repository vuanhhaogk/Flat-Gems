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

        let menu_about = game.add.button(0, FONT_SIZE * 2, 'menu_about', this.about, this)
        menu_about.anchor.setTo(.5)
        menu.add(menu_about)
        menu_about.x = game.width/4
        menu_about.alpha = 0

        if (localStorage.getItem('plat_gems.current_level')){
            let menu_continue = game.add.button(0, FONT_SIZE * 2, 'menu_continue', this.continue, this)
            menu_continue.anchor.setTo(.5)
            menu.add(menu_continue)
            menu_continue.x = game.width/4
            menu_continue.alpha = 0
            game.add.tween(menu_continue).to({x: 0, alpha: 1}, 300, Phaser.Easing.Linear.None, true)

            menu_about.y = FONT_SIZE * 4
            menu_about.x = -game.width/4
        }

        game.add.tween(menu_about).to({x: 0, alpha: 1}, 300, Phaser.Easing.Linear.None, true)
    },
    newgame: function(){
        if (this.popup_showed)
            return

        game.memory.current_level = 0
        game.memory.score = 0
        game.memory.history = []
        game.state.start('game')
    },
    continue: function(){
        if (this.popup_showed)
            return

        game.memory.current_level = parseInt(localStorage.getItem('plat_gems.current_level') || '0')
        game.memory.score = parseInt(localStorage.getItem('plat_gems.score') || '0')
        game.memory.history = []
        game.state.start('game')
    },
    about: function(){
        if (this.popup_showed)
            return
        
        let gr = game.add.group()
        gr.x = game.width/2
        gr.y = game.height/2

        let s = game.add.sprite(0, 0, 'popup_bg_1')
        s.anchor.setTo(.5)
        gr.add(s)

        s = game.add.sprite(0, 0, 'popup_bg_2')
        s.anchor.setTo(.5)
        gr.add(s)

        let text = ['About', '', 'Vu Anh Hao', 'https://vuanhhaogk.github.io', 'Copyright 2017']

        for (let i = 0; i < text.length; i++){
            let t = text[i]

            let s = game.add.bitmapText(0, i * FONT_SIZE - text.length * FONT_SIZE/2 - FONT_SIZE * 1.2, 'zorque', t, FONT_SIZE)
            s.anchor.setTo(.5)
            gr.add(s)
        }

        let bt = game.add.button(0, (text.length + 1) * FONT_SIZE / 2, 'close_button', () => {
            if (!this.popup_showed)
                return

            this.popup_showed = false

            game.add.tween(gr).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true)
            game.add.tween(gr.scale).to({x: 0.8, y: 0.8}, 100, Phaser.Easing.Linear.None, true)

            setTimeout(() => gr.destroy(), 100)
        }, this)
        bt.anchor.setTo(.5)
        gr.add(bt)

        this.popup_showed = true
        gr.alpha = 0
        gr.scale.setTo(.8)
        game.add.tween(gr).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true)
        game.add.tween(gr.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.None, true)
    }
}
