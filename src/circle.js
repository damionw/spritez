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

    //=========================================================
    //                      Rendering
    //=========================================================
    draw() {
        var ctx = this.ctx;

        ctx.fillStyle = "blue";
        ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

(window.Spritez = window.Spritez || {})[Circle.name] = Circle;
