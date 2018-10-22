(function() {

    let paintings = [
        ['art', 'art?'],
        ['colors', 'colors on canvas'],
    ]

    class Painting {
        constructor(scene, name, x, y) {
            scene.matter.add.sprite(x, y, name, null, {
                friction: 0.4,
            });
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
            // background
            this.load.image('bg', 'game/assets/bg.png');
            // paintings
            paintings.forEach((p) => {
                this.load.image(p[0], 'game/assets/paintings/' + p[0] + '.png');
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
            // paintings
            let x = 350, y = 104;
            paintings.forEach((p) => {
                new Painting(this, p[0], x, y);
                x += 145;
            });
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
                debug: false,
            },
        },
        scene: MainScene,
    });

})();
