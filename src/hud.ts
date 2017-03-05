import { UIBase } from './uibase';
import * as gr from 'graphics';
import { Mousetrap } from 'mousewrap';

export class Hud extends UIBase{
    id:number;
    cnt:number=0;
    img:HTMLImageElement;
    constructor()
    {
        super();
        this.id=setInterval(()=>this.draw(), 40);
        this.prepare();
    }
    prepare()
    {
        this.img=new Image;
        let tmpcon=document.createElement('canvas');
        tmpcon.width=25*(32+4);
        tmpcon.height=32;
        let tmpctx=tmpcon.getContext('2d');
        tmpctx.shadowBlur = 5;
        tmpctx.shadowColor = 'cyan';
        tmpctx.strokeStyle = 'cyan';
        for(let i=0;i<25;++i)
        {
            let a=Math.PI*2*i/25;
            tmpctx.beginPath();
            let cx = 2 + 16 + i*36;
            let cy = 16;
            tmpctx.arc(cx, cy, 14, 0, Math.PI*2);
            tmpctx.moveTo(cx,cy);
            let rx = cx + 14*Math.cos(a);
            let ry = cy  +14*Math.sin(a);
            tmpctx.lineTo(rx, ry);
            tmpctx.stroke();
        }
        this.img.src = tmpcon.toDataURL();
    }
    draw()
    {
        let canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
        //canvas.style.width = window.innerWidth
        let ctx = canvas.getContext('2d');
        ctx.lineWidth = 3;
        //ctx.shadowBlur = 1;
        //ctx.shadowColor = "cyan";
        ctx.strokeStyle = "cyan";
        gr.clear();
        for(let x=0;x<40;++x) {
            for(let y=0;y<25;++y) {
                let idx = (this.cnt +x +y)%25;
                ctx.drawImage(this.img, 2 + idx*36, 0, 32, 32, x*32, y*32, 32, 32);
                /*
                ctx.beginPath();
                let cx = 16+x*32;
                let cy = 16+y*32;
                ctx.arc(cx, cy,16,0,Math.PI*2);
                let a0 = this.cnt*2+Math.PI*x*y/40/25;
                let dx = Math.cos(a0);
                let dy = Math.sin(a0);
                let c = ((this.cnt*5) % 64);
                if(c>=32)c=64-c;
                c-=16;
                let rx0 = cx+c*dx;
                let ry0 = cy+c*dy;
                ctx.moveTo(rx0,ry0);
                let a = this.cnt+x/Math.PI+y/Math.PI;
                let rx = cx+16*Math.cos(a);
                let ry = cy+16*Math.sin(a);
                ctx.lineTo(rx,ry);
                ctx.stroke();
                */
            }
        }
        this.cnt++;
    }
}
