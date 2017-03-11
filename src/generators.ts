import { ConnectionPiece } from './connection';
import { Player } from './player';
import { LevelGenerator } from './generators';
import { Pos, Rect } from './utils';
import { TileInfo, TileBase, WallTile, dirX, dirY, FloorTurtle, DIR, FloorTile } from './tiles';
import { BasicEnemy } from "./enemies";

export interface MapAccessor{
    mapRect:Rect;
    mapGet(x:number, y:number):TileInfo;
    mapSet(x:number, y:number, tile:TileBase):TileInfo;
    mapSet(pos:Pos, tile:TileBase):TileInfo;
    setEntrance(pos:Pos);
}

export interface LevelGenerator{
    generate(m:MapAccessor);
}

export class TestGenerator implements LevelGenerator {
    fixWallConn(m:MapAccessor)
    {
        for(let it=m.mapRect.getIterator();it.next();) {
            let ti=m.mapGet(it.value.x, it.value.y);
            if(!ti || !(ti.tile instanceof WallTile))continue;
            for(let i=0;i<4;++i) {
                let n=m.mapGet(it.value.x+dirX[i], it.value.y+dirY[i]);
                if(n && n.tile instanceof WallTile) {
                    ti.conn[i]=true;
                }
            }
        }
    }
    generate(m:MapAccessor)
    {
        let pos:Pos;
        for(let i=0;i<31;++i) {
            let w=new WallTile();
            w.connector=i==1;
            m.mapSet(i,0,w);
            m.mapSet(i,30,new WallTile());
            m.mapSet(0, i, new WallTile());
            m.mapSet(30, i, new WallTile());
        }
        this.fixWallConn(m);
        
        let t=new FloorTurtle(m,new Pos(1,1));
        t.move(DIR.r,8).move(DIR.b,8).move(DIR.l,8).move(DIR.t,8).
        goto(new Pos(1,5)).move(DIR.r,8).
        goto(new Pos(5,1)).move(DIR.b,8);

        m.mapGet(1,1).addConn(DIR.t);
    

        for(let it=m.mapRect.getIterator();it.next();) {
            let ti=m.mapGet(it.value.x, it.value.y);
            if(ti && ti.tile) {
                ti.update();
            }
        }

        let ti=m.mapGet(9,9);
        ti.entity=new BasicEnemy();
        m.setEntrance(new Pos(1,1));
    }
}