define(["require", "exports", "./utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let canvas = document.getElementById('canvas');
    //canvas.style.width = window.innerWidth
    let ctx = canvas.getContext('2d');
    let fontSize;
    setFontSize(32);
    function getCtx() {
        return ctx;
    }
    exports.getCtx = getCtx;
    function getBoundingRect() {
        return canvas.getBoundingClientRect();
    }
    exports.getBoundingRect = getBoundingRect;
    function getAppSize() {
        return new utils_1.Size(canvas.width, canvas.height);
    }
    exports.getAppSize = getAppSize;
    function getAppRect() {
        return new utils_1.Rect(0, 0, canvas.width, canvas.height);
    }
    exports.getAppRect = getAppRect;
    function setBg(clr) {
        ctx.fillStyle = clr;
    }
    exports.setBg = setBg;
    function clear() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //ctx.clearRect(0,0, canvas.width, canvas.height);
    }
    exports.clear = clear;
    function setClip(r) {
        ctx.save();
        let path = new Path2D();
        path.rect(r.pos.x, r.pos.y, r.size.width, r.size.height);
        ctx.clip(path);
    }
    exports.setClip = setClip;
    function resetClip() {
        ctx.restore();
    }
    exports.resetClip = resetClip;
    function fillrect(r, clr) {
        ctx.fillStyle = clr;
        ctx.fillRect(r.pos.x, r.pos.y, r.size.width, r.size.height);
    }
    exports.fillrect = fillrect;
    function rect(r, clr, lineWidth, glowSize) {
        ctx.beginPath();
        ctx.strokeStyle = clr;
        if (lineWidth)
            ctx.lineWidth = lineWidth;
        if (typeof glowSize === 'number') {
            ctx.shadowBlur = glowSize;
            ctx.shadowColor = clr;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
        ctx.rect(r.pos.x, r.pos.y, r.size.width, r.size.height);
        ctx.stroke();
        if (typeof glowSize === 'number') {
            ctx.shadowBlur = 0;
        }
    }
    exports.rect = rect;
    function line(from, to, color, lineWidth = 1) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }
    exports.line = line;
    function setFontSize(sz) {
        fontSize = sz;
        ctx.font = sz + "pt courier";
    }
    exports.setFontSize = setFontSize;
    function textout(x, y, clr, txt) {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = clr;
        ctx.fillText(txt, x, y - fontSize / 8);
    }
    exports.textout = textout;
    function getTextSize(txt) {
        let m = ctx.measureText(txt);
        return new utils_1.Size(m.width, fontSize);
    }
    exports.getTextSize = getTextSize;
    function getTextHeight() {
        return fontSize;
    }
    exports.getTextHeight = getTextHeight;
});
