var gameState = {
    preload: function () {
    },
    create: function () {
        var game_bg = game.add.sprite(game.width / 2, game.height / 2, 'game_bg');
        game_bg.anchor.setTo(.5);
        var padding_lr = (game.width - game_bg.width) / 2;
        var padding_tb = (game.height - game_bg.height) / 2;
        var tools = game.add.group();
        tools.y = padding_tb / 2 * 3 + game_bg.height;
        var menu_button = game.add.button(game.width / 4, 0, 'menu_button', this.menu, this);
        menu_button.anchor.setTo(.5);
        tools.add(menu_button);
        var pp_button = game.add.button(game.width / 2, 0, 'pp_button');
        pp_button.anchor.setTo(.5);
        tools.add(pp_button);
        var replay_button = game.add.button(game.width / 4 * 3, 0, 'replay_button');
        replay_button.anchor.setTo(.5);
        tools.add(replay_button);
        var info = game.add.group();
        info.y = padding_tb / 2 - FONT_SIZE / 4 * 3;
        info.add(game.add.bitmapText(padding_lr, -FONT_SIZE, 'zorque', 'Score', 36));
        info.add(game.add.bitmapText(padding_lr, FONT_SIZE, 'zorque', 'Time', 36));
        var time_bg = game.add.sprite(padding_lr + game_bg.width, FONT_SIZE, 'loader_bg');
        time_bg.anchor.setTo(1, 0);
        info.add(time_bg);
        this.time_br = game.add.sprite(0, 0, 'loader_br');
        this.time_br.y = FONT_SIZE + (time_bg.height - this.time_br.height) / 2;
        this.time_br.x = padding_lr + game_bg.width - (time_bg.width - this.time_br.width) / 2;
        this.time_br.anchor.setTo(1, 0);
        info.add(this.time_br);
        var time_crop = new Phaser.Rectangle(0, 0, this.time_br.width, this.time_br.height);
        var tw = game.add.tween(time_crop).to({ x: this.time_br.width }, 10000, Phaser.Easing.Linear.None, true);
        this.time_br.crop(time_crop);
        var score_text = game.add.bitmapText(padding_lr + game_bg.width, -FONT_SIZE, 'zorque', '0', 36);
        score_text.anchor.setTo(1, 0);
        info.add(score_text);
        // gems
        var list = ['red', 'green', 'blue', 'yellow', 'orange'];
        var gems = game.add.group();
        gems.x = padding_lr + (game_bg.width - GRID_SIZE * (GEM_SIZE + GEM_PADDING)) / 2;
        gems.y = padding_tb + (game_bg.height - GRID_SIZE * (GEM_SIZE + GEM_PADDING)) / 2;
        this.grid = [];
        for (var i = 0; i < GRID_SIZE; i++) {
            this.grid[i] = [];
            for (var j = 0; j < GRID_SIZE; j++) {
                var type = list[Math.floor(Math.random() * list.length)];
                var gem = game.add.button(j * (GEM_SIZE + GEM_PADDING), i * (GEM_SIZE + GEM_PADDING), type + "_gem", this.selectGem, this);
                gem.row = i;
                gem.col = j;
                gem.gem_type = type;
                this.grid[i][j] = gem;
                gems.add(gem);
            }
        }
    },
    searchGem: function (row, col) {
        var gem = this.grid[row][col];
        var type = gem.gem_type;
        var queue = [{ row: row, col: col }];
        var is_search = [];
        for (var i = 0; i < GRID_SIZE; i++) {
            is_search[i] = [];
            for (var j = 0; j < GRID_SIZE; j++) {
                is_search[i][j] = false;
            }
        }
        var rel = [];
        while (queue.length > 0) {
            var item = queue.shift();
            if (is_search[item.row][item.col])
                continue;
            is_search[item.row][item.col] = true;
            var gem_1 = this.grid[item.row][item.col];
            if (gem_1 == null || gem_1.gem_type !== type)
                continue;
            rel.push(item);
            if (item.row - 1 >= 0) {
                queue.push({ row: item.row - 1, col: item.col });
            }
            if (item.row + 1 < GRID_SIZE) {
                queue.push({ row: item.row + 1, col: item.col });
            }
            if (item.col - 1 >= 0) {
                queue.push({ row: item.row, col: item.col - 1 });
            }
            if (item.col + 1 < GRID_SIZE) {
                queue.push({ row: item.row, col: item.col + 1 });
            }
        }
        return rel;
    },
    selectGem: function (gem) {
        // search gem
        var gr = this.searchGem(gem.row, gem.col);
        if (gr.length < 0)
            return;
        // remove gem
        for (var _i = 0, gr_1 = gr; _i < gr_1.length; _i++) {
            var _a = gr_1[_i], row = _a.row, col = _a.col;
            var item = this.grid[row][col];
            this.grid[row][col] = null;
            item.kill();
        }
        // collapse gem vertical
        for (var i = GRID_SIZE - 1; i > 0; i--) {
            for (var j = 0; j < GRID_SIZE; j++) {
                if (this.grid[i][j] == null) {
                    var k = i;
                    while (k > 0 && this.grid[k - 1][j] == null)
                        k--;
                    if (k == 0)
                        continue;
                    this.moveGem(k - 1, j, i, j);
                }
            }
        }
        // collapse gem horizontal
        for (var j = 0; j < GRID_SIZE; j++) {
            var check = true;
            for (var i = 0; i < GRID_SIZE; i++)
                if (this.grid[i][j] !== null) {
                    check = false;
                    break;
                }
            if (check) {
                for (var i = 0; i < GRID_SIZE; i++) {
                    var k = j;
                    while (k < GRID_SIZE - 1 && this.grid[i][k + 1] == null)
                        k++;
                    if (k == GRID_SIZE - 1)
                        continue;
                    this.moveGem(i, k + 1, i, j);
                }
            }
        }
    },
    moveGem: function (fr, fc, tr, tc) {
        this.grid[tr][tc] = this.grid[fr][fc];
        this.grid[fr][fc] = null;
        this.grid[tr][tc].row = tr;
        this.grid[tr][tc].col = tc;
        this.grid[tr][tc].y = tr * (GEM_SIZE + GEM_PADDING);
        this.grid[tr][tc].x = tc * (GEM_SIZE + GEM_PADDING);
    },
    update: function () {
        this.time_br.updateCrop();
    },
    menu: function () {
        game.state.start('menu');
    }
};
