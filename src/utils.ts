export class Pos{
    x:number = 0;
    y:number = 0;
    constructor();
    constructor(x:number, y:number);
    constructor(x?:number, y?:number)
    {
        if(typeof x === "number") {
            this.x=x;
            this.y=y;
        }
    }
    add(x:number, y:number);
    add(p:Pos);
    add(x:Pos|number, y?:number)
    {
        if(typeof x == "number") {
            this.x+=x;
            this.y+=y;
        }
        else {
            this.x+=x.x;
            this.y+=x.y;
        }
        return this;
    }
    mul(n:number)
    {
        this.x*=n;
        this.y*=n;
        return this;
    }
    div(n:number)
    {
        this.x/=n;
        this.y/=n;
        return this;
    }
    clone()
    {
        return new Pos(this.x, this.y);
    }
}

export class Size{
    width:number = 0;
    height:number = 0;
    constructor();
    constructor(width: number, height:number);
    constructor(width?:number, height?:number)
    {
        if(typeof width === 'number') {
            this.width = width;
            this.height = height;
        }
    }
    clone()
    {
        return new Size(this.width, this.height);
    }
}

export class Rect{
    pos: Pos = new Pos;
    size:Size = new Size;
    constructor();
    constructor(pos:Pos, size:Size);
    constructor(x:number, y:number, width: number, height:number);
    constructor(a?:Pos|number, b?:Size|number, width?:number, height?:number)
    {
        if(typeof a === "number" && typeof b === "number") {
            let x = a;
            let y = b;
            this.pos.x = x;
            this.pos.y = y;
            this.size.width = width;
            this.size.height = height;
        }
        else if(typeof a === "object" && typeof b === "object"){
            this.pos = a;
            this.size = b;
        }
    }
    isInside(pos:Pos)
    {
        return pos.x >= this.pos.x && pos.y >= this.pos.y &&
            pos.x <= this.pos.x + this.size.width &&
            pos.y <= this.pos.y + this.size.height;
    }
    clone()
    {
        return new Rect(this.pos.clone(), this.size.clone());
    }
}
