/**
 * LawanCorona game by Deka Thomas
*/
class LawanCorona {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.client = this.canvas.getBoundingClientRect();
        this.row = 5;
        this.column = 5;
        this.blocks = [];
        this.gameStat = 'playing';
        this.turn = 'player';
        this.canvas.addEventListener('click', e => this.click(e));
    }

    init() {
        for(let i=0 ; i<this.row ; i++) {
            for(let j=0 ; j<this.column ; j++) {
                this.blocks.push({
                    x: this.canvas.width / this.column * j,
                    y: this.canvas.height / this.row * i,
                    w: this.canvas.width / this.column,
                    h: this.canvas.height / this.row,
                    background: '#F8F8F8',
                    status: null
                })
            }
        }
        this.blocks.map((block, index) => block.index = index)
        requestAnimationFrame(() => this.render())
    }

    render() {
        this.draw();

        if (this.gameStat === 'playing') {
            requestAnimationFrame(() => this.render())
        }
    }

    opponentMove() {
        let availableBlocks =  this.blocks.filter(block => block.status === null)
        let index = Math.floor(Math.random() * availableBlocks.length)

        availableBlocks[index].status = 'opponent'
    }

    playerMove(index) {
        if (this.turn === 'player') {
            if (this.blocks[index].status === null) {
                this.blocks[index].status = 'player';
                this.turn = 'opponent';

                setTimeout(() => {
                    this.opponentMove();
                    this.turn = 'player';
                }, 500);
            }
        }
    }

    draw() {
        this.blocks.forEach(block => {
            this.ctx.fillStyle = block.background;
            this.ctx.fillRect(block.x, block.y, block.w, block.h);

            this.ctx.strokeStyle = '#C71585';
            this.ctx.rect(block.x, block.y, block.w, block.h);
            this.ctx.stroke();

            if (block.status === 'player') {
                let image = new Image;
                image.src = 'asset/player.png';
                this.ctx.drawImage(image, block.x+10, block.y+10, block.w-20, block.h-20);
            } else if (block.status === 'opponent') {
                let image = new Image;
                image.src = 'asset/opponent.png';
                this.ctx.drawImage(image, block.x+10, block.y+10, block.w-20, block.h-20);
            }
        })
    }

    checkTile() {
        // Horizontal and Vertical check
        this.blocks.forEach((block, index) => {
            if ( (index + 1) % 5 === 1) {
                if (this.blocks[index].status != null &&
                    this.blocks[index].status === this.blocks[index+1].status &&
                    this.blocks[index+1].status === this.blocks[index+2].status &&
                    this.blocks[index+2].status === this.blocks[index+3].status &&
                    this.blocks[index+3].status === this.blocks[index+4].status)
                {
                    this.checkWin( [index, index+1, index+2, index+3, index+4], this.blocks[index].status )
                    return;
                }
            } else if (index === 0 || index === 1 || index === 2 || index === 3 || index === 4) {
                if (this.blocks[index].status != null && this.blocks[index+5].status !== undefined &&
                    this.blocks[index].status === this.blocks[index+5].status &&
                    this.blocks[index+5].status === this.blocks[index+10].status &&
                    this.blocks[index+10].status === this.blocks[index+15].status &&
                    this.blocks[index+15].status === this.blocks[index+20].status)
                {
                    this.checkWin( [index, index+5, index+10, index+15, index+20], this.blocks[index].status )
                    return;
                }
            }
        })
    }

    checkWin(arrays, winner) {
        if (winner === 'player') {
            arrays.forEach(idx => {
                this.blocks[idx].background = '#E47E25'
            })
            this.gameStat = 'done'
            this.printState('You have killed CORONA Virus!')
        } else if (winner === 'opponent') {
            arrays.forEach(idx => {
                this.blocks[idx].background = '#E47E25'
            })
            this.gameStat = 'done'
            this.printState('You are infected by CORONA Virus!!!')
        }
    }

    printState(h1) {
        const wrapper = document.querySelector('#wrapper')
        const statusBox = document.querySelector('#status')
        let statusText = statusBox.querySelector('h1')
        
        wrapper.style.display = 'block'
        statusBox.style.display = 'block'
        statusText.innerHTML = h1
    }

    removeState() {
        const wrapper = document.querySelector('#wrapper')
        const statusBox = document.querySelector('#status')

        wrapper.style.display = 'none'
        statusBox.style.display = 'none'
    }

    click(e) {
        let mousePos = {
            x: e.x - this.client.x,
            y: e.y - this.client.y
        }
        
        this.blocks.forEach((block, index) => {
            if(mousePos.x >= block.x && mousePos.x <= block.x + block.w &&
                mousePos.y >= block.y && mousePos.y <= block.y + block.h) {
                this.playerMove(index);
            }
        })

        this.checkTile();
    }
}