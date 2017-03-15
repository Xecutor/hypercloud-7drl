define(["require", "exports", "./uibase", "./graphics"], function (require, exports, uibase_1, gr) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Button extends uibase_1.UIBase {
        constructor(label, onClick, fontSize) {
            super();
            this.color = 'white';
            this.fontSize = 32;
            this.mouseOver = false;
            this.clickOnUp = false;
            this.label = label;
            this.onClick = onClick;
            if (fontSize)
                this.fontSize = fontSize;
            this.rect.size.assign(gr.getTextSize(label));
            this.rect.size.width += 4;
            this.rect.size.height += 4;
        }
        draw() {
            gr.setFontSize(this.fontSize);
            gr.rect(this.rect, 'cyan', 2, this.mouseOver ? 10 : 0);
            let pos = this.rect.size.toPos().sub(gr.getTextSize(this.label).toPos()).div(2).add(this.rect.pos);
            gr.textout(pos.x, pos.y, this.color, this.label);
        }
        onMouseEnter(e) {
            this.mouseOver = true;
        }
        onMouseLeave(e) {
            this.mouseOver = false;
            this.clickOnUp = false;
        }
        onMouseDown(e) {
            this.clickOnUp = true;
        }
        onMouseUp(e) {
            if (this.clickOnUp && this.onClick) {
                this.onClick();
            }
            this.clickOnUp = false;
        }
    }
    exports.Button = Button;
    class CloseButton extends Button {
        constructor() {
            super('X', () => this.parent.close());
            this.color = 'red';
        }
        onAdd() {
            this.rect.pos.assign(this.parent.rect.pos);
            this.rect.pos.x += this.parent.rect.size.width - 32;
            this.rect.size.width = 32;
            this.rect.size.height = 32;
        }
    }
    exports.CloseButton = CloseButton;
});
