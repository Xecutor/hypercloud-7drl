export class Pos{
    x:number = 0;
    y:number = 0;
    constructor();
    constructor(pos:Pos);
    constructor(x:number, y:number);
    constructor(xOrPos?:Pos|number, y?:number)
    {
        if(typeof xOrPos === "number") {
            this.x=xOrPos;
            this.y=y;
        }
        else if(xOrPos instanceof Pos) {
            this.x=xOrPos.x;
            this.y=xOrPos.y;
        }
    }
    assign(pos:Pos):Pos;
    assign(x:number, y:number):Pos;
    assign(xOrPos:Pos|number, y?:number):Pos
    {
        if(xOrPos instanceof Pos) {
            this.x=xOrPos.x;
            this.y=xOrPos.y;
        }
        else {
            this.x=xOrPos;
            this.y=y;
        }
        return this;
    }
    add(x:number, y:number):Pos;
    add(p:Pos):Pos;
    add(x:Pos|number, y?:number):Pos
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
    sub(x:number, y:number):Pos;
    sub(p:Pos):Pos;
    sub(x:Pos|number, y?:number):Pos
    {
        if(typeof x == "number") {
            this.x-=x;
            this.y-=y;
        }
        else {
            this.x-=x.x;
            this.y-=x.y;
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
    clamp(rect:Rect)
    {
        if(this.x<rect.pos.x)this.x=rect.pos.x;
        if(this.x>rect.pos.x+rect.size.width)this.x=rect.pos.x+rect.size.width;
        if(this.y<rect.pos.y)this.y=rect.pos.y;
        if(this.y>rect.pos.y+rect.size.height)this.y=rect.pos.y+rect.size.height;
        return this;
    }
    toSize()
    {
        return new Size(this.x, this.y);
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
    toPos()
    {
        return new Pos(this.width, this.height);
    }
}

export class RectIterator{
    rect:Rect;
    value:Pos=null;
    constructor(rect:Rect)
    {
        this.rect=rect;
    }
    next()
    {
        if(this.value) {
            let maxY=this.rect.pos.y+this.rect.size.height;
            if(this.value.y>maxY) {
                return false;
            }
            this.value.x+=1;
            if(this.value.x>this.rect.pos.x+this.rect.size.width) {
                this.value.x=this.rect.pos.x;
                this.value.y+=1;
            }
            return this.value.y<=maxY;
        }
        else {
            this.value=this.rect.pos.clone();
        }
        return true;
    }
}

export class Rect {
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
    bottomRight(newValue?:Pos)
    {
        if(newValue) {
            if(newValue.x>this.pos.x) {
                this.size.width=newValue.x-this.pos.x;
            }
            if(newValue.y>this.pos.y) {
                this.size.height=newValue.y-this.pos.y;
            }
        }
        return this.pos.clone().add(this.size.width, this.size.height);
    }
    getIterator()
    {
        return new RectIterator(this);
    }
}
