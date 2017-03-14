import { uiManager } from './uimanager';
import { Button, CloseButton } from './button';
import { Pos } from 'utils';
import { UIContainer } from 'uicontainer';
import * as gr from './graphics';
import { Label } from './label';

export class MessageBox extends UIContainer {
    constructor(text:string, color:string='cyan', fontSize:number=32)
    {
        super();
        let lines=text.split("\n");
        let widths=[];
        let maxWidth=0;
        gr.setFontSize(fontSize);
        for(let line of lines) {
            let w=gr.getTextSize(line).width;
            widths.push(w);
            if(w>maxWidth)maxWidth=w;
        }
        {
            let w=gr.getTextSize('Close').width+8;
            if(w>maxWidth)maxWidth=w;
        }
        let height=fontSize*lines.length+8+8+4+fontSize+4;

        maxWidth+=16;

        this.rect.size.width=maxWidth;
        this.rect.size.height=height;

        this.rect.pos=gr.getAppSize().toPos().sub(this.rect.size.toPos()).div(2);
        let pos=this.rect.pos.clone();
        pos.y+=8;

        for(let i=0;i<lines.length;++i) {
            let x=pos.x+(maxWidth-widths[i])/2;
            let y=pos.y;
            let l=new Label(new Pos(x,y), lines[i], color, fontSize);
            this.add(l);
            pos.y+=fontSize;
        }
        let b=new Button('Close', ()=>this.close(), fontSize);
        b.rect.pos.x=pos.x+(maxWidth-b.rect.size.width)/2;
        b.rect.pos.y=pos.y+8;
        this.add(b);
        this.add(new CloseButton);
        this.bindings.bind('escape',()=>this.close());
    }
    draw()
    {
        gr.fillrect(this.rect, '#202020');
        gr.rect(this.rect, 'cyan', 1);
        super.draw();
    }
}

export function showMessageBox(text:string, color:string='cyan', fontSize:number=32)
{
    uiManager.showModal(new MessageBox(text, color, fontSize));
}