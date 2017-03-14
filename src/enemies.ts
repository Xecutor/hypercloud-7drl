import { AI, FleeingAI } from './ai';
import { MapAccessor } from './generators';
import { TileManager } from './tilemanager';
import { FwdAndBackAnimation } from './animation';
import { uiManager } from './uimanager';
import { Entity, EntityFraction } from './entity';

abstract class EnemyBase extends Entity {
    ai:AI;
    fraction=EntityFraction.malicious;    
    int:number=100;
    onTurn(map:MapAccessor)
    {
        this.ai.think(map, this);
    }
    animate()
    {
        uiManager.addAnimation(new FwdAndBackAnimation((frame)=>this.onFrame(frame),TileManager.instance.getTileFrames(this.tileName) - 1));
    }
}

export class Muncher extends EnemyBase {
    constructor()
    {
        super();
        this.ai=new FleeingAI();
        this.tileName='muncher';
        this.animate();
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

export class Spyware extends EnemyBase {
    constructor()
    {
        super();
        this.ai=new FleeingAI();
        this.tileName='spyware';
        this.animate();
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
