define(["require", "exports", "./tilemanager", "./animation", "uimanager"], function (require, exports, tilemanager_1, animation_1, uimanager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //export const dirs=['t','b','l','r'];
    exports.dirX = [0, 0, -1, 1];
    exports.dirY = [-1, 1, 0, 0];
    var DIR;
    (function (DIR) {
        DIR[DIR["t"] = 0] = "t";
        DIR[DIR["b"] = 1] = "b";
        DIR[DIR["l"] = 2] = "l";
        DIR[DIR["r"] = 3] = "r";
    })(DIR = exports.DIR || (exports.DIR = {}));
    exports.inverseDir = [DIR.b, DIR.t, DIR.r, DIR.l];
    function diffToDir(srcX, srcY, dstX, dstY) {
        if (srcX == dstX) {
            return srcY < dstY ? DIR.b : DIR.t;
        }
        return srcX < dstX ? DIR.r : DIR.l;
    }
    exports.diffToDir = diffToDir;
    class WallTile {
        constructor() {
            this.passable = false;
            this.connector = false;
            this.animate = false;
        }
        getTileName(conn) {
            if (this.connector)
                return 'connector';
            let rv = 'wall-';
            for (let idx = 0; idx < conn.length; ++idx) {
                if (conn[idx]) {
                    rv += DIR[idx];
                }
            }
            return rv;
        }
        getDescription() {
            return this.connector ? 'Global network connector' : 'Global network channel';
        }
    }
    exports.WallTile = WallTile;
    class FloorTile {
        constructor() {
            this.passable = true;
            this.animate = false;
        }
        getTileName(conn) {
            let rv = 'floor-';
            for (let idx = 0; idx < conn.length; ++idx) {
                if (conn[idx]) {
                    rv += DIR[idx];
                }
            }
            return rv;
        }
        getDescription() {
            return 'Local network channel';
        }
    }
    exports.FloorTile = FloorTile;
    class DataBoxTile {
        constructor() {
            this.passable = false;
            this.animate = false;
        }
        getTileName(conn) {
            return 'data-box';
        }
        getDescription() {
            return 'Data storage';
        }
    }
    exports.DataBoxTile = DataBoxTile;
    class DataProcessorTile {
        constructor() {
            this.passable = false;
            this.animate = true;
        }
        onFrame(frame) {
        }
        getTileName(conn) {
            return 'data-processor';
        }
        getDescription() {
            return 'Data processor';
        }
    }
    exports.DataProcessorTile = DataProcessorTile;
    class TileInfo {
        constructor(tile) {
            this.conn = [false, false, false, false];
            this.tile = tile;
            this.tileFrame = 0;
            if (tile)
                this.passable = tile.passable;
        }
        update() {
            this.tileName = this.tile.getTileName(this.conn);
            if (this.tile.animate) {
                uimanager_1.uiManager.addAnimation(new animation_1.FwdAndBackAnimation((frame) => this.onFrame(frame), tilemanager_1.TileManager.instance.getTileFrames(this.tileName)));
            }
        }
        onFrame(frame) {
            this.tileFrame = frame;
            return true;
        }
        addConn(dir) {
            this.conn[dir] = true;
            return this;
        }
        setEntity(entity) {
            this.entity = entity;
            entity.pos.assign(this.pos);
        }
    }
    exports.TileInfo = TileInfo;
    class FloorTurtle {
        constructor(m, pos) {
            this.m = m;
            this.pos = pos;
        }
        goto(pos) {
            this.pos = pos;
            return this;
        }
        move(dir, steps) {
            let ti = this.m.mapGet(this.pos.x, this.pos.y);
            if (!ti)
                ti = this.m.mapSet(this.pos.x, this.pos.y, new FloorTile());
            ti.addConn(dir);
            for (let i = 0; i < steps; ++i) {
                this.pos.x += exports.dirX[dir];
                this.pos.y += exports.dirY[dir];
                ti = this.m.mapGet(this.pos.x, this.pos.y);
                if (!ti || !ti.tile)
                    ti = this.m.mapSet(this.pos.x, this.pos.y, new FloorTile());
                if (i < steps - 1)
                    ti.addConn(dir);
                ti.addConn(exports.inverseDir[dir]);
            }
            return this;
        }
    }
    exports.FloorTurtle = FloorTurtle;
});
