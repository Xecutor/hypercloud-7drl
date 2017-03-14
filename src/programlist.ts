import { Label } from './label';
import { Program } from './programs';
import { UIContainer } from './uicontainer';
import { CloseButton, Button } from './button';
import { Pos } from './utils';
import { Player } from './player';
import { UIBase, MyMouseEvent } from './uibase';
import * as gr from './graphics';
import { showMessageBox } from "./msgbox";

let table=[
    {label:'Name', width: 300},
    {label:'Type', width: 200},
    {label:'CPU', width: 50},
    {label:'Mem', width: 50},
]

enum ProgramAction {
    load,
    unload,
    execute
}

class ProgramItem extends UIContainer {
    program:Program;
    descrLabel:Label;
    mouseOver=false;
    index:number;
    actionHandler:(action:ProgramAction, index:number)=>void;
    constructor(pos:Pos, index:number, program:Program,descrLabel:Label, actionHandler:(action:ProgramAction, index:number)=>void)
    {
        super();
        this.index=index;
        this.program=program;
        this.descrLabel=descrLabel;
        this.actionHandler=actionHandler;
        this.rect.pos.assign(pos);
        this.build();
        this.autoSize();
        pos.y+=this.rect.size.height;
    }
    build()
    {
        let pos=this.rect.pos.clone();
        pos.add(8,8);
        let p=this.program;
        let data=[p.name, p.isBackground?'Background':'Active', p.cpuCost.toString(), p.memCost.toString()];
        for(let i=0;i<data.length;++i) {
            this.add(new Label(pos, data[i]));
            pos.x+=table[i].width;
        }
        if(p.isBackground) {
            let b=new Button(p.loaded?'Unload':'Load', p.loaded?()=>this.unloadProgram():()=>this.loadProgram(),16);
            b.rect.pos.assign(pos);
            this.add(b)
        }
        else {
            let b=new Button('Execute', ()=>this.executeProgram(),16);
            b.rect.pos.assign(pos);
            this.add(b)
        }
    }
    onMouseEnter(e:MyMouseEvent)
    {
        super.onMouseEnter(e);
        this.descrLabel.label=this.program.descr;
        this.mouseOver=true;
    }
    onMouseLeave(e:MyMouseEvent)
    {
        super.onMouseLeave(e);
        this.descrLabel.label='';
        this.mouseOver=false;
    }
    loadProgram()
    {
        this.actionHandler(ProgramAction.load, this.index);
    }
    unloadProgram()
    {
        this.actionHandler(ProgramAction.unload, this.index);
    }
    executeProgram()
    {
        this.actionHandler(ProgramAction.execute, this.index);
    }
    draw()
    {
        if(this.mouseOver) {
            gr.fillrect(this.rect, '#252525');
        }
        super.draw();
    }
}

export class ProgramList extends UIContainer {
    player:Player;
    descrLabel:Label;
    constructor(player:Player)
    {
        super();
        this.player=player;
        this.rect=gr.getAppRect().clone();
        this.rect.setTopLeft(new Pos(100,100));
        this.rect.bottomRight(this.rect.bottomRight().sub(100,100));
        this.bindings.bind('escape',()=>this.close());
        this.add(new CloseButton);
        let pos=this.rect.pos.clone();
        for(let t of table) {
            this.add(new Label(pos, t.label));
            pos.x+=t.width;
        }

        this.descrLabel=new Label(new Pos(), 'x');
        this.descrLabel.rect.pos.assign(this.rect.pos);
        this.descrLabel.rect.pos.y+=this.rect.size.height-this.descrLabel.rect.size.height-8;
        this.descrLabel.rect.pos.x+=8;
        this.descrLabel.label='';
        this.add(this.descrLabel);
        
        pos.x=this.rect.pos.x;
        pos.y+=this.objects[0].rect.size.height;
        let idx=0;
        player.programs.forEach((prog)=>this.add(new ProgramItem(pos, idx++, prog, this.descrLabel, (action:ProgramAction, index:number)=>this.onProgramAction(action,index))));

    }
    onProgramAction(action:ProgramAction, index:number)
    {
        showMessageBox(`\n${ProgramAction[action]}:${index}`);
    }

    draw()
    {
        gr.fillrect(this.rect, '#202020');
        gr.rect(this.rect, 'cyan', 1);
        super.draw();
    }
}