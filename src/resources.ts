export class Resource{
    descr:string;
    color:string;
    value:number=0;
    maxValue:number;
    constructor(descr, color)
    {
        this.descr=descr;
        this.color=color;
    }
}

export enum RES{
    cpu,
    ram,
    hdd,
    net,
    int,
    count
}
