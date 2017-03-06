import { Pos } from './utils';
import * as gr from './graphics';

export class TileManager{
    static instance = new TileManager();
    cache:HTMLCanvasElement = document.createElement('canvas');
    constructor()
    {
        this.prepare();
    }
    prepare()
    {
        this.cache.width=1024;
        this.cache.height=1024;
        let ctx=this.cache.getContext('2d');
        ctx.lineWidth=2;
        ctx.shadowBlur=8;
        ctx.shadowColor='cyan';
        ctx.strokeStyle='cyan';
        for(let i=0;i<4;++i)
        {
            ctx.beginPath();
            ctx.arc(6+16,6+16,14,0,Math.PI*2);
            ctx.stroke();
        }

    }
    drawTile(pos:Pos, tile:string)
    {
        let ctx=gr.getCtx();
        ctx.drawImage(this.cache, 0, 0, 32+12,32+12,pos.x, pos.y, 32+12,32+12);
    }
}

