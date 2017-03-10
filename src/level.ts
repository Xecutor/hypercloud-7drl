import { TileManager } from './tilemanager';
import { hudWIdth } from './hud';
import { UIBase, MyMouseEvent } from './uibase';
import * as gr from './graphics'
import { Rect, Pos } from "./utils";

export class Level extends UIBase {
    shift = new Pos();
    dragStart : Pos = null;
    constructor()
    {
        super();
        let sz=gr.getAppSize();
        this.rect=new Rect(0, 0, sz.width-hudWIdth, sz.height);
    }
    draw()
    {
        const countX = Math.ceil(this.rect.size.width / 32) + 1;
        const countY = Math.ceil(this.rect.size.height / 32) + 1;
        gr.setClip(this.rect);
        let pos = new Pos(this.shift);
        for(let i=0;i<10;++i) {
            let f=i<5?i:9-i;
            TileManager.instance.drawTile(pos, 'wall-tb', f);
            pos.y+=32;
        }
        TileManager.instance.drawTile(pos, 'wall-tr', 0);
        pos.x+=32;
        for(let i=0;i<10;++i) {
            let f=i<5?i:9-i;
            TileManager.instance.drawTile(pos, 'wall-lr', f);
            pos.x+=32;
        }
        TileManager.instance.drawTile(pos, 'circle', 0);
        /*for(let x=0;x<countX;++x) {
            for(let y=0;y<countY;++y) {
                TileManager.instance.drawTile(new Pos(this.shift.x+x*32, this.shift.y+y*32), 'a');
            }
        }*/
        gr.resetClip();
    }
    onMouseDown(e:MyMouseEvent)
    {
        this.dragStart=new Pos(e.x, e.y);
    }
    onMouseUp(e:MyMouseEvent)
    {
        this.dragStart = null;
    }
    onMouseMove(e:MyMouseEvent)
    {
        if(this.dragStart)
        {
            this.shift.x = (e.x-this.dragStart.x)%32;
            this.shift.y = (e.y-this.dragStart.y)%32;
            if(this.shift.x>0)this.shift.x-=32;
            if(this.shift.y>0)this.shift.y-=32;
            console.log(this.shift);
        }
    }
}