import { Label } from './label';
import { Program } from './programs';
import { UIContainer } from './uicontainer';
import { CloseButton, Button } from './button';
import { Pos } from './utils';
import { Player } from './player';
import { UIBase, MyMouseEvent } from './uibase';
import * as gr from './graphics';

let table=[
    {label:'Name', width: 300},
    {label:'Type', width: 100},
    {label:'CPU', width: 50},
    {label:'Mem', width: 50},
]


class ProgramItem extends UIContainer {
    program:Program;
    descrLabel:Label;
    constructor(pos:Pos, program:Program,descrLabel:Label)
    {
        super();
        this.program=program;
        this.descrLabel=descrLabel;
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
            let b=new Button('Load', ()=>this.loadProgram(),16);
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
    }
    onMouseLeave(e:MyMouseEvent)
    {
        super.onMouseLeave(e);
        this.descrLabel.label='';
    }
    loadProgram()
    {

    }
    executeProgram()
    {
        
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
        player.programs.forEach((prog)=>this.add(new ProgramItem(pos, prog, this.descrLabel)));

    }
    draw()
    {
        gr.fillrect(this.rect, '#202020');
        gr.rect(this.rect, 'cyan', 1);
        super.draw();
    }
}