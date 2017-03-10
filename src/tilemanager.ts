import { Pos, Rect } from './utils';
import * as gr from './graphics';

const tileSize = 32;
const tileGlowSize = 6;
const tileFullSize = tileSize + tileGlowSize*2;
const cacheCanvasWidth = 1024;
const cacheCanvasHeight = 1024;

class FrameInfo{
    outerRect: Rect = new Rect(0, 0, tileFullSize, tileFullSize);
    innerRect: Rect = new Rect(0, 0, tileSize, tileSize);
    setInfo(innerPos:Pos)
    {
        this.innerRect.pos.assign(innerPos);
        this.outerRect.pos.assign(innerPos).add(-tileGlowSize, -tileGlowSize);

    }
}

class CacheRecord{
    frames=new Array<FrameInfo>();
    addFrame(pos:Pos)
    {
        let f=new FrameInfo();
        f.setInfo(pos);
        this.frames.push(f);
    }
}


export class TileManager{
    static instance = new TileManager();
    cacheCanvas:HTMLCanvasElement = document.createElement('canvas');
    cache:{[key:string]:CacheRecord} = {}

    cacheLastIdx:number = 0;


    constructor()
    {
        this.prepare();
    }
    getNextCachePos()
    {
        let idx = this.cacheLastIdx++;
        const tilesPerRow = (cacheCanvasWidth/tileFullSize)|0;
        let y = (( idx / tilesPerRow ) | 0) * tileFullSize;
        let x = ( idx % tilesPerRow ) * tileFullSize;
        return new Pos(x + tileGlowSize, y + tileGlowSize);
    }
    getCacheRecord(name)
    {
        if(name in this.cache) {
            return this.cache[name];
        }
        else {
            let rv=new CacheRecord();
            this.cache[name]=rv;
            return rv;
        }
    }
    prepare()
    {
        this.cacheCanvas.width=cacheCanvasWidth;
        this.cacheCanvas.height=cacheCanvasHeight;
        let ctx=this.cacheCanvas.getContext('2d');
        ctx.lineWidth=2;
        ctx.shadowBlur=tileGlowSize;
        ctx.shadowColor='cyan';
        ctx.strokeStyle='cyan';
        let pos = this.getNextCachePos()
        let r=this.getCacheRecord('circle');
        r.addFrame(pos);
        let c = pos.clone().add(tileSize/2, tileSize/2);
        for(let i=0;i<2;++i)
        {
            ctx.beginPath();
            ctx.arc(c.x,c.y,((tileSize/2)|0) -2,0,Math.PI*2);
            ctx.stroke();
        }

        this.genWalls();

    }
    genWalls()
    {
        let ctx=this.cacheCanvas.getContext('2d');
        ctx.lineWidth=4;
        ctx.lineCap="round";
        let pos:Pos;
        let r=this.getCacheRecord('wall-tb');
        for(let f=0;f<5;++f) {
            pos=this.getNextCachePos();
            console.log(pos);
            r.addFrame(pos);
            for(let i=0;i<1+f;++i) {
                ctx.beginPath();
                ctx.moveTo(pos.x+tileSize/2, pos.y);
                ctx.lineTo(pos.x+tileSize/2, pos.y+tileSize);
                ctx.stroke();
            }
        }

        r=this.getCacheRecord('wall-lr');
        for(let f=0;f<5;++f) {
            pos=this.getNextCachePos();
            console.log(pos);
            r.addFrame(pos);
            for(let i=0;i<1+f;++i) {
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y + tileSize/2);
                ctx.lineTo(pos.x+tileSize, pos.y+tileSize/2);
                ctx.stroke();
            }
        }
        r=this.getCacheRecord('wall-tr');
        for(let f=0;f<5;++f) {
            pos=this.getNextCachePos();
            console.log(pos);
            r.addFrame(pos);
            for(let i=0;i<1+f;++i) {
                ctx.beginPath();
                ctx.moveTo(pos.x+tileSize/2, pos.y);
                ctx.lineTo(pos.x+tileSize/2, pos.y+tileSize/4);
                ctx.arc(pos.x+3*tileSize/4,pos.y+tileSize/4,tileSize/4,Math.PI, Math.PI/2, true);
                ctx.moveTo(pos.x+3*tileSize/4, pos.y+tileSize/2);
                ctx.lineTo(pos.x+tileSize, pos.y+tileSize/2);
                ctx.stroke();
            }
        }
    }
    drawTile(pos:Pos, tileName:string, frame:number = 0)
    {
        let ctx=gr.getCtx();
        //ctx.drawImage(this.cacheCanvas, 0, 0, 300, 300, 0, 0, 300, 300);
        let r=this.cache[tileName];
        if(r && frame<r.frames.length) {
            let fi=r.frames[frame];
            ctx.drawImage(this.cacheCanvas, fi.outerRect.pos.x, fi.outerRect.pos.y,tileFullSize,tileFullSize,pos.x-tileGlowSize, pos.y-tileGlowSize,tileFullSize,tileFullSize);
        }
    }
}

