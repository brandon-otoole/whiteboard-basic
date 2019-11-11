'use strict'

import { Pointer } from "./Pointer.js";
import { Browser } from "./Browser.js";

export class Surface {
    constructor(canvas) {
        this.tip = null;
        this.pen = new Pointer(null, 5, 0.25, Browser.resolution, "#000000");

        this.bgBoard = canvas;
        this.fgBoard = document.getElementById("fg-board");
        this.bsBoard = document.getElementById("bs-board");

        this.fCtx = this.fgBoard.getContext("2d");
        this.bCtx = this.bgBoard.getContext("2d");
        this.sCtx = this.bsBoard.getContext("2d");

        this.width = Browser.width;
        this.height = Browser.height;

        this.bCtx.canvas.width = this.width;
        this.bCtx.canvas.height = this.height;
        this.fCtx.canvas.width = this.width;
        this.fCtx.canvas.height = this.height;
        this.bsBoard.width = this.width;
        this.bsBoard.height = this.height;
        this.clearScreen();

        this.greenScreen();
        this.fpsTimer = setInterval(buildCopyScreens(this), 30);

        window.addEventListener('resize', (e) => setTimeout(buildResizeCanvas(this), 100));
    }

    addEventListener(trigger, callback) {
        this.bgBoard.addEventListener(trigger, callback);
    }

    get tip() {
        return this._tip;
    }

    set tip(newTip) {
        this._tip = newTip;
    }

    clearScreen() {
        this.pen.hasUpdates = true;
        this.fCtx.clearRect(0, 0, this.width, this.height);
        this.sCtx.clearRect(0, 0, this.width, this.height);
    }

    logStart(point) {
        this.pen.pushHistory(point);
        this.pen.history[0] = null;
        this.pen.history[1] = null;
    }

    logMove(id, point, pressure, tilt) {
        this.pen.id = id;
        this.pen.pushHistory(point);
        this.pen.pressure = pressure == null ? 1 : pressure;
        this.pen.tilt = tilt;
    }

    logEnd() {
    }

    erase(id, point) {
        //this.pen.id = id;
        this.pen.erase(this.fCtx, point);
    }

    penDraw(id, point, pressure, tilt) {
        //this.pen.id = id;
        this.pen.draw(this.fCtx, point, this.tip.width);
    }

    mouseDraw(id, point) {
        //this.pen.id = id;
        this.pen.type = "pen";
        this.pen.pressure = 1;
        this.pen.draw(this.fCtx, point, this.tip.width);
    }

    greenScreen() {
        this.bCtx.clearRect(0, 0, this.width, this.height);
        this.bCtx.fillStyle = "#ccddcc";
        this.bCtx.rect(0, 0, this.width, this.height);
        this.bCtx.fill();

        this.bCtx.beginPath();
        this.bCtx.strokeStyle = "#99bbaa";
        this.bCtx.lineWidth = 1;
        for (let i=50*Browser.resolution; i<this.width; i+=50*Browser.resolution) {
            this.bCtx.moveTo(i, 0);
            this.bCtx.lineTo(i, this.height);
        }
        for (let i=50*Browser.resolution; i<this.height; i+=50*Browser.resolution) {
            this.bCtx.moveTo(0, i);
            this.bCtx.lineTo(this.width, i);
        }
        this.bCtx.stroke();
    }
}

function buildCopyScreens(vm) {
    return function(e) {
        if (vm.pen.hasUpdates) {
            vm.pen.hasUpdates = false;
            vm.greenScreen();
            vm.bCtx.drawImage(vm.fCtx.canvas, 0, 0);
        }
    }
}

function buildResizeCanvas(vm) {
    return function (event) {
        vm.width  = Browser.width;
        vm.height = Browser.height;

        let minWidth = vm.width;
        minWidth = Math.max(minWidth, vm.width);
        minWidth = Math.max(minWidth, vm.width);
        minWidth = Math.max(minWidth, vm.width);

        let minHeight = vm.height;
        minHeight = Math.max(minHeight, vm.height);
        minHeight = Math.max(minHeight, vm.height);
        minHeight = Math.max(minHeight, vm.height);

        vm.pen.hasUpdates = true;

        vm.sCtx.drawImage(vm.fgBoard, 0, 0);

        vm.bgBoard.width = vm.width;
        vm.bgBoard.height = vm.height;
        vm.bCtx.clearRect(0, 0, vm.width, vm.height);
        vm.bCtx.drawImage(vm.bsBoard, 0, 0);

        vm.fgBoard.width = minWidth;
        vm.fgBoard.height = minHeight;
        vm.fCtx.clearRect(0, 0, vm.width, vm.height);

        vm.fCtx.drawImage(vm.bsBoard, 0, 0);

        vm.bsBoard.width = minWidth;
        vm.bsBoard.height = minHeight;
        vm.sCtx.drawImage(vm.fgBoard, 0, 0);
        /*
            let oWidth = document.getElementById('width');
            let oHeight = document.getElementById('height');
            oWidth.innerHTML = getWidth();
            oHeight.innerHTML = getHeight();
            */
    }
}