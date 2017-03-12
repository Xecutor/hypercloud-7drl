import { Game } from './game';
import { Animation, FwdAndBackAnimation } from './animation';
import { tileSize, TileManager } from './tilemanager';
import { Player } from './player';
import { TestGenerator } from './generators';
import { Level } from './level';
import { uiManager } from './uimanager';
import { UIContainer } from './uicontainer';
import * as gr from './graphics';
import {Mousetrap} from './mousewrap';
import { UIBase, MyMouseEvent } from './uibase';
import { Rect, Size, Pos } from './utils';
import { Hud } from "./hud";

const versionInfo = 'v0.2';
const author='Made by Konstantin Stupnik aka Xecutor for 7DRL 2017 ';

export class MenuItem extends UIBase {
    color:string = 'white';
    label:string;
    mouseOver=false;
    onClick:()=>void;
    constructor(label:string, onClick:()=>void) 
    {
        super();
        this.label=label;
        this.onClick=onClick;
    }
    draw()
    {
        gr.setFontSize(32);
        gr.rect(this.rect, 'cyan', 2, this.mouseOver?10:0);
        let pos=this.rect.size.toPos().sub(gr.getTextSize(this.label).toPos()).div(2).add(this.rect.pos);
        gr.textout(pos.x, pos.y, this.color, this.label);
    }
    onMouseEnter(e:MyMouseEvent)
    {
        this.mouseOver=true;
    }
    onMouseLeave(e:MyMouseEvent)
    {
        this.mouseOver=false;
    }
    onMouseDown(e:MyMouseEvent)
    {
        if(this.onClick) {
            this.onClick();
        }
    }
}

let logo:Array<string>=[
    'br bl br bl    br bl br bl    br lr lr bl    br lr lr bl    br lr lr bl    br lr lr bl    br bl          br lr lr bl    br bl br bl    br lr bl    ',
    'tb tb tb tb    tb tb tb tb    tb br bl tb    tb br lr tl    tb br bl tb    tb br lr tl    tb tb          tb br bl tb    tb tb tb tb    tb    tr bl ',
    'tb tr tl tb    tb tr tl tb    tb tr tl tb    tb tr lr bl    tb tr tl tb    tb tb          tb tb          tb tb tb tb    tb tb tb tb    tb tbrbl tb ',
    'tb br bl tb    tr lr bl tb    tb br lr tl    tb br lr tl    tb br blrtl    tb tb          tb tb          tb tb tb tb    tb tb tb tb    tb tbrtl tb ',
    'tb tb tb tb    br lr tl tb    tb tb          tb tr lr bl    tb tb tbrbl    tb tr lr bl    tb tr lr bl    tb tr tl tb    tb tr tl tb    tb    br tl ',
    'tr tl tr tl    tr lr lr tl    tr tl          tr lr lr tl    tr tl tr tl    tr lr lr tl    tr lr lr tl    tr lr lr tl    tr lr lr tl    tr lr tl    '
]

export class MainMenu extends UIContainer {
    ani:FwdAndBackAnimation=null;
    frame:number;
    constructor()
    {
        super();
        let m : MenuItem = new MenuItem('Start',()=>this.startGame());
        let pos=this.rect.size.toPos().div(2);
        const menuWidth=256;
        pos.x-=menuWidth/2;
        m.rect = new Rect(pos.clone(), new Size(menuWidth, 64));
        this.add(m);
        pos.y+=64+32;
        m = new MenuItem('Quit',()=>this.quitGame());
        m.rect = new Rect( pos.clone(), new Size(menuWidth, 64));
        this.add(m);
    }
    startGame()
    {
        this.close();
        uiManager.add(new Game());
    }
    quitGame()
    {

    }
    draw()
    {
        super.draw();
        for(let i in logo) {
            let l=logo[i];
            let y=tileSize*<any>i;
            let pos=new Pos((this.rect.size.width-50*tileSize)/2, y);
            for(let idx=0;idx<l.length;idx+=3,pos.x+=tileSize) {
                let code=l.substr(idx, 3);
                while(code.length && code.charAt(code.length-1)==' ')code=code.substr(0, code.length-1);
                if(code.length==0)continue;
                TileManager.instance.drawTile(pos, 'wall-'+code, this.frame);
            }
        }
        gr.setFontSize(16);
        let vsz=gr.getTextSize(versionInfo);
        let y=this.rect.size.height-vsz.height;
        gr.textout(0, y, 'cyan', author);
        gr.textout(this.rect.size.width-vsz.width, y, 'cyan', versionInfo);
        if(Math.random()<1/(25*5) && !this.ani) {
            this.ani=new FwdAndBackAnimation((frame)=>this.onFrame(frame), 4, 0);
            uiManager.addAnimation(this.ani)
        }
    }
    onFrame(frame)
    {
        this.frame=frame;
        if(!this.frame) {
            this.ani=null;
        }
        return frame!=0;
    }
}

