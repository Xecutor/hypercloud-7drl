define(["require", "exports", "./uimanager", "./button", "utils", "uicontainer", "./graphics", "./label"], function (require, exports, uimanager_1, button_1, utils_1, uicontainer_1, gr, label_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MessageBox extends uicontainer_1.UIContainer {
        constructor(text, color = 'cyan', fontSize = 32) {
            super();
            let lines = text.split("\n");
            let widths = [];
            let maxWidth = 0;
            gr.setFontSize(fontSize);
            for (let line of lines) {
                let w = gr.getTextSize(line).width;
                widths.push(w);
                if (w > maxWidth)
                    maxWidth = w;
            }
            {
                let w = gr.getTextSize('Close').width + 8;
                if (w > maxWidth)
                    maxWidth = w;
            }
            let height = fontSize * lines.length + 8 + 8 + 4 + fontSize + 4;
            maxWidth += 16;
            this.rect.size.width = maxWidth;
            this.rect.size.height = height;
            this.rect.pos = gr.getAppSize().toPos().sub(this.rect.size.toPos()).div(2);
            let pos = this.rect.pos.clone();
            pos.y += 8;
            for (let i = 0; i < lines.length; ++i) {
                let x = pos.x + (maxWidth - widths[i]) / 2;
                let y = pos.y;
                let l = new label_1.Label(new utils_1.Pos(x, y), lines[i], color, fontSize);
                this.add(l);
                pos.y += fontSize;
            }
            let b = new button_1.Button('Close', () => this.close(), fontSize);
            b.rect.pos.x = pos.x + (maxWidth - b.rect.size.width) / 2;
            b.rect.pos.y = pos.y + 8;
            this.add(b);
            this.add(new button_1.CloseButton);
            this.bindings.bind('escape', () => this.close());
        }
        draw() {
            gr.fillrect(this.rect, '#202020');
            gr.rect(this.rect, 'cyan', 1);
            super.draw();
        }
    }
    exports.MessageBox = MessageBox;
    function showMessageBox(text, color = 'cyan', fontSize = 32) {
        uimanager_1.uiManager.showModal(new MessageBox(text, color, fontSize));
    }
    exports.showMessageBox = showMessageBox;
});
