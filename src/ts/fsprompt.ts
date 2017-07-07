let fsPromptState = {
    preload: function(){

    },
    create: function(){
        this.prompt = this.createYesNoPrompt('Do you want to switch\nfullscreen mode?', function(){
            game.scale.startFullScreen()
            game.state.start('menu')
        }, function(){
            game.state.start('menu')
        })
    },
    createYesNoPrompt: function(msg, onYes, onNo){
        let o = {}

        o.bg = game.add.sprite(game.width/2, game.height/2, 'prompt_bg')
        o.bg.anchor.setTo(.5)

        o.text = game.add.bitmapText(game.width/2, game.height/2 - 30, 'zorque_32px_pink', msg, 16)
        o.text.anchor.setTo(.5)
        o.text.align = 'center'

        o.yes = {}
        o.yes.bg = game.add.button(game.width/2 - 60, game.height/2 + 30, 'white_button_bg', onYes || function(){})
        o.yes.bg.anchor.setTo(.5)
        o.yes.text = game.add.bitmapText(o.yes.bg.x, o.yes.bg.y - 4, 'zorque_32px_pink', 'Yes', 16)
        o.yes.text.anchor.setTo(.5)
        o.yes.text.align = 'center'

        o.no = {}
        o.no.bg = game.add.button(game.width/2 + 60, game.height/2 + 30, 'white_button_bg', onNo || function(){})
        o.no.bg.anchor.setTo(.5)
        o.no.text = game.add.bitmapText(o.no.bg.x, o.no.bg.y - 4, 'zorque_32px_pink', 'No', 16)
        o.no.text.anchor.setTo(.5)
        o.no.text.align = 'center'

        return o
    }
}
