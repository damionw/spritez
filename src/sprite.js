class Sprite {
    static getNextId() {
        var newid = Sprite._id_source || 0;
        Sprite._id_source = newid + 1;
        return newid;
    }

    //=========================================================
    //                      Constructor
    //=========================================================
    constructor(x, y) {
        this._animator = null;
        this._id = this.constructor.getNextId();
        this._x = x || 0;
        this._y = y || 0;
        this._delta_x = 0;
        this._delta_y = 0;
    }

    //=========================================================
    //                   Object attributes
    //=========================================================
    get collision_blocks() {
        return [];
    }

    get id() {
        return this._id;
    }

    get animator() {
        return this._animator;
    }

    set animator(animator) {
        this._animator = animator;
    }

    get ctx() {
        return this.animator.ctx;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get delta_x() {
        return this._delta_x || 0.0;
    }

    set delta_x(rate) {
        this._delta_x = rate || 0.0;
    }

    get delta_y() {
        return this._delta_y || 0.0;
    }

    set delta_y(rate) {
        this._delta_y = rate || 0.0;
    }

    //=========================================================
    //                      Animation
    //=========================================================
    update() {
        this._x += this._delta_x;
        this._y += this._delta_y;
        this.draw();
    }

    //=========================================================
    //                 Collision Detection
    //=========================================================
    get collision_blocks() {
        // FIXME: This is really just for Box
        var blockdef = this.animator.detection_block;
        var x_size = this.animator.block_width || 10;
        var y_size = this.animator.block_height || 10;
        var x = this.x;
        var y = this.y;
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

    collisionWith(sprite) {
        var dx = this.delta_x;
        var dy = this.delta_y;
        this.delta_x = dy;
        this.delta_y = dx;
        this.update();
        console.log("COLLISION: " + this.constructor.name + " " + this.id + " with " + sprite.id + " at " + this.x + "," + this.y);
    }

    //=========================================================
    //                      Rendering
    //=========================================================
    draw() {
        this.ctx.fillStyle = "#454500";
        this.ctx.fillRect(100, 50, 200, 175);
    }
}
