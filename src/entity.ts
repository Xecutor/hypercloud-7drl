import { Pos } from 'utils';

export abstract class Entity{
    tileName:string;
    tileFrame:number=0;
    pos=new Pos();
    alive=true;
    isMalicious=true;
    onFrame(frame)
    {
        this.tileFrame=frame;
        return this.alive;
    }
    abstract getDescription();
    abstract decInt(val);
    abstract getInt():number;
}
