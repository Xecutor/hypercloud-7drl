define(["require", "exports", "./uimanager", "./entity", "./animation", "./tiles"], function (require, exports, uimanager_1, entity_1, animation_1, tiles_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ConnectionPiece extends entity_1.Entity {
        constructor(srcDir, startFrame = 0, prefix = 'my') {
            super();
            this.conn = [false, false, false, false];
            this.prefix = prefix;
            this.conn[srcDir] = true;
            this.update();
            let ani = new animation_1.CyclicAnimation((frame) => this.onFrame(frame), 25, 0, startFrame);
            uimanager_1.uiManager.addAnimation(ani);
            if (prefix == 'my') {
                this.fraction = entity_1.EntityFraction.system;
            }
            else {
                this.fraction = entity_1.EntityFraction.malicious;
            }
        }
        update() {
            let type = '';
            for (let dir = 0; dir < 4; ++dir) {
                if (this.conn[dir]) {
                    type += tiles_1.DIR[dir];
                }
            }
            this.tileName = this.prefix + '-connection-piece-' + type;
        }
        getDescription() {
            return 'Active Connection';
        }
        decInt(val) {
        }
        getInt() {
            return 100;
        }
    }
    exports.ConnectionPiece = ConnectionPiece;
});
