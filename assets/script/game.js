cc.Class({
    extends: cc.Component,

    properties: {
        blockNode: cc.Node,
        wallNodeArr: [cc.Node],
        baseNodeArr: [cc.Node]
    },

    onLoad () {
        this.node.on('touchstart', this.grow, this)
        this.node.on('touchend', this.stop, this)
    },
    onDestroy () {
        this.node.off('touchstart', this.grow, this)
        this.node.off('touchend', this.stop, this)
    },
    grow (e) {
        let seq = cc.sequence(
            cc.scaleTo(1, 4),
            cc.callFunc(() => {

            })
        )
        this.growAction = this.blockNode.runAction(seq)
    },
    stop (e) {
        this.blockNode.stopAction(this.growAction)

        // this.rotaAction = this.blockNode.runAction(cc.rotateTo(0.15, 0))
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
            cc.moveTo(0.7, cc.v2(0, desY)),
            cc.callFunc(() => {
                console.log('碰撞')
                this.gameOver()
            })
        ))
    },
    gameOver () {
        console.log('游戏结束')

    },
    start () {

    },

    // update (dt) {},
});
