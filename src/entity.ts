import { dirX, dirY } from './tiles';
import { MapAccessor } from './generators';
import { Pos } from 'utils';

export enum EntityFraction {
    neutral,
    system,
    malicious
}

export abstract class Entity{
    tileName:string;
    tileFrame:number=0;
    pos=new Pos();
    alive=true;
    fraction:number = EntityFraction.neutral;
    onFrame(frame)
    {
        this.tileFrame=frame;
        return this.alive;
    }
    abstract getDescription();
    abstract decInt(val);
    abstract getInt():number;

    onTurn(map:MapAccessor)
    {
    }

    move(map:MapAccessor, dir:number)
    {
        let dst=this.pos.clone();
        dst.x+=dirX[dir];
        dst.y+=dirY[dir];
        let srcTi=map.mapGet(this.pos.x, this.pos.y);
        if(!srcTi.conn[dir]) {
            return;
        }
        let dstTi=map.mapGet(dst.x, dst.y);
        if(dstTi.entity) {
            return;
        }
        dstTi.entity=srcTi.entity;
        srcTi.entity=null;
        this.pos=dst;
    }
}
