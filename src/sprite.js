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
        // The coordinates are for the "center" of the sprite
        this._x = x || 0;
        this._y = y || 0;

        // These describe the sprite's active vector
        this._delta_x = 0;
        this._delta_y = 0;

        this._id = this.constructor.getNextId();
        this._collision_damping = 0;
        this._animator = null;
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

    get width() {
        return this._width || 0;
    }

    get height() {
        return this._height || 0;
    }

    get half_width() {
        return this.width / 2;
    }

    get half_height() {
        return this.height / 2;
    }

    get delta_x() {
        return this._delta_x;
    }

    set delta_x(rate) {
        this._delta_x = rate || 0.0;
    }

    get delta_y() {
        return this._delta_y;
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

        this._x += this.delta_x;
        this._y += this.delta_y;
        this.draw();
    }

    //=========================================================
    //                 Collision Detection
    //=========================================================
    // Default collision blocks is just the coordinates of a single boundingRect
    get collision_blocks() {
        var x = this.x - this.half_width;
        var y = this.y - this.half_height;
        var width = this.width;
        var height = this.height;

        var boundingblock = [
            [x, y],
            [x + width, y],
            [x, y + height],
            [x + width, y + height],
        ];

        return [boundingblock];
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
        this.delta_x = Math.abs(this.delta_x);
    }

    collisionRight() {
        this.reportCollision("right");
        this.delta_x = 0 - Math.abs(this.delta_x);
    }

    collisionTop() {
        this.reportCollision("top");
        this.delta_y = Math.abs(this.delta_y);
    }

    collisionBottom() {
        this.reportCollision("bottom");
        this.delta_y = 0 - Math.abs(this.delta_y);
    }

    collisionWith(sprite, dx, dy) {
        // Ignore new collisions if within damping period
        if (this._collision_damping) {
            return;
        }

        // Default behaviour is to adopt the direction
        // and velocity of the other sprite
        this.delta_x = dx;
        this.delta_y = dy;
        this._collision_damping = 0; // this.animator.collision_damping;
        this.reportCollision(sprite); // DEBUG
    }

    //=========================================================
    //                      Rendering
    //=========================================================
    draw() {
        throw new Error("Cannot use base class " + this.constructor.name + " as a sprite");
    }
}

(window.Spritez = window.Spritez || {})[Sprite.name] = Sprite;