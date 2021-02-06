class Animator {
    //=========================================================
    //                      Constructor
    //=========================================================
    constructor(canvas) {
        this._canvas = canvas;
        this._context = null;
        this._sprites = [];
        this._countdown = null;
        this._running = false;
    }

    //=========================================================
    //                   Object attributes
    //=========================================================
    get block_width() {
        return 10;
    }

    get block_height() {
        return 10;
    }

    get collision_damping() {
        return 27;
    }

    get canvas() {
        return this._canvas;
    }

    get left_edge() {
        return this._left_edge || 0;
    }

    get right_edge() {
        return this._right_edge || this.canvas.width;
    }

    get top_edge() {
        return this._top_edge || 0;
    }

    get bottom_edge() {
        return this._bottom_edge || this.canvas.height;
    }

    get ctx() {
        if (this._context == null) {
            this._context = this.canvas.getContext('2d');
        }

        return this._context;
    }

    //=========================================================
    //                      Collections
    //=========================================================
    add() {
        var self = this;

        Array.from(arguments).forEach(
            function(sprite) {
                for (var i=0; i < self._sprites.length; ++i) {
                    if (self._sprites[i].id == sprite.id) {
                        console.log(sprite.constructor.name + " == " + self._sprites[i].constructor.name);
                        return;
                    }
                }

                self._sprites.push(sprite);
                sprite.animator = self;
            }
        );

        this.sortSprites();
    }

    sortSprites() {
        this._sprites.sort(
            function(a, b) {
                return (a.sortorder || 0) - (b.sortorder || 0);
            }
        );
    }

    //=========================================================
    //                       Timers
    //=========================================================
    start(iterations) {
        this._countdown = iterations;
        this._running = true;
        this.update();
        console.log("Animation has started"); //DEBUG
    }

    stop() {
        this._running = false;
    }

    update() {
        if (this._countdown) {
            --this._countdown;
        }

        if (this._countdown == 0) {
            this._running = false;
        }

        if (! this._running) {
            console.log("Animation has stopped");
            return;
        }

        var ctx = this.ctx;
        var self = this;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.beginPath();

        this._sprites.forEach(
            function(sprite) {
                sprite.update();
            }
        );

        ctx.closePath();

        this.detect_collisions();

        window.requestAnimationFrame(
            function() {
                self.update();
            },
        );
    }

    //=========================================================
    //                    Collision Detection
    //=========================================================
    get collision_pairs() {
        function* fetchCollisionPairs(sprites) {
            var sprites = Array.from(sprites);
            var length = sprites.length;

            for (var start=0; start < length - 1; ++start) {
                for (var i=start + 1; i < length; ++i) {
                    yield [sprites[start], sprites[i]];
                }
            }
        }

        return Array.from(fetchCollisionPairs(this._sprites));
    }

    detect_collisions() {
        var sprites = this._sprites;

        for (var i=0; i < sprites.length; ++i) {
            var sprite = sprites[i];

            if (sprite.x <= this.left_edge) {
                sprite.collisionLeft();
            }
            else if (sprite.x + sprite.width >= this.right_edge) {
                sprite.collisionRight();
            }

            if (sprite.y <= this.top_edge) {
                sprite.collisionTop();
            }
            else if (sprite.y + sprite.height >= this.bottom_edge) {
                sprite.collisionBottom();
            }
        }

        var pairs = this.collision_pairs;

        for (var i=0; i < pairs.length; ++i) {
            var sprite1 = pairs[i][0];
            var sprite2 = pairs[i][1];

            var regions1 = sprite1.collision_blocks;
            var regions2 = sprite2.collision_blocks;
            var collision = false;

            for (var x=0; x < regions1.length && ! collision; ++x) {
                var rect1 = regions1[x];

                for (var y=0; y < regions2.length && ! collision; ++y) {
                    var rect2 = regions2[y];

                    if (this.overlappingRegions(rect1, rect2)) {
                        collision=true
                    }
                }
            }

            if (collision) {
                sprite1.collisionWith(sprite2);
                sprite2.collisionWith(sprite1);
            }
        }
    }

    overlappingRegions(rect1, rect2) {
        var isin = false;

        for (var i=0; i < rect1.length && ! isin; ++i) {
            var x = rect1[i][0];
            var y = rect1[i][1];

            isin = (
                (x >= rect2[0][0] && y >= rect2[0][1]) &&
                (x <= rect2[1][0] && y >= rect2[1][1]) &&
                (x >= rect2[2][0] && y <= rect2[2][1]) &&
                (x <= rect2[3][0] && y <= rect2[3][1])
            );
        }

        return isin;
    }
}

(window.Spritez = window.Spritez || {})[Animator.name] = Animator;
