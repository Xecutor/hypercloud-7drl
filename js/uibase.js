define(["require", "exports", "./mousewrap", "./graphics"], function (require, exports, mousewrap_1, graphics_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MyMouseEvent {
        constructor(x, y, original) {
            this.x = x;
            this.y = y;
            this.original = original;
        }
    }
    exports.MyMouseEvent = MyMouseEvent;
    class UIBase {
        constructor() {
            this.rect = graphics_1.getAppRect().clone();
            this.bindings = mousewrap_1.Mousetrap();
        }
        draw() {
        }
        close() {
            this.parent.remove(this);
        }
        isInside(pos) {
            return this.rect.isInside(pos);
        }
        pauseBindings() {
            this.bindings.pause();
        }
        resumeBindings() {
            this.bindings.unpause();
        }
        onMouseMove(e) { }
        onMouseDown(e) { }
        onMouseUp(e) { }
        onMouseEnter(e) { }
        onMouseLeave(e) { }
        onRemove() {
            this.bindings.reset();
        }
    }
    exports.UIBase = UIBase;
});
