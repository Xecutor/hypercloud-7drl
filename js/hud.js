define(["require", "exports", "./label", "./button", "./tilemanager", "uicontainer", "./graphics", "./utils", "./resources"], function (require, exports, label_1, button_1, tilemanager_1, uicontainer_1, gr, utils_1, resources_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hudWIdth = 320;
    class Hud extends uicontainer_1.UIContainer {
        constructor(player, map, actions) {
            super();
            this.resLabels = [];
            this.player = player;
            this.map = map;
            let sz = gr.getAppSize();
            this.rect = new utils_1.Rect(sz.width - exports.hudWIdth, 0, exports.hudWIdth, sz.height);
            let pos = this.rect.pos.clone().add(10, 10);
            for (let i = 0; i < resources_1.RES.count; ++i) {
                let r = player.getResource(i);
                let l = new label_1.Label(pos, '', r.color, 16);
                this.add(l);
                pos.y += gr.getTextHeight();
                this.resLabels[i] = l;
            }
            pos.y += 4;
            let b = new button_1.Button('Prog', () => actions.openPrograms(), 16);
            b.rect.pos.assign(pos);
            this.add(b);
            let bpos = pos.clone();
            bpos.x += b.rect.size.width + 4;
            b = new button_1.Button('Conn', () => actions.toggleConnMode(), 16);
            this.add(b);
            b.rect.pos.assign(bpos);
            bpos.x += b.rect.size.width + 4;
            b = new button_1.Button('Branch', () => actions.addBranch(), 16);
            b.rect.pos.assign(bpos);
            this.add(b);
            bpos.x += b.rect.size.width + 4;
            b = new button_1.Button('Next', () => actions.nextConnect(), 16);
            b.rect.pos.assign(bpos);
            this.add(b);
            pos.y += 20;
            this.dynStart = pos;
        }
        divLine(pos) {
            pos.y += 4;
            gr.line(pos.clone().sub(10, 0), pos.clone().add(this.rect.size.width, 0), 'cyan', 0.5);
            pos.y += 4;
        }
        draw() {
            gr.rect(this.rect, 'cyan', 1);
            let pos = this.dynStart.clone();
            for (let i = 0; i < resources_1.RES.count; ++i) {
                let r = this.player.getResource(i);
                let txt = `${r.descr}: ${r.value}/${r.maxValue}`;
                this.resLabels[i].label = txt;
            }
            super.draw();
            this.divLine(pos);
            let ti = this.map.mapGet(this.map.mouseMapPos.x, this.map.mouseMapPos.y);
            if (ti && ti.tile) {
                tilemanager_1.TileManager.instance.drawTile(pos, ti.tileName, ti.tileFrame);
                pos.y += tilemanager_1.tileFullSize;
                gr.textout(pos.x, pos.y, 'white', ti.tile.getDescription());
                pos.y += gr.getTextHeight();
                this.divLine(pos);
                if (ti.entity) {
                    tilemanager_1.TileManager.instance.drawTile(pos, ti.entity.tileName, ti.entity.tileFrame);
                    pos.y += tilemanager_1.tileFullSize;
                    gr.textout(pos.x, pos.y, 'white', ti.entity.getDescription());
                    pos.y += gr.getTextHeight();
                    this.divLine(pos);
                }
            }
            gr.textout(this.rect.pos.x, this.rect.pos.y + this.rect.size.height - gr.getTextHeight(), 'white', `${this.map.mouseMapPos.x},${this.map.mouseMapPos.y}`);
        }
    }
    exports.Hud = Hud;
});
