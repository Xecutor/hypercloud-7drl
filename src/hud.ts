import { TileManager, tileSize, tileFullSize } from './tilemanager';
import { MapAccessor } from './generators';
import { Player } from './player';
import { UIContainer } from 'uicontainer';
import { UIBase, MyMouseEvent } from './uibase';
import * as gr from './graphics';
import { Mousetrap } from './mousewrap';
import { Rect } from "./utils";
import { RES } from "./resources";

export const hudWIdth=320;

export class Hud extends UIContainer{
    player:Player;
    map:MapAccessor;
    constructor(player:Player, map:MapAccessor)
    {
        super();
        this.player=player;
        this.map=map;
        let sz = gr.getAppSize();
        this.rect = new Rect(sz.width-hudWIdth, 0, hudWIdth, sz.height);
    }
    draw()
    {
        gr.rect(this.rect, 'cyan');
        gr.setFontSize(32);
        let pos=this.rect.pos.clone().add(10,10);
        for(let i=0;i<RES.count;++i) {
            let r=this.player.getResource(i);
            let txt=`${r.descr}: ${r.value}/${r.maxValue}`;
            gr.textout(pos.x, pos.y, r.color, txt);
            pos.y+=gr.getTextHeight();
        }
        let ti=this.map.mapGet(this.map.mouseMapPos.x, this.map.mouseMapPos.y);
        if(ti && ti.tile) {
            TileManager.instance.drawTile(pos, ti.tileName, ti.tileFrame);
            pos.y+=tileFullSize;
            gr.setFontSize(16);
            gr.textout(pos.x, pos.y, 'white', ti.tile.getDescription());
            pos.y+= gr.getTextHeight();
            if(ti.entity) {
                TileManager.instance.drawTile(pos, ti.entity.tileName, ti.entity.tileFrame);
                pos.y+=tileFullSize;
                gr.textout(pos.x, pos.y, 'white', ti.entity.getDescription());
            } 
        }
        gr.textout(this.rect.pos.x, this.rect.pos.y+this.rect.size.height-gr.getTextHeight(), 'white', `${this.map.mouseMapPos.x},${this.map.mouseMapPos.y}`);
    }
}
