class Box extends Sprite {
    //=========================================================
    //                      Constructor
    //=========================================================
    constructor(x, y, width, height) {
        super(x, y);
        this._width = width || 20;
        this._height = height || 20;
    }

    //=========================================================
    //                   Object attributes
    //=========================================================
    get unused_collision_blocks() {
        var blockdef = this.animator.detection_block;
        var x_size = this.animator.block_width || 10;
        var y_size = this.animator.block_height || 10;
        var x = this.x - this.half_width;
        var y = this.y - this.half_height;
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
        this.ctx.fillStyle = "green";

        this.ctx.fillRect(
            this.x - this.half_width,
            this.y - this.half_height,
            this.width,
            this.height
        );
    }
}

(window.Spritez = window.Spritez || {})[Box.name] = Box;
