import { Pos } from 'utils';

export class Entity{
    tileName:string;
    tileFrame:number=0;
    pos:Pos;
    alive=true;
    onFrame(frame)
    {
        this.tileFrame=frame;
        return this.alive;
    }
}
