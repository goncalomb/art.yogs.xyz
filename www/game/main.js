(function() {

    let yogsArt = [
        ['lewis_11', 'Lewis #11 - Mouldy Heart'],
        ['lewis_10', 'Lewis #10'],
        ['lewis_16', 'Lewis #16 - Red Mist'],
        ['lewis_28', 'Lewis #28'],
        ['lewis_33', 'Lewis #33'],
        ['lewis_17', 'Lewis #17'],
        ['lewis_31', 'Lewis #31'],
        ['lewis_7', 'Lewis #7 - Bladerunner'],
        ['lewis_34', 'Lewis #34'],
        ['lewis_22', 'Lewis #22'],
        ['lewis_20', 'Lewis #20'],
        ['lewis_26', 'Lewis #26'],
        ['lewis_27', 'Lewis #27'],
        ['lewis_15', 'Lewis #15'],
        ['booby_mermaid', 'Booby Mermaid'],
        ['lewis_14', 'Lewis #14'],
        ['lewis_12', 'Lewis #12'],
        // ['dope_asaurus', 'Dope-asaurus'],
        ['ttt_bee_king', 'TTT Bee King'],
        // ['brontosaurmus', 'Brontosaurmus'],
    ];

    class Painting {
        constructor(scene, name, x, y, scale) {
            scene.matter.add.sprite(x, y, name, null, {
                friction: 0.4,
            }).setScale(scale || 1);
        }
    }

    class MainScene extends Phaser.Scene {
        addPlatform(x, y, w, h) {
            this.matter.add.rectangle(x + w/2, y + h/2, w, h, {
                isStatic: true,
                collisionFilter: {
                    category: 2,
                },
            });
        }

        preload() {
            this.load.image('bg', 'game/assets/bg.png');
            this.load.image('art', 'game/assets/art.png');
            this.load.image('lewis', 'game/assets/lewis.png');
            this.load.image('girl-with-balloon', 'game/assets/girl-with-balloon.jpg');
            yogsArt.forEach((p) => {
                this.load.image(p[0], 'game/assets/yogs-art/' + p[0] + '.jpg');
            });
        }

        create() {
            this.matter.world.setBounds(0, 0, game.config.width, game.config.height);
            this.addPlatform(76*4, 52*4, 116*4, 4*4);

            this.mouseBody = null;
            this.mouseSpring = this.matter.add.mouseSpring({
                damping: 0.8,
                stiffness: 0.5,
            });

            // background
            this.add.image(0, 0, 'bg').setOrigin(0, 0).setScale(4);

            // initial objects
            new Painting(this, 'art', 465, 108);
            this.matter.add.sprite(630, 111, 'lewis', null, {
                friction: 1,
            }).setScale(2);

            new Painting(this, 'girl-with-balloon', 630, 350, 0.25);

            let extraArt = yogsArt.filter((p) => {
                if (p[0] == 'lewis_11') {
                    new Painting(this, p[0], 430, 500, 0.5);
                } else if (p[0] == 'booby_mermaid') {
                    new Painting(this, p[0], 475, 340, 0.5);
                } else if (p[0] == 'ttt_bee_king') {
                    new Painting(this, p[0], 620, 540, 0.5);
                } else {
                    return true;
                }
                return false;
            });

            let pos = [[950, 200], [800, 450], [1050, 450]];
            for (let i = 0; i < pos.length; i++) {
                let j = Math.floor(Math.random() * extraArt.length);
                let p = extraArt.splice(j, 1)[0];
                new Painting(this, p[0], pos[i][0], pos[i][1], 0.5);
            }
        }

        update() {
            var bodyB = this.mouseSpring.constraint.bodyB;
            if (bodyB) {
                if (!this.mouseBody) {
                    this.mouseBody = bodyB;
                    this.mouseBody.collisionFilter.mask = ~2; // don't collide with platforms
                    this.children.bringToTop(this.mouseBody.gameObject);
                }
            } else if (this.mouseBody) {
                this.mouseBody.collisionFilter.mask = ~0; // collide with everything
                this.mouseBody = null;
            }
        }
    }

    let game = new Phaser.Game({
        parent: document.getElementsByTagName('main')[0],
        type: Phaser.AUTO,
        width: 1200,
        height: 600,
        backgroundColor: 0xffffff,
        antialias: false,
        physics: {
            default: 'matter',
            matter: {
                gravity: { y: 2.5 },
                debug: false,
            },
        },
        scene: MainScene,
    });

})();
