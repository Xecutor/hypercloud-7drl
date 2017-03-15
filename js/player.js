define(["require", "exports", "./programs", "./resources", "./entity"], function (require, exports, programs_1, resources_1, entity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Player extends entity_1.Entity {
        constructor() {
            super();
            this.fraction = entity_1.EntityFraction.system;
            this.resources = [
                new resources_1.Resource('CPU', 'red'),
                new resources_1.Resource('RAM', 'green'),
                new resources_1.Resource('HDD', 'yellow'),
                new resources_1.Resource('NET', 'cyan'),
                new resources_1.Resource('INT', 'gold'),
            ];
            this.programs = [new programs_1.SecurityAnalyzer, new programs_1.BruteForce];
            this.tileName = 'player';
            this.resources[resources_1.RES.cpu].maxValue = 10;
            this.resources[resources_1.RES.ram].maxValue = 20;
            this.resources[resources_1.RES.hdd].maxValue = 40;
            this.resources[resources_1.RES.net].maxValue = 15;
            this.resources[resources_1.RES.int].value = 100;
            this.resources[resources_1.RES.int].maxValue = 100;
        }
        getResource(idx) {
            return this.resources[idx];
        }
        getDescription() {
            return 'Player';
        }
        decInt(val) {
            this.resources[resources_1.RES.int].value -= val;
            if (this.resources[resources_1.RES.int].value < 0) {
                this.alive = false;
            }
        }
        getInt() {
            return this.resources[resources_1.RES.int].value;
        }
    }
    exports.Player = Player;
});
