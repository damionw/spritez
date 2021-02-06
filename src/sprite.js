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
        this._collision_damping = 0;
        this._sortorder = 50;
    }

    //=========================================================
    //                   Object attributes
    //=========================================================
    get sortorder() {
        return this._sortorder;
    }

    set sortorder(sortorder) {
        this._sortorder = sortorder;
    }

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
        if (this._collision_damping) {
            --this._collision_damping;
        }

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

    reportCollision(other) {
        var name1 = this.constructor.name + "(" + this.id + ")";
        var name2;

        if (typeof(other) == "string") {
            name2 = other;
        }
        else if (other == null) {
            name2 = "something";
        }
        else {
            name2 = other.constructor.name + "(" + other.id + ")";
        }

        console.log(
            "COLLISION: " + name1 + " with " + name2 + " at " + this.x + "," + this.y
        );
    }

    collisionLeft() {
        this.reportCollision("left");
        this.delta_x = -this.delta_x;
    }

    collisionRight() {
        this.reportCollision("right");
        this.delta_x = -this.delta_x;
    }

    collisionTop() {
        this.reportCollision("top");
        this.delta_y = -this.delta_y;
    }

    collisionBottom() {
        this.reportCollision("bottom");
        this.delta_y = -this.delta_y;
    }

    collisionWith(sprite) {
        if (this._collision_damping) {
            return;
        }

        var dx = this.delta_x;
        var dy = this.delta_y;
        this.delta_x = dy;
        this.delta_y = dx;
        this._collision_damping = this.animator.collision_damping;
        this.reportCollision(sprite);
    }

    //=========================================================
    //                      Rendering
    //=========================================================
    draw() {
        this.ctx.fillStyle = "#454500";
        this.ctx.fillRect(100, 50, 200, 175);
    }
}

// (window.Spritez = window.Spritez || {})[Sprite.name] = Sprite;