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
        constructor(scene, name, x, y, scale, rotation) {
            this.scene = scene;
            this.strips = [];

            // create sprite
            this.gameObject = this.scene.matter.add.sprite(x, y, name, 0, {
                friction: 0.4,
            }).setDepth(1).setScale(scale || 1).setRotation(rotation || 0);
            this.gameObject.painting = this; // mark sprite as painting
            this.gameObject._crop = this.gameObject.resetCropObject(); // XXX: Phaser 3 bug?
        }

        createStrips(width, spacing) {
            // scale values
            width /= this.gameObject.scaleX;
            spacing /= this.gameObject.scaleX;

            let halfStripWidth = width/2;
            let hw = this.gameObject.width/2;

            // function to create a strip at x
            let createStrip = (x) => {
                // limit strip width
                let p0 = Math.max(0, hw - halfStripWidth + x);
                let p1 = Math.min(this.gameObject.width, hw + halfStripWidth + x);
                let stripWidth = p1 - p0;

                // discard strips outside texture
                if (p0 >= this.gameObject.width) return;
                if (p1 <= 0) return;

                // calculate offset based on x and strip width
                let d = x - Math.sign(x)*(width - stripWidth)/2;

                // create strip
                let strip = this.scene.matter.add.sprite(this.gameObject.x + d*this.gameObject.scaleX, this.gameObject.y, this.gameObject.texture.key, 0, {
                    isStatic: true,
                    friction: 0.4,
                    mass: 0.1,
                    shape: {
                        type: 'rectangle',
                        width: stripWidth * (0.4 + 0.1*Math.random()),
                        height: this.gameObject.height * (0.5 + 0.2*Math.random()),
                    },
                }).setScale(this.gameObject.scaleX, this.gameObject.scaleY);
                strip._crop = this.gameObject.resetCropObject(); // XXX: Phaser 3 bug?
                strip.setCrop(p0, 0, stripWidth, this.gameObject.height);
                strip.displayOriginX += d;

                this.strips.push(strip);
            }

            // create all the strips
            let x = 0
            for (; x < hw; x += width + spacing) {
                if (x == 0) {
                    createStrip(0); // center strip
                } else {
                    createStrip(-x);
                    createStrip(x);
                }
            }
            // last strips can be smaller
            createStrip(-x);
            createStrip(x);
        }
    }

    class Shredder {
        constructor(scene, x, y) {
            this.scene = scene;
            this.x = x;
            this.y = y;
            this.painting = null;
            this.shreddingDelay = null;
            this.shredding = false;

            // create sprite and collider
            this.sprite = this.scene.add.image(x, y, 'shredder').setDepth(1).setScale(4);
            this.scene.matter.add.rectangle(x, y + 4, 256, 8, {
                isStatic: true,
            });

            // create trigger
            this.trigger = this.scene.matter.add.rectangle(x, y - 16, 200, 16, {
                isStatic: true,
                isSensor: true,
            });

            // register trigger listeners
            this.scene.matter.world.on('collisionactive', (event) => {
                for (let i = 0, l = event.pairs.length; i < l; i++) {
                    var pair = event.pairs[i];
                    if (pair.bodyA == this.trigger) {
                        this.onTriggerActive(pair.bodyB);
                    } else if (pair.bodyB == this.trigger) {
                        this.onTriggerActive(pair.bodyA);
                    }
                }
            });
            this.scene.matter.world.on('collisionend', (event) => {
                for (let i = 0, l = event.pairs.length; i < l; i++) {
                    var pair = event.pairs[i];
                    if (pair.bodyA == this.trigger) {
                        this.onTriggerEnd(pair.bodyB);
                    } else if (pair.bodyB == this.trigger) {
                        this.onTriggerEnd(pair.bodyA);
                    }
                }
            });
        }

        onTriggerActive(body) {
            if (body.gameObject.painting && !this.painting) {
                // detect new painting
                this.painting = body.gameObject.painting;
                // move shredder sprite above painting sprite
                this.scene.children.moveTo(this.sprite, this.scene.children.getIndex(this.painting.gameObject));
                // set timer to start shredding
                this.shreddingDelay = this.scene.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        this.shredding = true;
                        this.painting.gameObject.setStatic(true);
                        // align painting
                        this.scene.tweens.add({
                            targets: [this.painting.gameObject],
                            rotation: 0,
                            x: this.x,
                            y: this.y - this.painting.gameObject.displayHeight/2,
                            duration: 100,
                            onComplete: () => { this.startShredding(); },
                        });
                    },
                });
            }
        }

        onTriggerEnd(body) {
            if (!this.shredding && this.painting && body.gameObject.painting && this.painting.gameObject.body == body) {
                // stop shredding timer if painting is removed
                this.painting = null;
                this.shreddingDelay.destroy();
                this.shreddingDelay = null;
                clearTimeout();
            }
        }

        startShredding() {
            // create painting strips
            this.painting.createStrips(16, 4);

            let w = this.painting.gameObject.width;
            let h = this.painting.gameObject.height;

            // shredding effect
            this.scene.tweens.addCounter({
                from: this.painting.gameObject.y,
                to: this.y + this.painting.gameObject.displayHeight/2 + 8,
                duration: 2000,
                delay: 500,
                onUpdate: (t) => {
                    // move painting and strips
                    this.painting.gameObject.y = t.data[0].current;
                    this.painting.strips.forEach((strip) => {
                        strip.y = t.data[0].current;
                    });
                    this.painting.gameObject.setCrop(0, 0, w, h * (1 - t.data[0].progress));
                },
                onComplete: () => {
                    // remove painting and unfreeze strips
                    this.painting.gameObject.destroy();
                    this.painting.gameObject = null;
                    this.painting.strips.forEach((strip) => {
                        strip.setStatic(false);
                        strip.setRotation(Math.random()*0.25);
                    });

                    // be ready to shred again
                    this.painting = null;
                    this.shredding = false;
                }
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
            this.load.image('bg', 'game/assets/bg.png');
            this.load.image('info', 'game/assets/info.png');
            this.load.image('lewis', 'game/assets/lewis.png');
            this.load.image('bananeee', 'game/assets/bananeee.png');
            this.load.image('shredder', 'game/assets/shredder.png');
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

            // info
            this.add.image(40, 40, 'info').setOrigin(0, 0).setAlpha(0.75);

            // initial objects
            new Painting(this, 'bananeee', 465, 108, 0.3333);
            this.matter.add.sprite(630, 111, 'lewis', null, {
                friction: 1,
            }).setScale(2);

            new Shredder(this, 128 + 8, 300);
            new Painting(this, 'girl-with-balloon', 160, 120, 0.25, 0.2);

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
            if (bodyB && bodyB.gameObject && !bodyB.gameObject.isStatic()) {
                if (!this.mouseBody) {
                    this.mouseBody = bodyB;
                    this.mouseBody.gameObject.setScale(this.mouseBody.gameObject.scaleX * 1.1);
                    this.mouseBody.collisionFilter.mask = 0; // disable collisions
                    this.children.bringToTop(this.mouseBody.gameObject);
                }
            } else if (this.mouseBody) {
                this.mouseBody.gameObject.setScale(this.mouseBody.gameObject.scaleX / 1.1);
                this.mouseBody.collisionFilter.mask = ~0; // enable collisions
                this.mouseBody = null;
            }
        }
    }

    let game = window.game = new Phaser.Game({
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

    // XXX: patch for Phaser.Input.InputManager.prototype.updateBounds
    //      to calculate correct bounds in fullscreen (ignores black bars)
    let updateBoundsOld = Phaser.Input.InputManager.prototype.updateBounds;
    Phaser.Input.InputManager.prototype.updateBounds = function() {
        // call old function
        updateBoundsOld.call(this);
        // detect fullscreen
        if (this.bounds.x == 0 && this.bounds.y == 0) {
            let ratio = this.game.config.width/this.game.config.height;
            let nh = this.bounds.width/ratio;
            if (nh < this.bounds.height) {
                this.bounds.y = this.bounds.height/2 - nh/2;
                this.bounds.height = nh;
            }
            let nw = this.bounds.height*ratio;
            if (nw < this.bounds.width) {
                this.bounds.x = this.bounds.width/2 - nw/2;
                this.bounds.width = nw;
            }
        }
    }

    window.gameRequestFullscreen = function() {
        game.canvas[game.device.fullscreen.request]();
        game.scene.scenes[0].scene.restart();
    };

})();
