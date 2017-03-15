define(["require", "exports", "./uibase", "uicontainer", "graphics"], function (require, exports, uibase_1, uicontainer_1, gr) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class UIManager extends uicontainer_1.UIContainer {
        constructor() {
            super();
            this.animations = [];
            var canvas = document.getElementById('canvas');
            canvas.onmousedown = (e) => this.postRawMouseEvent('onMouseDown', e);
            canvas.onmouseup = (e) => this.postRawMouseEvent('onMouseUp', e);
            canvas.onmousemove = (e) => this.postRawMouseEvent('onMouseMove', e);
            this.timerId = setInterval(() => this.draw(), 40);
        }
        postRawMouseEvent(name, e) {
            let r = gr.getBoundingRect();
            let sz = gr.getAppSize();
            let x = (e.clientX - r.left) * sz.width / r.width;
            let y = (e.clientY - r.top) * sz.height / r.height;
            let d = new uibase_1.MyMouseEvent(x, y, e);
            this.postMouseEvent(name, d);
        }
        draw() {
            gr.clear();
            this.animations = this.animations.filter((ani) => ani.nextFrame());
            super.draw();
        }
        addAnimation(ani) {
            this.animations.push(ani);
        }
    }
    exports.uiManager = new UIManager();
});
