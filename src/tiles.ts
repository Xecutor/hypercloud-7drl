import { MapAccessor } from './generators';
import { Pos } from 'utils';
import { Entity } from './entity';

export const dirs=['t','b','l','r'];
export const dirX=[0,0,-1,1];
export const dirY=[-1,1,0,0];

export enum DIR{
    t,
    b,
    l,
    r
}

export const inverseDir=[DIR.b,DIR.t,DIR.r,DIR.l];


export interface TileBase{
    passable:boolean;
    getTileName(conn:Array<boolean>);
}

export class WallTile implements TileBase{
    passable=false;
    connector=false;
    getTileName(conn:Array<boolean>)
    {
        if(this.connector)return 'connector';
        let rv='wall-';
        for(let idx in conn)
        {
            if(conn[idx]) {
                rv+=dirs[idx];
            }
        }
        return rv;
    }
}

export class FloorTile implements TileBase{
    passable=true;
    getTileName(conn:Array<boolean>)
    {
        let rv='floor-';
        for(let idx in conn)
        {
            if(conn[idx]) {
                rv+=dirs[idx];
            }
        }
        return rv;
    }
}

export class TileInfo{
    tileName:string;
    tileFrame:number;
    tile:TileBase;
    entity:Entity;
    passable:boolean;
    conn=[false,false,false,false]
    constructor(tile:TileBase)
    {
        this.tile=tile;
        this.tileFrame=0;
        this.passable=tile.passable;
    }
    update()
    {
        this.tileName=this.tile.getTileName(this.conn);
    }
    addConn(dir)
    {
        this.conn[dir]=true;
        return this;
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
            if(!ti)ti=this.m.mapSet(this.pos.x, this.pos.y, new FloorTile());
            if(i<steps-1)ti.addConn(dir);
            ti.addConn(inverseDir[dir]);
        }
        return this;
    }
}
