class Circle extends Sprite {
    //=========================================================
    //                      Constructor
    //=========================================================
    constructor(x, y, radius) {
        super(x, y);
        this._radius = radius || 20;
    }

    //=========================================================
    //                   Object attributes
    //=========================================================
    get radius() {
        return this._radius;
    }

    get diameter() {
        return this.radius * 2;
    }

    get width() {
        return this.diameter;
    }

    get height() {
        return this.diameter;
    }

    get unused_collision_blocks() {
        // FIXME: This is really just for Box
        var blockdef = this.animator.detection_block;
        var x_size = this.animator.block_width || 10;
        var y_size = this.animator.block_height || 10;
        var x = this.x - this.radius;
        var y = this.y - this.radius;
        var width = this.width;
        var height = this.height;
        var results = [];

        for (var j=0; j < height; j += y_size) {
            for (var i=0; i < width; i += x_size) {
                var coords = [
                    [i + x, j + y],
                    [i + x + x_size, j + y],
                    [i + x + x_size, j + y + y_size],
                    [i + x + x_size, j + y + y_size]
                ];

                results.push(coords);
            }
        }

        return results;
    }

    //=========================================================
    //                      Rendering
    //=========================================================
    draw() {
        var ctx = this.ctx;

        ctx.fillStyle = "blue";

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            2 * Math.PI
        );
    
        ctx.fill();
    }
}

(window.Spritez = window.Spritez || {})[Circle.name] = Circle;
