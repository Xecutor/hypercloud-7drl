import { TileManager } from './tilemanager';
import { FwdAndBackAnimation } from './animation';
import { uiManager } from './uimanager';
import { Entity } from './entity';

export class Muncher extends Entity {
    int:number=100;
    constructor()
    {
        super();
        this.tileName='muncher';
        uiManager.addAnimation(new FwdAndBackAnimation((frame)=>this.onFrame(frame),4))
    }
    getDescription()
    {
        return 'Muncher';
    }
    decInt(val)
    {
        this.int-=val;
        if(this.int<0)this.alive=false;
    }
    getInt()
    {
        return this.int;
    }
}

export class Spyware extends Entity {
    int:number=100;
    constructor()
    {
        super();
        this.tileName='spyware';
        uiManager.addAnimation(new FwdAndBackAnimation((frame)=>this.onFrame(frame),TileManager.instance.getTileFrames(this.tileName)));
    }
    getDescription()
    {
        return 'Spyware';
    }
    decInt(val)
    {
        this.int-=val;
        if(this.int<0)this.alive=false;
    }
    getInt()
    {
        return this.int;
    }
}
