import {Pos, Size, Rect} from 'utils';

let canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
//canvas.style.width = window.innerWidth
let ctx = canvas.getContext('2d');

export function getBoundingRect()
{
    return canvas.getBoundingClientRect();
}

export function getSize()
{
    return {width:canvas.width, height:canvas.height};
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

export function fillrect(r:Rect, clr:string)
{
    ctx.fillStyle=clr;
    ctx.fillRect(r.pos.x, r.pos.y, r.size.width, r.size.height);
}

export function textout(x: number, y: number, clr: string, txt: string)
{
    ctx.textAlign='left';
    ctx.textBaseline='top';
    ctx.fillStyle = clr;
    ctx.font = "48px red, serif";
    ctx.fillText(txt, x, y);
}
