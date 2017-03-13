import { UIBase, MyMouseEvent } from './uibase';
import * as gr from './graphics';

export class Button extends UIBase {
    color:string = 'white';
    label:string;
    fontSize=32;
    mouseOver=false;
    clickOnUp=false;
    onClick:()=>void;
    constructor(label:string, onClick:()=>void, fontSize?:number) 
    {
        super();
        this.label=label;
        this.onClick=onClick;
        if(fontSize)this.fontSize=fontSize;
        this.rect.size.assign(gr.getTextSize(label));
        this.rect.size.width+=4;
        this.rect.size.height+=4;
    }
    draw()
    {
        gr.setFontSize(this.fontSize);
        gr.rect(this.rect, 'cyan', 2, this.mouseOver?10:0);
        let pos=this.rect.size.toPos().sub(gr.getTextSize(this.label).toPos()).div(2).add(this.rect.pos);
        gr.textout(pos.x, pos.y, this.color, this.label);
    }
    onMouseEnter(e:MyMouseEvent)
    {
        this.mouseOver=true;
    }
    onMouseLeave(e:MyMouseEvent)
    {
        this.mouseOver=false;
        this.clickOnUp=false;
    }
    onMouseDown(e:MyMouseEvent)
    {
        this.clickOnUp=true;
    }
    onMouseUp(e:MyMouseEvent)
    {
        if(this.clickOnUp && this.onClick) {
            this.onClick();
        }
        this.clickOnUp=false;
    }
}

export class CloseButton extends Button {
    color='red'
    constructor()
    {
        super('X',()=>this.parent.close());
    }
    onAdd()
    {
        this.rect.pos.assign(this.parent.rect.pos);
        this.rect.pos.x+=this.parent.rect.size.width-32;
        this.rect.size.width=32;
        this.rect.size.height=32;
    }
}