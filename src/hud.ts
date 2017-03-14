import { Label } from './label';
import { Button } from './button';
import { TileManager, tileSize, tileFullSize } from './tilemanager';
import { MapAccessor } from './generators';
import { Player } from './player';
import { UIContainer } from 'uicontainer';
import { UIBase, MyMouseEvent } from './uibase';
import * as gr from './graphics';
import { Mousetrap } from './mousewrap';
import { Rect, Pos } from "./utils";
import { RES } from "./resources";

export const hudWIdth=320;

export interface PlayerActions{
    openPrograms();
    toggleConnMode();
    addBranch();
    nextConnect();
}

export class Hud extends UIContainer{
    player:Player;
    map:MapAccessor;

    resLabels:Array<Label>=[];

    dynStart:Pos;
    
    constructor(player:Player, map:MapAccessor, actions:PlayerActions)
    {
        super();
        this.player=player;
        this.map=map;
        let sz = gr.getAppSize();
        this.rect = new Rect(sz.width-hudWIdth, 0, hudWIdth, sz.height);
        let pos=this.rect.pos.clone().add(10,10);
        for(let i=0;i<RES.count;++i) {
            let r=player.getResource(i);
            let l=new Label(pos, '', r.color, 16);
            this.add(l);
            pos.y+=gr.getTextHeight();
            this.resLabels[i]=l;
        }
        pos.y+=4;
        let b=new Button('Prog', ()=>actions.openPrograms(), 16);
        b.rect.pos.assign(pos);
        this.add(b);
        let bpos=pos.clone();
        bpos.x+=b.rect.size.width+4;
        b=new Button('Conn',()=>actions.toggleConnMode(), 16);
        this.add(b);
        b.rect.pos.assign(bpos)
        bpos.x+=b.rect.size.width+4;
        b=new Button('Branch', ()=>actions.addBranch(), 16);
        b.rect.pos.assign(bpos);
        this.add(b);
        bpos.x+=b.rect.size.width+4;
        b=new Button('Next', ()=>actions.nextConnect(), 16);
        b.rect.pos.assign(bpos);
        this.add(b);
        pos.y+=20;
        this.dynStart=pos;
    }

    private divLine(pos:Pos)
    {
        pos.y+=4;
        gr.line(pos.clone().sub(10,0),pos.clone().add(this.rect.size.width, 0), 'cyan', 0.5);
        pos.y+=4;
    }

    draw()
    {
        gr.rect(this.rect, 'cyan', 1);

        let pos=this.dynStart.clone();

        for(let i=0;i<RES.count;++i) {
            let r=this.player.getResource(i);
            let txt=`${r.descr}: ${r.value}/${r.maxValue}`;
            this.resLabels[i].label=txt;
        }
        
        super.draw();

        this.divLine(pos);

        let ti=this.map.mapGet(this.map.mouseMapPos.x, this.map.mouseMapPos.y);
        if(ti && ti.tile) {
            TileManager.instance.drawTile(pos, ti.tileName, ti.tileFrame);
            pos.y+=tileFullSize;
            gr.textout(pos.x, pos.y, 'white', ti.tile.getDescription());
            pos.y+= gr.getTextHeight();
            this.divLine(pos);
            if(ti.entity) {
                TileManager.instance.drawTile(pos, ti.entity.tileName, ti.entity.tileFrame);
                pos.y+=tileFullSize;
                gr.textout(pos.x, pos.y, 'white', ti.entity.getDescription());
                pos.y+=gr.getTextHeight();
                this.divLine(pos);
            } 
        }
        gr.textout(this.rect.pos.x, this.rect.pos.y+this.rect.size.height-gr.getTextHeight(), 'white', `${this.map.mouseMapPos.x},${this.map.mouseMapPos.y}`);
    }
}
