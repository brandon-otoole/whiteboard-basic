'use strict'

import { Browser } from "./Browser.js";

export class StrokePoint {
    constructor(x, y, pressure, tiltx, tilty) {
        this._x = x;
        this._y = y;
        //this._x = x * Browser.resolution;
        //this._y = y * Browser.resolution;

        // what about if pressure is 0?
        this._pressure = pressure || 1;

        this._tiltx = tiltx || 0;
        this._tilty = tilty || 0;
    }

    //get point() { return [] }

    get x() { return this._x; }
    //set x(value) { return this._x = value; }

    get y() { return this._y }
    //set y(value) { return this._y = value; }

    get tilt() { return [this._tiltx, this._tilty]; }
    get tiltx() { return this._tiltx }
    get tilty() { return this._tilty }

    toString() {
        return "(" + this._x + ", " + this._y + ")";
    }
}
