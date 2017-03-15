define(["require", "exports", "./label", "./uicontainer", "./button", "./utils", "./graphics", "./msgbox"], function (require, exports, label_1, uicontainer_1, button_1, utils_1, gr, msgbox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let table = [
        { label: 'Name', width: 300 },
        { label: 'Type', width: 200 },
        { label: 'CPU', width: 50 },
        { label: 'Mem', width: 50 },
    ];
    var ProgramAction;
    (function (ProgramAction) {
        ProgramAction[ProgramAction["load"] = 0] = "load";
        ProgramAction[ProgramAction["unload"] = 1] = "unload";
        ProgramAction[ProgramAction["execute"] = 2] = "execute";
    })(ProgramAction || (ProgramAction = {}));
    class ProgramItem extends uicontainer_1.UIContainer {
        constructor(pos, index, program, descrLabel, actionHandler) {
            super();
            this.mouseOver = false;
            this.index = index;
            this.program = program;
            this.descrLabel = descrLabel;
            this.actionHandler = actionHandler;
            this.rect.pos.assign(pos);
            this.build();
            this.autoSize();
            pos.y += this.rect.size.height;
        }
        build() {
            let pos = this.rect.pos.clone();
            pos.add(8, 8);
            let p = this.program;
            let data = [p.name, p.isBackground ? 'Background' : 'Active', p.cpuCost.toString(), p.memCost.toString()];
            for (let i = 0; i < data.length; ++i) {
                this.add(new label_1.Label(pos, data[i]));
                pos.x += table[i].width;
            }
            if (p.isBackground) {
                let b = new button_1.Button(p.loaded ? 'Unload' : 'Load', p.loaded ? () => this.unloadProgram() : () => this.loadProgram(), 16);
                b.rect.pos.assign(pos);
                this.add(b);
            }
            else {
                let b = new button_1.Button('Execute', () => this.executeProgram(), 16);
                b.rect.pos.assign(pos);
                this.add(b);
            }
        }
        onMouseEnter(e) {
            super.onMouseEnter(e);
            this.descrLabel.label = this.program.descr;
            this.mouseOver = true;
        }
        onMouseLeave(e) {
            super.onMouseLeave(e);
            this.descrLabel.label = '';
            this.mouseOver = false;
        }
        loadProgram() {
            this.actionHandler(ProgramAction.load, this.index);
        }
        unloadProgram() {
            this.actionHandler(ProgramAction.unload, this.index);
        }
        executeProgram() {
            this.actionHandler(ProgramAction.execute, this.index);
        }
        draw() {
            if (this.mouseOver) {
                gr.fillrect(this.rect, '#252525');
            }
            super.draw();
        }
    }
    class ProgramList extends uicontainer_1.UIContainer {
        constructor(player) {
            super();
            this.player = player;
            this.rect = gr.getAppRect().clone();
            this.rect.setTopLeft(new utils_1.Pos(100, 100));
            this.rect.bottomRight(this.rect.bottomRight().sub(100, 100));
            this.bindings.bind('escape', () => this.close());
            this.add(new button_1.CloseButton);
            let pos = this.rect.pos.clone();
            for (let t of table) {
                this.add(new label_1.Label(pos, t.label));
                pos.x += t.width;
            }
            this.descrLabel = new label_1.Label(new utils_1.Pos(), 'x');
            this.descrLabel.rect.pos.assign(this.rect.pos);
            this.descrLabel.rect.pos.y += this.rect.size.height - this.descrLabel.rect.size.height - 8;
            this.descrLabel.rect.pos.x += 8;
            this.descrLabel.label = '';
            this.add(this.descrLabel);
            pos.x = this.rect.pos.x;
            pos.y += this.objects[0].rect.size.height;
            let idx = 0;
            player.programs.forEach((prog) => this.add(new ProgramItem(pos, idx++, prog, this.descrLabel, (action, index) => this.onProgramAction(action, index))));
        }
        onProgramAction(action, index) {
            msgbox_1.showMessageBox(`\n${ProgramAction[action]}:${index}`);
        }
        draw() {
            gr.fillrect(this.rect, '#202020');
            gr.rect(this.rect, 'cyan', 1);
            super.draw();
        }
    }
    exports.ProgramList = ProgramList;
});
