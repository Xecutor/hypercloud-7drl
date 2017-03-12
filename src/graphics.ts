import {Pos, Size, Rect} from './utils';

let canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
//canvas.style.width = window.innerWidth
let ctx = canvas.getContext('2d');
let fontSize;
setFontSize(32);

export function getCtx()
{
    return ctx;
}

export function getBoundingRect()
{
    return canvas.getBoundingClientRect();
}

export function getAppSize()
{
    return new Size(canvas.width, canvas.height);
}

export function getAppRect()
{
    return new Rect(0, 0, canvas.width, canvas.height);
}

export function setBg(clr:string)
{
    ctx.fillStyle=clr;
}

export function clear()
{
    ctx.fillStyle='black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //ctx.clearRect(0,0, canvas.width, canvas.height);
}

export function setClip(r:Rect)
{
    ctx.save();
    let path :any = new Path2D();
    path.rect(r.pos.x, r.pos.y, r.size.width, r.size.height);
    ctx.clip(path);
}

export function resetClip()
{
    ctx.restore();
}

export function fillrect(r:Rect, clr:string)
{
    ctx.fillStyle=clr;
    ctx.fillRect(r.pos.x, r.pos.y, r.size.width, r.size.height);
}

export function rect(r:Rect, clr:string, lineWidth?:number, glowSize?:number)
{
    ctx.beginPath();
    ctx.strokeStyle=clr;
    if(lineWidth)ctx.lineWidth=lineWidth;
    if(typeof glowSize === 'number') {
        ctx.shadowBlur=glowSize;
        ctx.shadowColor=clr;
        ctx.shadowOffsetX=0;
        ctx.shadowOffsetY=0;
    }
    ctx.rect(r.pos.x, r.pos.y, r.size.width, r.size.height);
    ctx.stroke();
    if(typeof glowSize === 'number') {
        ctx.shadowBlur=0;
    }
}

export function setFontSize(sz:number)
{
    fontSize=sz;
    ctx.font = sz+"pt courier";
}

export function textout(x: number, y: number, clr: string, txt: string)
{
    ctx.textAlign='left';
    ctx.textBaseline='top';
    ctx.fillStyle = clr;
    ctx.fillText(txt, x, y-fontSize/8);
}

export function getTextSize(txt:string)
{
    let m=ctx.measureText(txt);
    return new Size(m.width, fontSize);
}

export function getTextHeight()
{
    return fontSize;
}