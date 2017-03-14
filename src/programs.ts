import { Entity } from "./entity";

export interface Program {
    cpuCost:number;
    memCost:number;
    name:string;
    descr:string;
    isBackground:boolean;
    backgroundStep?();
    execute?(target:Entity);
}

export class SecurityAnalyzer implements Program{
    cpuCost=3;
    memCost=2;
    dmg=25;
    name="Security analyzer";
    descr=`Reduces integrity of malicious target by ${this.dmg}.`;
    isBackground=false;
    execute(target:Entity)
    {

    }
}

export class BruteForce implements Program {
    cpuCost=1;
    memCost=4;
    dmg=30;
    name="Brute force attack";
    descr=`Reduces integrity of malicious target on contact by ${this.dmg}.`;
    isBackground=true;
    backgroundStep()
    {

    }
}