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
    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    //=========================================================
    //                      Rendering
    //=========================================================
    draw() {
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

window.Spritez[Box.constructor.name] = Box;
