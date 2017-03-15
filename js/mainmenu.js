define(["require", "exports", "./button", "./game", "./animation", "./tilemanager", "./uimanager", "./uicontainer", "./graphics", "./utils"], function (require, exports, button_1, game_1, animation_1, tilemanager_1, uimanager_1, uicontainer_1, gr, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const versionInfo = 'v0.2';
    const author = 'Made by Konstantin Stupnik aka Xecutor for 7DRL 2017 ';
    let logo = [
        'br bl br bl    br bl br bl    br lr lr bl    br lr lr bl    br lr lr bl    br lr lr bl    br bl          br lr lr bl    br bl br bl    br lr bl    ',
        'tb tb tb tb    tb tb tb tb    tb br bl tb    tb br lr tl    tb br bl tb    tb br lr tl    tb tb          tb br bl tb    tb tb tb tb    tb    tr bl ',
        'tb tr tl tb    tb tr tl tb    tb tr tl tb    tb tr lr bl    tb tr tl tb    tb tb          tb tb          tb tb tb tb    tb tb tb tb    tb tbrbl tb ',
        'tb br bl tb    tr lr bl tb    tb br lr tl    tb br lr tl    tb br blrtl    tb tb          tb tb          tb tb tb tb    tb tb tb tb    tb tbrtl tb ',
        'tb tb tb tb    br lr tl tb    tb tb          tb tr lr bl    tb tb tbrbl    tb tr lr bl    tb tr lr bl    tb tr tl tb    tb tr tl tb    tb    br tl ',
        'tr tl tr tl    tr lr lr tl    tr tl          tr lr lr tl    tr tl tr tl    tr lr lr tl    tr lr lr tl    tr lr lr tl    tr lr lr tl    tr lr tl    '
    ];
    class MainMenu extends uicontainer_1.UIContainer {
        constructor() {
            super();
            this.ani = null;
            let m = new button_1.Button('Start', () => this.startGame());
            let pos = this.rect.size.toPos().div(2);
            const menuWidth = 256;
            pos.x -= menuWidth / 2;
            m.rect = new utils_1.Rect(pos.clone(), new utils_1.Size(menuWidth, 64));
            this.add(m);
            pos.y += 64 + 32;
            m = new button_1.Button('Quit', () => this.quitGame());
            m.rect = new utils_1.Rect(pos.clone(), new utils_1.Size(menuWidth, 64));
            this.add(m);
        }
        startGame() {
            this.close();
            uimanager_1.uiManager.add(new game_1.Game());
        }
        quitGame() {
        }
        draw() {
            super.draw();
            for (let i in logo) {
                let l = logo[i];
                let y = tilemanager_1.tileSize * i;
                let pos = new utils_1.Pos((this.rect.size.width - 50 * tilemanager_1.tileSize) / 2, y);
                for (let idx = 0; idx < l.length; idx += 3, pos.x += tilemanager_1.tileSize) {
                    let code = l.substr(idx, 3);
                    while (code.length && code.charAt(code.length - 1) == ' ')
                        code = code.substr(0, code.length - 1);
                    if (code.length == 0)
                        continue;
                    tilemanager_1.TileManager.instance.drawTile(pos, 'wall-' + code, this.frame);
                }
            }
            gr.setFontSize(16);
            let vsz = gr.getTextSize(versionInfo);
            let y = this.rect.size.height - vsz.height;
            gr.textout(0, y, 'cyan', author);
            gr.textout(this.rect.size.width - vsz.width, y, 'cyan', versionInfo);
            if (Math.random() < 1 / (25 * 5) && !this.ani) {
                this.ani = new animation_1.FwdAndBackAnimation((frame) => this.onFrame(frame), 4, 0);
                uimanager_1.uiManager.addAnimation(this.ani);
            }
        }
        onFrame(frame) {
            this.frame = frame;
            if (!this.frame) {
                this.ani = null;
            }
            return frame != 0;
        }
    }
    exports.MainMenu = MainMenu;
});
