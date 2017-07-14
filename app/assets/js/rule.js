var Grid = (function () {
    function Grid(w, h, r, o) {
        var mode; // 0: blank, 1: random, 2: template
        var data;
        this.grid = [];
        this.range = r || [1, 2, 3, 4, 5];
        this.width = w || 10;
        this.height = h || 10;
        if (o) {
            if (o === true) {
                mode = 1;
            }
            else if (typeof o === 'object' && o.length) {
                data = o;
                mode = 2;
            }
        }
        else {
            mode = 0;
        }
        for (var i = 0; i < this.height; i++) {
            this.grid[i] = [];
            for (var j = 0; j < this.width; j++)
                switch (mode) {
                    case 1:
                        this.grid[i][j] = this.range[Math.floor(Math.random() * this.range.length)];
                        break;
                    case 2:
                        this.grid[i][j] = data[i][j];
                        break;
                    default:
                        this.grid[i][j] = null;
                        break;
                }
        }
    }
    Grid.prototype.print = function (ruler) {
        var s = '';
        var w;
        if (ruler) {
            s += ' |';
            for (var i = 0; i < this.width; i++)
                s += " " + i + " |";
            s += '\n';
            w = s.length - 1;
            for (var i = 0; i < w; i++)
                s += '-';
            s += '\n';
        }
        for (var i = 0; i < this.height; i++) {
            if (ruler)
                s += i + "|";
            for (var j = 0; j < this.width; j++)
                if (ruler)
                    s += " " + (this.grid[i][j] || ' ') + " |";
                else
                    s += (this.grid[i][j] || ' ') + " ";
            s += '\n';
            if (ruler) {
                for (var i_1 = 0; i_1 < w; i_1++)
                    s += '-';
                s += '\n';
            }
        }
        console.log(s);
    };
    Grid.prototype.detect = function (r, c) {
        var type = this.grid[r][c];
        if (!type)
            return [];
        var queue = [{ r: r, c: c }];
        var is_search = [];
        for (var i = 0; i < this.height; i++) {
            is_search[i] = [];
            for (var j = 0; j < this.width; j++) {
                is_search[i][j] = false;
            }
        }
        var rel = [];
        while (queue.length > 0) {
            var item = queue.shift();
            if (is_search[item.r][item.c])
                continue;
            is_search[item.r][item.c] = true;
            var itype = this.grid[item.r][item.c];
            if (itype !== type)
                continue;
            rel.push(item);
            if (item.r - 1 >= 0) {
                queue.push({ r: item.r - 1, c: item.c });
            }
            if (item.r + 1 < this.height) {
                queue.push({ r: item.r + 1, c: item.c });
            }
            if (item.c - 1 >= 0) {
                queue.push({ r: item.r, c: item.c - 1 });
            }
            if (item.c + 1 < this.width) {
                queue.push({ r: item.r, c: item.c + 1 });
            }
        }
        return rel;
    };
    Grid.prototype.kill = function (ls) {
        for (var _i = 0, ls_1 = ls; _i < ls_1.length; _i++) {
            var item = ls_1[_i];
            this.grid[item.r][item.c] = null;
        }
    };
    Grid.prototype.update = function () {
        var moves = [];
        for (var i = 0; i < this.height; i++) {
            moves[i] = [];
            for (var j_1 = 0; j_1 < this.width; j_1++)
                moves[i][j_1] = { r: i, c: j_1 };
        }
        // collapse gem vertical
        for (var i = this.height - 1; i > 0; i--) {
            for (var j_2 = 0; j_2 < this.width; j_2++) {
                if (this.grid[i][j_2] == null) {
                    var k = i;
                    while (k > 0 && this.grid[k - 1][j_2] == null)
                        k--;
                    if (k == 0)
                        continue;
                    moves[i][j_2] = moves[k - 1][j_2];
                    moves[k - 1][j_2] = null;
                    this.grid[i][j_2] = this.grid[k - 1][j_2];
                    this.grid[k - 1][j_2] = null;
                }
            }
        }
        // collapse gem horizontal
        var j = 0;
        while (j < this.width) {
            var check = true;
            for (var i = 0; i < this.height; i++)
                if (this.grid[i][j] !== null) {
                    check = false;
                    break;
                }
            if (check) {
                for (var fr = 0; fr < this.height; fr++) {
                    for (var fc = j + 1; fc < this.width; fc++) {
                        if (!this.grid[fr][fc])
                            continue;
                        moves[fr][fc - 1] = moves[fr][fc];
                        moves[fr][fc] = null;
                        this.grid[fr][fc - 1] = this.grid[fr][fc];
                        this.grid[fr][fc] = null;
                    }
                }
                this.width--;
            }
            else {
                j++;
            }
        }
        var rel = [];
        for (var i = 0; i < this.height; i++)
            for (var j_3 = 0; j_3 < this.width; j_3++) {
                var item = moves[i][j_3];
                if (item && (item.r !== i || item.c !== j_3)) {
                    rel.push({ fr: item.r, fc: item.c, tr: i, tc: j_3 });
                }
            }
        return rel;
    };
    return Grid;
})();
try {
    module.exports = Grid;
}
catch (e) { }
