import { uiManager } from 'uimanager';
import { UIBase, MyMouseEvent } from './uibase';
import * as gr from 'graphics';
import { Mousetrap } from 'mousewrap';

export class Hud extends UIBase{
    id:number;
    cnt:number=0;
    img:HTMLImageElement;
    constructor()
    {
        super();
        this.rect = uiManager.appRect.clone();
        this.id=setInterval(()=>this.draw(), 40);
        this.prepare();
    }
    prepare()
    {
        this.img=new Image;
        let tmpcon=document.createElement('canvas');
        tmpcon.width=25*(32+12);
        tmpcon.height=32+12;
        let tmpctx=tmpcon.getContext('2d');
        tmpctx.lineWidth = 2;
        tmpctx.shadowBlur = 8;
        tmpctx.shadowColor = 'cyan';
        tmpctx.strokeStyle = 'cyan';
        for(let i=0;i<25;++i)
        {
            for(let j=0;j<4;++j)
            {
                let a=Math.PI*2*i/25;
                tmpctx.beginPath();
                let cx = 6 + 16 + i*(32+12);
                let cy = 16+6;
                //tmpctx.arc(cx, cy, 14, 0, Math.PI*2);
                tmpctx.moveTo(cx,cy);
                let rx = cx + 14*Math.cos(a);
                let ry = cy  +14*Math.sin(a);
                tmpctx.lineTo(rx, ry);
                tmpctx.stroke();
            }
        }
        this.img.src = tmpcon.toDataURL();
    }
    draw()
    {
        let canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
        //canvas.style.width = window.innerWidth
        let ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        //ctx.shadowBlur = 6;
        //ctx.shadowColor = "cyan";
        ctx.strokeStyle = "cyan";
        gr.clear();
        ctx.rect(50,50,25*32,25*32);
        ctx.stroke();
        for(let x=0;x<25;++x) {
            for(let y=0;y<25;++y) {
                let d = Math.sqrt((x-12)*(x-12)+(y-12)*(y-12));
                let idx = ((this.cnt + d*2)%25)|0;
                //let idx = ((this.cnt + x+y)%25)|0;
                //let idx = ((this.cnt + 25*Math.cos(x/3)*Math.sin(y/3)+25)%25)|0;
                ctx.drawImage(this.img, idx*(32+12), 0, 32+12, 32+12, 50+x*32-6, 50+y*32-6, 32+12, 32+12);
                
                /*ctx.beginPath();
                let cx = 16+x*32;
                let cy = 16+y*32;
                ctx.arc(cx, cy,14,0,Math.PI*2);
                ctx.moveTo(cx,cy);
                let a = this.cnt+x/Math.PI+y/Math.PI;
                let rx = cx+14*Math.cos(a);
                let ry = cy+14*Math.sin(a);
                ctx.lineTo(rx,ry);
                ctx.stroke();*/
                
            }
        }
        this.cnt++;
    }
    onMouseDown(e:MyMouseEvent)
    {
    }
}
