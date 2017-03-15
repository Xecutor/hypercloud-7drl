define(["require", "exports", "./utils", "uibase"], function (require, exports, utils_1, uibase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class UIContainer extends uibase_1.UIBase {
        constructor() {
            super(...arguments);
            this.objects = new Array();
            this.currentMouseOver = null;
            this.modal = null;
            this.modalsStack = [];
        }
        add(obj) {
            obj.parent = this;
            this.objects.push(obj);
            if (obj.onAdd)
                obj.onAdd();
        }
        showModal(obj) {
            this.objects.forEach((obj) => obj.pauseBindings());
            if (this.modal) {
                this.modalsStack.push(this.modal);
                this.modal.pauseBindings();
            }
            obj.parent = this;
            this.modal = obj;
        }
        remove(obj) {
            if (obj.onRemove)
                obj.onRemove();
            if (obj === this.modal) {
                this.objects.forEach((obj) => obj.resumeBindings());
                if (this.modalsStack.length) {
                    this.modal = this.modalsStack.pop();
                    this.modal.resumeBindings();
                }
                else {
                    this.modal = null;
                }
            }
            else {
                this.objects = this.objects.filter((arg) => arg !== obj);
            }
        }
        postMouseEvent(name, e) {
            let pos = new utils_1.Pos(e.x, e.y);
            if (this.modal) {
                if (this.modal instanceof UIContainer) {
                    this.modal.postMouseEvent(name, e);
                }
                else {
                    let handler = this.modal[name];
                    if (handler) {
                        handler.call(this.modal, e);
                    }
                }
                return;
            }
            let foundObject;
            this.objects.forEach(function (obj) {
                if (obj.isInside(pos)) {
                    foundObject = obj;
                    let handler = obj[name];
                    if (handler) {
                        handler.call(obj, e);
                    }
                }
            });
            if (name === 'onMouseMove' && foundObject !== this.currentMouseOver) {
                if (this.currentMouseOver) {
                    this.currentMouseOver.onMouseLeave(e);
                }
                if (foundObject) {
                    foundObject.onMouseEnter(e);
                }
                this.currentMouseOver = foundObject;
            }
            if (foundObject instanceof UIContainer) {
                foundObject.postMouseEvent(name, e);
            }
        }
        onMouseLeave(e) {
            this.objects.forEach((obj) => obj.onMouseLeave(e));
            this.currentMouseOver = null;
        }
        draw() {
            this.objects.forEach((obj) => obj.draw());
            if (this.modal) {
                for (let m of this.modalsStack) {
                    m.draw();
                }
                this.modal.draw();
            }
        }
        pauseBindings() {
            super.pauseBindings();
            this.objects.forEach((obj) => obj.pauseBindings());
        }
        resumeBindings() {
            super.resumeBindings();
            this.objects.forEach((obj) => obj.resumeBindings());
        }
        autoSize() {
            let rv = new utils_1.Size;
            let that = this;
            this.objects.forEach(function (obj) {
                let br = obj.rect.bottomRight().sub(that.rect.pos);
                if (br.x > rv.width)
                    rv.width = br.x;
                if (br.y > rv.height)
                    rv.height = br.y;
            });
            this.rect.size.assign(rv);
            return rv;
        }
    }
    exports.UIContainer = UIContainer;
});
