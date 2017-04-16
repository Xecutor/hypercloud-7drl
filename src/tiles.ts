import { TileManager } from './tilemanager';
import { FwdAndBackAnimation } from './animation';
import { uiManager } from 'uimanager';
import { MapAccessor } from './generators';
import { Pos } from 'utils';
import { Entity } from './entity';

//export const dirs=['t','b','l','r'];
export const dirX=[0,0,-1,1];
export const dirY=[-1,1,0,0];

export enum DIR{
    t,
    b,
    l,
    r
}

export const inverseDir=[DIR.b,DIR.t,DIR.r,DIR.l];

export function diffToDir(srcX:number, srcY: number, dstX:number, dstY:number)
{
    if(srcX==dstX) {
        return srcY<dstY?DIR.b:DIR.t;
    }
    return srcX<dstX?DIR.r:DIR.l;
}

export interface TileBase{
    passable:boolean;
    animate:boolean;
    getTileName(conn:Array<boolean>);
    getDescription();
}

export class WallTile implements TileBase{
    passable=false;
    connector=false;
    animate=false;
    getTileName(conn:Array<boolean>)
    {
        if(this.connector)return 'connector';
        let rv='wall-';
        for(let idx=0;idx<conn.length;++idx)
        {
            if(conn[idx]) {
                rv+=DIR[idx];
            }
        }
        return rv;
    }

    getDescription()
    {
        return this.connector?'Global network connector':'Global network channel';
    }
}

export class FloorTile implements TileBase{
    passable=true;
    animate=false;
    getTileName(conn:Array<boolean>)
    {
        let rv='floor-';
        for(let idx=0;idx<conn.length;++idx)
        {
            if(conn[idx]) {
                rv+=DIR[idx];
            }
        }
        return rv;
    }
    getDescription()
    {
        return 'Local network channel';
    }
}

export class DataBoxTile implements TileBase{
    passable=false;
    animate=false;
    getTileName(conn:Array<boolean>)
    {
        return 'data-box';
    }
    getDescription()
    {
        return 'Data storage';
    }
}

export class DataProcessorTile implements TileBase{
    passable=false;
    animate=true;
    onFrame(frame)
    {

    }
    getTileName(conn:Array<boolean>)
    {
        return 'data-processor';
    }
    getDescription()
    {
        return 'Data processor';
    }
}


export class TileInfo{
    pos:Pos;
    tileName:string;
    tileFrame:number;
    tile:TileBase;
    entity:Entity;
    passable:boolean;
    floodValue:number;
    floodSeq:number;
    conn=[false,false,false,false]
    constructor(tile:TileBase)
    {
        this.tile=tile;
        this.tileFrame=0;
        if(tile)this.passable=tile.passable;
    }
    update()
    {
        this.tileName=this.tile.getTileName(this.conn);
        if(this.tile.animate) {
            uiManager.addAnimation(
                new FwdAndBackAnimation(
                    (frame)=>this.onFrame(frame), TileManager.instance.getTileFrames(this.tileName)
                )
            );
        }
    }
    onFrame(frame)
    {
        this.tileFrame=frame;
        return true;
    }
    addConn(dir)
    {
        this.conn[dir]=true;
        return this;
    }
    setEntity(entity:Entity)
    {
        this.entity=entity;
        entity.pos.assign(this.pos);
    }
}

export class FloorTurtle{
    m:MapAccessor;
    pos:Pos;
    constructor(m:MapAccessor, pos:Pos)
    {
        this.m=m;
        this.pos=pos;
    }
    goto(pos:Pos)
    {
        this.pos=pos;
        return this;
    }
    move(dir:number, steps:number):FloorTurtle
    {
        let ti=this.m.mapGet(this.pos.x, this.pos.y);
        if(!ti)ti=this.m.mapSet(this.pos.x, this.pos.y, new FloorTile());
        ti.addConn(dir);
        for(let i=0;i<steps;++i) {
            this.pos.x+=dirX[dir];
            this.pos.y+=dirY[dir];
            ti=this.m.mapGet(this.pos.x, this.pos.y);
            if(!ti || !ti.tile)ti=this.m.mapSet(this.pos.x, this.pos.y, new FloorTile());
            if(i<steps-1)ti.addConn(dir);
            ti.addConn(inverseDir[dir]);
        }
        return this;
    }
}
