define(["require", "exports", "./uibase", "./graphics"], function (require, exports, uibase_1, graphics_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Label extends uibase_1.UIBase {
        constructor(pos, label, color = 'white', fontSize = 16) {
            super();
            this.label = label;
            this.color = color;
            this.fontSize = fontSize;
            this.rect.pos.assign(pos);
            this.rect.size.assign(graphics_1.getTextSize(label));
        }
        draw() {
            graphics_1.setFontSize(this.fontSize);
            graphics_1.textout(this.rect.pos.x, this.rect.pos.y, this.color, this.label);
        }
    }
    exports.Label = Label;
});
