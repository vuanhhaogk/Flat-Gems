var gameState = {
    preload: function () {
    },
    create: function () {
        var _this = this;
        // load level
        var levels = game.cache.getJSON('levels');
        var data = levels[game.memory.current_level];
        //  game size
        var game_bg = game.add.sprite(game.width / 2, game.height / 2, 'game_bg');
        game_bg.anchor.setTo(.5);
        var padding_lr = (game.width - game_bg.width) / 2;
        var padding_tb = (game.height - game_bg.height) / 2;
        // tool
        var tools = game.add.group();
        tools.y = padding_tb / 2 * 3 + game_bg.height;
        var menu_button = game.add.button(game.width / 4, 0, 'menu_button', this.menu, this);
        menu_button.anchor.setTo(.5);
        tools.add(menu_button);
        var pp_button = game.add.button(game.width / 2, 0, 'pp_button');
        pp_button.anchor.setTo(.5);
        tools.add(pp_button);
        var replay_button = game.add.button(game.width / 4 * 3, 0, 'replay_button', this.replay, this);
        replay_button.anchor.setTo(.5);
        tools.add(replay_button);
        //  info
        var info = game.add.group();
        info.y = padding_tb / 2 - FONT_SIZE / 4 * 3;
        info.add(game.add.bitmapText(padding_lr, -FONT_SIZE, 'zorque', 'Score', FONT_SIZE));
        info.add(game.add.bitmapText(padding_lr, FONT_SIZE, 'zorque', 'Time', FONT_SIZE));
        var time_bg = game.add.sprite(padding_lr + game_bg.width, FONT_SIZE, 'loader_bg');
        time_bg.anchor.setTo(1, 0);
        info.add(time_bg);
        this.time_br = game.add.sprite(0, 0, 'loader_br');
        this.time_br.y = FONT_SIZE + (time_bg.height - this.time_br.height) / 2;
        this.time_br.x = padding_lr + game_bg.width - (time_bg.width - this.time_br.width) / 2;
        this.time_br.anchor.setTo(1, 0);
        info.add(this.time_br);
        var time_crop = new Phaser.Rectangle(0, 0, this.time_br.width, this.time_br.height);
        var tw = game.add.tween(time_crop);
        tw.to({ x: this.time_br.width }, data.time, Phaser.Easing.Linear.None, true);
        this.time_br.crop(time_crop);
        this.score = game.memory.score;
        this.score_text = game.add.bitmapText(padding_lr + game_bg.width, -FONT_SIZE, 'zorque', "" + this.score, FONT_SIZE);
        this.score_text.anchor.setTo(1, 0);
        info.add(this.score_text);
        // map
        this.gems = game.add.group();
        this.gems.x = padding_lr + (game_bg.width - GRID_SIZE * (GEM_SIZE + GEM_PADDING)) / 2;
        this.gems.y = padding_tb + (game_bg.height - GRID_SIZE * (GEM_SIZE + GEM_PADDING)) / 2;
        this.gems.visible = false;
        this.createGrid(data.map);
        // gray gem grid
        this.gray_grid = game.add.group();
        this.gray_grid.x = this.gems.x;
        this.gray_grid.y = this.gems.y;
        for (var i = 0; i < GRID_SIZE; i++)
            for (var j = 0; j < GRID_SIZE; j++) {
                var p = this.getGemPos(i, j);
                var gem = this.gray_grid.create(p.x, p.y, 'gray_gem');
                gem.anchor.setTo(.5);
            }
        // level notice
        var level_prompt = game.add.group();
        level_prompt.create(0, 0, 'next_level_bg').anchor.setTo(.5);
        var level_text = game.add.bitmapText(0, -FONT_SIZE / 3, 'zorque_pink', "Level " + (game.memory.current_level + 1), FONT_SIZE);
        level_text.anchor.setTo(.5);
        level_prompt.add(level_text);
        level_prompt.x = game.width / 2;
        level_prompt.y = game.height / 2;
        var ltween = game.add.tween(level_prompt.scale);
        ltween.to({ x: 1.5, y: 0 }, 100);
        ltween.onComplete.add(function () {
            var tw = game.add.tween(_this.gray_grid);
            tw.to({ alpha: 0 }, 100);
            tw.start(0);
            _this.gems.visible = true;
        });
        setTimeout(function () {
            ltween.start();
        }, 1000);
    },
    createGrid: function (data) {
        var width = data[0].length;
        this.grid = new Grid(width, GRID_SIZE, [1, 2, 3, 4, 5], data);
        this.grid.update();
        this.rule = [];
        var def = ['red', 'green', 'blue', 'yellow', 'orange'];
        // random rule
        while (def.length > 0) {
            var p = Math.floor(Math.random() * def.length);
            this.rule.push(def[p]);
            def.splice(p, 1);
        }
        for (var i = 0; i < this.grid.height; i++) {
            for (var j = 0; j < this.grid.width; j++) {
                var type = this.rule[this.grid.get(i, j) - 1];
                if (!type)
                    continue;
                var pos = this.getGemPos(i, j);
                var gem = game.add.button(pos.x, pos.y, type + "_gem", this.selectGem, this);
                gem.anchor.setTo(.5);
                gem.r = i;
                gem.c = j;
                this.gems.add(gem);
            }
        }
        this.updateGridPos(true);
    },
    getGemPos: function (r, c) {
        return {
            x: c * (GEM_SIZE + GEM_PADDING) + GEM_SIZE / 2,
            y: r * (GEM_SIZE + GEM_PADDING) + GEM_SIZE / 2
        };
    },
    updateGridPos: function (not_tween) {
        var pivot_x = (this.grid.width - GRID_SIZE) * (GEM_SIZE + GEM_PADDING) / 2;
        if (not_tween)
            this.gems.pivot.x = pivot_x;
        else
            game.add.tween(this.gems.pivot).to({ x: pivot_x }, 100, Phaser.Easing.Linear.None, true);
    },
    selectGem: function (gem) {
        var _this = this;
        if (this.moving)
            return;
        // search gem
        var ls = this.grid.detect(gem.r, gem.c);
        if (ls.length < 3)
            return;
        this.moving = true;
        // remove gem
        this.updateScore(ls.length);
        this.grid.kill(ls);
        for (var j = 0; j < ls.length; j++)
            this.removeGem(this.searchGem(ls[j].r, ls[j].c));
        // update gem
        var moves = this.grid.update().reverse();
        var ltime = 100;
        for (var i = 0; i < moves.length; i++) {
            var time = this.moveGem(moves[i].fr, moves[i].fc, moves[i].tr, moves[i].tc);
            if (time > ltime) {
                ltime = time;
            }
        }
        if (this.grid.count > 0)
            this.updateGridPos();
        setTimeout(function () {
            _this.moving = false;
            if (_this.grid.count == 0) {
                _this.nextLevel();
            }
        }, ltime);
    },
    updateScore: function (p) {
        this.score += p * (p - 2);
        this.score_text.text = this.score;
    },
    searchGem: function (r, c) {
        for (var i = 0; i < this.gems.children.length; i++) {
            var gem = this.gems.children[i];
            if (gem.r == r && gem.c == c)
                return gem;
        }
        return null;
    },
    moveGem: function (fr, fc, tr, tc) {
        var item = this.searchGem(fr, fc);
        item.r = tr;
        item.c = tc;
        var length = Math.sqrt(Math.pow(fr - tr, 2) + Math.pow(fc - tc, 2));
        var pos = this.getGemPos(tr, tc);
        game.add.tween(item).to(pos, 100 * length, Phaser.Easing.Linear.None, true);
        return length * 100;
    },
    removeGem: function (gem) {
        game.add.tween(gem).to({ alpha: 0 }, 100, Phaser.Easing.Linear.None, true);
        game.add.tween(gem.scale).to({ x: 0, y: 0 }, 100, Phaser.Easing.Linear.None, true);
        setTimeout(function () {
            gem.destroy();
        }, 100);
    },
    update: function () {
        this.time_br.updateCrop();
    },
    menu: function () {
        game.state.start('menu');
    },
    replay: function () {
        game.state.start('game');
    },
    nextLevel: function () {
        game.memory.score = this.score;
        game.memory.current_level++;
        localStorage.setItem('plat_gems.current_level', game.memory.current_level);
        localStorage.setItem('plat_gems.score', game.memory.score);
        if (game.memory.current_level < game.cache.getJSON('levels').length) {
            game.state.start('game');
            return;
        }
        // show congratulation prompt and show high score
        console.log('Congratulation!');
    }
};
