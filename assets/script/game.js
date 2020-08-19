cc.Class({
    extends: cc.Component,

    properties: {
        blockNode: cc.Node,
        wallNodeArr: [cc.Node],
        baseNodeArr: [cc.Node],
        scoreLabel: cc.Label,
        tarLabel: cc.Label,
    },

    onLoad () {
        this.node.on('touchstart', this.grow, this)
        this.node.on('touchend', this.stop, this)
        this.init()
    },
    onDestroy () {
        this.node.off('touchstart', this.grow, this)
        this.node.off('touchend', this.stop, this)
    },
    grow (e) {
        if (this.gameState != 'idle') return
        this.gameState = 'grow'
        let seq = cc.sequence(
            cc.scaleTo(1, 4),
            cc.callFunc(() => {

            })
        )
        this.growAction = this.blockNode.runAction(seq)
    },
    stop (e) {
        if (this.gameState != 'grow') return
        this.gameState = 'rota'

        this.blockNode.stopAction(this.growAction)

        this.blockNode.runAction(cc.sequence(
            cc.rotateTo(0.15, 0),
            cc.callFunc(() => {
                if (this.blockNode.width * this.blockNode.scaleX <= this.baseNodeArr[1].x - this.baseNodeArr[0].x) {
                    console.log('掉下去了')
                    this.blockNode.runAction(cc.sequence(
                        cc.moveTo(0.7, cc.v2(0, -1000)),
                        cc.callFunc(() => {
                            this.gameOver()
                        })
                    ))
                } else {
                    if (this.blockNode.width * this.blockNode.scaleX <= this.wallNodeArr[1].x - this.wallNodeArr[0].x) {
                        this.bouce(true)
                    } else {
                        this.bouce(false)
                    }

                }
            })
        ))
    },
    // 碰撞
    bouce (success) {
        let desY = -(cc.winSize.height / 2 - this.baseNodeArr[0].height - this.blockNode.height * this.blockNode.scaleX / 2)
        if (!success) {
            desY += this.wallNodeArr[0].height
        }
        this.blockNode.runAction(cc.sequence(
            cc.moveTo(0.7, cc.v2(0, desY)).easing(cc.easeBounceOut()),
            cc.callFunc(() => {
                if (success) {
                    this.updateScore(1)
                    this.nextLevelCheck()
                } else {
                    this.gameOver()
                }
            })
        ))
    },
    gameOver () {
        console.log('游戏结束')
        cc.director.loadScene('game')
    },
    init (level = 1, score = 0) {
        this.level = level
        this.tar = this.level
        this.score = score
        this.nextLevelCheck()
        this.resetBgColor()
    },

    placeWall (node, desX) {
        node.runAction(cc.moveTo(0.5, cc.v2(desX, node.y)).easing(cc.easeQuadraticActionIn()))
    },

    resetWall () {
        let baseGap = 100 + Math.random() * 100
        let wallGap = baseGap + 30 + Math.random() * 80
        this.placeWall(this.baseNodeArr[0], - baseGap / 2)
        this.placeWall(this.baseNodeArr[1], baseGap / 2)
        this.placeWall(this.wallNodeArr[0], - wallGap / 2)
        this.placeWall(this.wallNodeArr[1], wallGap / 2)
    },

    resetBlock () {
        this.blockNode.runAction(cc.sequence(
            cc.spawn(
                cc.rotateTo(0.5, 45),
                cc.moveTo(0.5, cc.v2(0, 400)),
                cc.scaleTo(0.5, 1)
            ),
            cc.callFunc(() => {

            })
        ))
    },
    resetBgColor () {
        let colors = ['#4cb4e7', '#ffc09f', '#c7b3e5', '#588c7e', '#a3a380']
        this.node.color = cc.Color.BLACK.fromHEX(colors[parseInt(Math.random() * colors.length)])
    },
    nextLevelCheck () {
        if (this.tar === 0) {
            this.init(this.level + 1, this.score)
            this.scoreLabel.string = `score:${this.score}\nlevel:${this.level}`
            return
        }
        this.tarLabel.string = this.tar
        this.gameState = 'idle'
        this.resetWall()
        this.resetBlock()
    },
    updateScore (incr) {
        this.score += incr
        this.scoreLabel.string = `score:${this.score}\nlevel:${this.level}`
        this.tar -= incr
    }
});
