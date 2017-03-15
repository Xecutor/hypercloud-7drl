define(["require", "exports", "./ai", "./tilemanager", "./animation", "./uimanager", "./entity"], function (require, exports, ai_1, tilemanager_1, animation_1, uimanager_1, entity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EnemyBase extends entity_1.Entity {
        constructor() {
            super(...arguments);
            this.fraction = entity_1.EntityFraction.malicious;
            this.int = 100;
        }
        onTurn(map) {
            this.ai.think(map, this);
        }
        animate() {
            uimanager_1.uiManager.addAnimation(new animation_1.FwdAndBackAnimation((frame) => this.onFrame(frame), tilemanager_1.TileManager.instance.getTileFrames(this.tileName) - 1));
        }
    }
    class Muncher extends EnemyBase {
        constructor() {
            super();
            this.ai = new ai_1.FleeingAI();
            this.tileName = 'muncher';
            this.animate();
        }
        getDescription() {
            return 'Muncher';
        }
        decInt(val) {
            this.int -= val;
            if (this.int < 0)
                this.alive = false;
        }
        getInt() {
            return this.int;
        }
    }
    exports.Muncher = Muncher;
    class Spyware extends EnemyBase {
        constructor() {
            super();
            this.ai = new ai_1.FleeingAI();
            this.tileName = 'spyware';
            this.animate();
        }
        getDescription() {
            return 'Spyware';
        }
        decInt(val) {
            this.int -= val;
            if (this.int < 0)
                this.alive = false;
        }
        getInt() {
            return this.int;
        }
    }
    exports.Spyware = Spyware;
});
