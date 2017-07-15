let Grid = (() => {

function Grid(w, h, r, o){
    let mode // 0: blank, 1: random, 2: template
    let data

    this.grid = []

    this.range = r || [1, 2, 3, 4, 5]
    this.width = w || 10
    this.height = h || 10

    this.count = 0

    if (o){
        if (o === true){
            mode = 1
        } else if (typeof o === 'object' && o.length){
            data = o
            mode = 2
        }
    } else {
        mode = 0
    }

    for (let i = 0; i < this.height; i++){
        this.grid[i] = []
        for (let j = 0; j < this.width; j++)
            switch (mode){
                case 1:
                    this.grid[i][j] = this.range[Math.floor(Math.random() * this.range.length)]
                    this.count++
                    break;
                case 2:
                    this.grid[i][j] = data[i] ? data[i][j] || null : null
                    if (this.grid[i][j])
                        this.count++
                    break
                default:
                    this.grid[i][j] = null
                    break
            }
    }
}

Grid.prototype.print = function(ruler){
    let s = ''
    let w
    if (ruler){
        s += ' |'
        for (let i = 0; i < this.width; i++)
            s += ` ${i} |`
        s += '\n'
        w = s.length - 1
        for (let i = 0; i < w; i++)
            s +='-'
        s += '\n'
    }

    for (let i = 0; i < this.height; i++){
        if (ruler)
            s += `${i}|`
        for (let j = 0; j < this.width; j++)
            if (ruler)
                s += ` ${this.grid[i][j] || ' '} |`
            else
                s += `${this.grid[i][j] || ' '} `
        s += '\n'
        if (ruler){
            for (let i = 0; i < w; i++)
                s +='-'
            s += '\n'
        }
    }

    console.log(s)
}

Grid.prototype.detect = function(r, c){
    let type = this.grid[r][c]

    if (!type)
        return []

    let queue = [{r, c}]
    let is_search = []
    for (let i = 0; i < this.height; i++){
        is_search[i] = []
        for (let j = 0; j < this.width; j++){
            is_search[i][j] = false
        }
    }
    let rel = []

    while (queue.length > 0){
        let item = queue.shift()
        if (is_search[item.r][item.c])
            continue

        is_search[item.r][item.c] = true

        let itype = this.grid[item.r][item.c]
        if (itype !== type)
            continue

        rel.push(item)

        if (item.r - 1 >= 0){
            queue.push({r: item.r - 1, c: item.c})
        }
        if (item.r + 1 < this.height){
            queue.push({r: item.r + 1, c: item.c})
        }
        if (item.c - 1 >= 0){
            queue.push({r: item.r, c: item.c - 1})
        }
        if (item.c + 1 < this.width){
            queue.push({r: item.r, c: item.c + 1})
        }
    }
    return rel
}

Grid.prototype.kill = function(ls){
    this.count -= ls.length
    for (let item of ls){
        this.grid[item.r][item.c] = null
    }
}

Grid.prototype.update = function(){
    let moves = []
    for (let i = 0; i < this.height; i++){
        moves[i] = []
        for (let j = 0; j < this.width; j++)
            moves[i][j] = { r: i, c: j}
    }
    // collapse gem vertical
    for (let i = this.height - 1; i > 0; i--){
        for (let j = 0; j < this.width; j++){
            if (this.grid[i][j] == null){
                let k = i
                while (k > 0 && this.grid[k - 1][j] == null) k--
                if (k == 0)
                    continue
                moves[i][j] = moves[k - 1][j]
                moves[k - 1][j] = null
                this.grid[i][j] = this.grid[k - 1][j]
                this.grid[k - 1][j] = null
            }
        }
    }

    // collapse gem horizontal
    let j = 0
    while (j < this.width){
        let check = true
        for (let i = 0; i < this.height; i++)
            if (this.grid[i][j] !== null){
                check = false
                break
            }
        if (check){
            for (let fr = 0; fr < this.height; fr++){
                for (let fc = j + 1; fc < this.width; fc++){
                    if (!this.grid[fr][fc])
                        continue
                    moves[fr][fc - 1] = moves[fr][fc]
                    moves[fr][fc] = null
                    this.grid[fr][fc - 1] = this.grid[fr][fc]
                    this.grid[fr][fc] = null
                }
            }
            this.width--
        } else {
            j++
        }
    }

    let rel = []

    for (let i = 0; i < this.height; i++)
        for (let j = 0; j < this.width; j++){
            let item = moves[i][j]
            if (item && (item.r !== i || item.c !== j)){
                rel.push({fr: item.r, fc: item.c, tr: i, tc: j})
            }
        }

    return rel
}

Grid.prototype.get = function(r, c){
    return this.grid[r][c]
}

return Grid

})()

try {
    module.exports = Grid
} catch(e){}
