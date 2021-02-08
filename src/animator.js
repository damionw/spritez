class Animator {
    //=========================================================
    //                      Constructor
    //=========================================================
    constructor(canvas) {
        this._canvas = canvas;
        this._context = null;
        this._sprites = {}; // Keyed by sprite id
        this._ordered_sprites = null;
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
        return 227;
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

    get sprites() {
        if (this._ordered_sprites == null) {
            this._ordered_sprites = Object.values(this._sprites);

            this._ordered_sprites.sort(
                function(a, b) {
                    return (a.sortorder || 0) - (b.sortorder || 0);
                }
            );
        }

        return this._ordered_sprites;
    }

    //=========================================================
    //                      Collections
    //=========================================================
    add() {
        var self = this;

        Array.from(arguments).forEach(
            function(sprite) {
                self._sprites[sprite.id] = sprite;
                sprite.animator = self;
            }
        );

        this._ordered_sprites = null;
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

        this.sprites.forEach(
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

        return Array.from(fetchCollisionPairs(this.sprites));
    }

    detect_collisions() {
        var sprites = this.sprites;

        for (var i=0; i < sprites.length; ++i) {
            var sprite = sprites[i];

            if (sprite.x - (sprite.width / 2) <= this.left_edge) {
                sprite.collisionLeft();
            }
            else if (sprite.x + (sprite.width / 2) >= this.right_edge) {
                sprite.collisionRight();
            }

            if (sprite.y - (sprite.height / 2) <= this.top_edge) {
                sprite.collisionTop();
            }
            else if (sprite.y + (sprite.height / 2) >= this.bottom_edge) {
                sprite.collisionBottom();
            }
        }

        // FIXME: This should be a function
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
                var dx1= sprite1.delta_x;
                var dy1 = sprite1.delta_y;
                var dx2 = sprite2.delta_x;
                var dy2 = sprite2.delta_y;

                if (! ((dx1 == dx2) || (dy1 == dy2))) {
                    sprite1.collisionWith(sprite2, dx2, dy2);
                    sprite2.collisionWith(sprite1, dx1, dy1);
                }
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
