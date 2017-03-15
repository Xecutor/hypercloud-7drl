define(["require", "exports", "./mainmenu", "uimanager"], function (require, exports, mainmenu_1, uimanager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    uimanager_1.uiManager.add(new mainmenu_1.MainMenu());
});
