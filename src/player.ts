import { Program, SecurityAnalyzer, BruteForce } from './programs';
import { Resource, RES } from './resources';
import { Entity, EntityFraction } from './entity';

export class Player extends Entity {
    fraction=EntityFraction.system;
    resources:Array<Resource>=[
        new Resource('CPU', 'red'),
        new Resource('RAM', 'green'),
        new Resource('HDD', 'yellow'),
        new Resource('NET', 'cyan'),
        new Resource('INT', 'gold'),
    ];
    
    programs:Array<Program>=[new SecurityAnalyzer, new BruteForce];

    constructor()
    {
        super();
        this.tileName='player';
        this.resources[RES.cpu].maxValue=10;
        this.resources[RES.ram].maxValue=20;
        this.resources[RES.hdd].maxValue=40;
        this.resources[RES.net].maxValue=15;
        this.resources[RES.int].value=100;
        this.resources[RES.int].maxValue=100;
    }
    getResource(idx)
    {
        return this.resources[idx];
    }
    getDescription()
    {
        return 'Player';
    }
    decInt(val)
    {
        this.resources[RES.int].value-=val;
        if(this.resources[RES.int].value<0) {
            this.alive=false;
        }
    }
    getInt()
    {
        return this.resources[RES.int].value;
    }
}