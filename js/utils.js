define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Pos {
        constructor(xOrPos, y) {
            this.x = 0;
            this.y = 0;
            if (typeof xOrPos === "number") {
                this.x = xOrPos;
                this.y = y;
            }
            else if (xOrPos instanceof Pos) {
                this.x = xOrPos.x;
                this.y = xOrPos.y;
            }
        }
        assign(xOrPos, y) {
            if (xOrPos instanceof Pos) {
                this.x = xOrPos.x;
                this.y = xOrPos.y;
            }
            else {
                this.x = xOrPos;
                this.y = y;
            }
            return this;
        }
        add(x, y) {
            if (typeof x == "number") {
                this.x += x;
                this.y += y;
            }
            else {
                this.x += x.x;
                this.y += x.y;
            }
            return this;
        }
        sub(x, y) {
            if (typeof x == "number") {
                this.x -= x;
                this.y -= y;
            }
            else {
                this.x -= x.x;
                this.y -= x.y;
            }
            return this;
        }
        mul(n) {
            this.x *= n;
            this.y *= n;
            return this;
        }
        div(n) {
            this.x /= n;
            this.y /= n;
            return this;
        }
        clone() {
            return new Pos(this.x, this.y);
        }
        clamp(rect) {
            if (this.x < rect.pos.x)
                this.x = rect.pos.x;
            if (this.x > rect.pos.x + rect.size.width)
                this.x = rect.pos.x + rect.size.width;
            if (this.y < rect.pos.y)
                this.y = rect.pos.y;
            if (this.y > rect.pos.y + rect.size.height)
                this.y = rect.pos.y + rect.size.height;
            return this;
        }
        toSize() {
            return new Size(this.x, this.y);
        }
        isEqual(pos) {
            return this.x == pos.x && this.y == pos.y;
        }
        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        makeRectAround(dist) {
            return new Rect(this.x - dist, this.y - dist, dist * 2, dist * 2);
        }
    }
    exports.Pos = Pos;
    class Size {
        constructor(width, height) {
            this.width = 0;
            this.height = 0;
            if (typeof width === 'number') {
                this.width = width;
                this.height = height;
            }
        }
        assign(size) {
            this.width = size.width;
            this.height = size.height;
        }
        clone() {
            return new Size(this.width, this.height);
        }
        toPos() {
            return new Pos(this.width, this.height);
        }
    }
    exports.Size = Size;
    class RectIterator {
        constructor(rect) {
            this.value = null;
            this.rect = rect;
        }
        next() {
            if (this.value) {
                let maxY = this.rect.pos.y + this.rect.size.height;
                if (this.value.y > maxY) {
                    return false;
                }
                this.value.x += 1;
                if (this.value.x > this.rect.pos.x + this.rect.size.width) {
                    this.value.x = this.rect.pos.x;
                    this.value.y += 1;
                }
                return this.value.y <= maxY;
            }
            else {
                this.value = this.rect.pos.clone();
            }
            return true;
        }
    }
    exports.RectIterator = RectIterator;
    class Rect {
        constructor(a, b, width, height) {
            this.pos = new Pos;
            this.size = new Size;
            if (typeof a === "number" && typeof b === "number") {
                let x = a;
                let y = b;
                this.pos.x = x;
                this.pos.y = y;
                this.size.width = width;
                this.size.height = height;
            }
            else if (typeof a === "object" && typeof b === "object") {
                this.pos = a;
                this.size = b;
            }
        }
        isInside(pos) {
            return pos.x >= this.pos.x && pos.y >= this.pos.y &&
                pos.x <= this.pos.x + this.size.width &&
                pos.y <= this.pos.y + this.size.height;
        }
        clone() {
            return new Rect(this.pos.clone(), this.size.clone());
        }
        middle() {
            return new Pos(this.pos.x + this.size.width / 2, this.pos.y + this.size.height / 2);
        }
        setTopLeft(newValue) {
            this.size.width += this.pos.x - newValue.x;
            this.size.height += this.pos.y - newValue.y;
            this.pos.assign(newValue);
        }
        bottomRight(newValue) {
            if (newValue) {
                this.size.width = newValue.x - this.pos.x;
                this.size.height = newValue.y - this.pos.y;
            }
            return this.pos.clone().add(this.size.width, this.size.height);
        }
        getIterator() {
            return new RectIterator(this);
        }
    }
    exports.Rect = Rect;
    function randomFromArray(a) {
        let idx = (Math.random() * a.length) | 0;
        return a[idx];
    }
    exports.randomFromArray = randomFromArray;
});
