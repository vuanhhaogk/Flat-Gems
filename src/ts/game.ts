let gameState = {
    preload: function(){

    },
    create: function(){
        //  game size
        let game_bg = game.add.sprite(game.width/2, game.height/2, 'game_bg')
        game_bg.anchor.setTo(.5)

        let padding_lr = (game.width - game_bg.width)/2
        let padding_tb = (game.height - game_bg.height)/2

        // tool
        let tools = game.add.group()
        tools.y = padding_tb/2 * 3 + game_bg.height

        let menu_button = game.add.button(game.width/4, 0, 'menu_button', this.menu, this)
        menu_button.anchor.setTo(.5)
        tools.add(menu_button)

        let pp_button = game.add.button(game.width/2, 0, 'pp_button')
        pp_button.anchor.setTo(.5)
        tools.add(pp_button)

        let replay_button = game.add.button(game.width/4 * 3, 0, 'replay_button', this.replay, this)
        replay_button.anchor.setTo(.5)
        tools.add(replay_button)

        //  info
        let info = game.add.group()
        info.y = padding_tb/2 - FONT_SIZE/4 * 3

        info.add(game.add.bitmapText(padding_lr , -FONT_SIZE, 'zorque', 'Score', 36))
        info.add(game.add.bitmapText(padding_lr, FONT_SIZE, 'zorque', 'Time', 36))

        let time_bg = game.add.sprite(padding_lr + game_bg.width, FONT_SIZE, 'loader_bg')
        time_bg.anchor.setTo(1, 0)
        info.add(time_bg)
        this.time_br = game.add.sprite(0, 0, 'loader_br')
        this.time_br.y = FONT_SIZE + (time_bg.height - this.time_br.height)/2
        this.time_br.x = padding_lr + game_bg.width - (time_bg.width - this.time_br.width)/2
        this.time_br.anchor.setTo(1, 0)
        info.add(this.time_br)
        let time_crop = new Phaser.Rectangle(0, 0, this.time_br.width, this.time_br.height)
        let tw = game.add.tween(time_crop)
        tw.to({x: this.time_br.width}, 100000, Phaser.Easing.Linear.None, true)
        this.time_br.crop(time_crop)

        this.score_text = game.add.bitmapText(padding_lr + game_bg.width, -FONT_SIZE, 'zorque', '0', 36)
        this.score_text.anchor.setTo(1, 0)
        this.score = 0
        info.add(this.score_text)

        // gems
        let list = ['red', 'green', 'blue', 'yellow', 'orange']
        let gems = game.add.group()
        gems.x = padding_lr + (game_bg.width - GRID_SIZE * (GEM_SIZE + GEM_PADDING))/2
        gems.y = padding_tb + (game_bg.height - GRID_SIZE * (GEM_SIZE + GEM_PADDING))/2
        this.gems = gems

        this.grid = []

        for (let i = 0; i < GRID_SIZE; i++){
            this.grid[i] = []
            for (let j = 0; j < GRID_SIZE; j++){
                let type = list[Math.floor(Math.random() * list.length)]
                let pos = this.getGemPos(i, j)
                let gem = game.add.button(pos.x, pos.y, `${type}_gem`, this.selectGem, this)
                gem.anchor.setTo(.5)
                gem.row = i
                gem.col = j
                gem.gem_type = type
                this.grid[i][j] = gem
                gems.add(gem)
            }
        }

        this.grid_width = GRID_SIZE
    },
    getGemPos: function(row, col){
        return {
            x: col * (GEM_SIZE + GEM_PADDING) + GEM_SIZE/2,
            y: row * (GEM_SIZE + GEM_PADDING) + GEM_SIZE/2
        }
    },
    searchGem: function(row, col){
        let gem = this.grid[row][col]
        let type = gem.gem_type
        let queue = [{row, col}]
        let is_search = []
        for (let i = 0; i < GRID_SIZE; i++){
            is_search[i] = []
            for (let j = 0; j < GRID_SIZE; j++){
                is_search[i][j] = false
            }
        }
        let rel = []

        while (queue.length > 0){
            let item = queue.shift()

            if (is_search[item.row][item.col])
                continue

            is_search[item.row][item.col] = true

            let gem = this.grid[item.row][item.col]
            if (gem == null || gem.gem_type !== type)
                continue

            rel.push(item)

            if (item.row - 1 >= 0){
                queue.push({row: item.row - 1, col: item.col})
            }
            if (item.row + 1 < GRID_SIZE){
                queue.push({row: item.row + 1, col: item.col})
            }
            if (item.col - 1 >= 0){
                queue.push({row: item.row, col: item.col - 1})
            }
            if (item.col + 1 < GRID_SIZE){
                queue.push({row: item.row, col: item.col + 1})
            }
        }
        return rel
    },
    selectGem: function(gem){
        if (this.moving)
            return
        // search gem
        let gr = this.searchGem(gem.row, gem.col)
        if (gr.length < 0) // default is 3
            return

        // remove gem
        this.score += Math.pow(gr.length, 2)
        this.score_text.text = this.score
        for (let {row, col} of gr){
            let item = this.grid[row][col]
            this.grid[row][col] = null
            let tw = game.add.tween(item)
            tw.to({alpha: 0}, 100, Phaser.Easing.Linear.None)
            tw.onComplete.add(() => item.kill())
            tw.start()
            game.add.tween(item.scale).to({x: 0, y: 0}, 100, Phaser.Easing.Linear.None, true)
        }

        // collapse gem vertical
        let best_time = 0
        this.moving = true
        for (let i = GRID_SIZE - 1; i > 0; i--){
            for (let j = 0; j < GRID_SIZE; j++){
                if (this.grid[i][j] == null){
                    let k = i
                    while (k > 0 && this.grid[k - 1][j] == null) k--
                    if (k == 0)
                        continue
                    let time = this.moveGem(k - 1, j, i, j)
                    if (time > best_time)
                        best_time = time
                }
            }
        }

        // collapse gem horizontal
        let j = 0
        let old_grid_width = this.grid_width
        while (j < this.grid_width){
            let check = true
            for (let i = 0; i < GRID_SIZE; i++)
                if (this.grid[i][j] !== null){
                    check = false
                    break
                }
            if (check){
                for (let fr = 0; fr < GRID_SIZE; fr++){
                    for (let fc = j + 1; fc < this.grid_width; fc++){
                        let time = this.moveGem(fr, fc, fr, fc - 1)
                        if (time > best_time)
                            best_time = time
                    }
                }
                this.grid_width--
            } else {
                j++
            }
        }

        // center grid gem
        if (best_time < 100)
            best_time = 100
        if (old_grid_width !== this.grid_width){
            let next_pivot_x = this.gems.pivot.x - (old_grid_width - this.grid_width) * (GEM_SIZE + GEM_PADDING)/2
            game.add.tween(this.gems.pivot).to({x: next_pivot_x}, 100, Phaser.Easing.Linear.None, true)
        }
        setTimeout(() => {
            this.moving = false
        }, best_time)
    },
    moveGem: function(fr, fc, tr, tc){
        if (!this.grid[fr][fc])
            return 0
        this.grid[tr][tc] = this.grid[fr][fc]
        this.grid[fr][fc] = null
        let item = this.grid[tr][tc]
        item.row = tr
        item.col = tc

        let length = Math.sqrt(Math.pow(fr - tr, 2) + Math.pow(fc - tc, 2))
        let pos = this.getGemPos(tr, tc)
        game.add.tween(item).to(pos, 100 * length, Phaser.Easing.Linear.None, true)
        return length * 100
    },
    update: function(){
        this.time_br.updateCrop()
    },
    menu: function(){
        game.state.start('menu')
    },
    replay: function(){
        game.state.start('game')
    }
}
