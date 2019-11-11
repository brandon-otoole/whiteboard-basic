const subMenuPattern = /sub-menu/;
const colorList = [
    [ "black", "#000000"],
    [ "red", "#ff0000"],
    [ "maroon", "#800000"],
    [ "green", "#00a000"],
    [ "darkgreen", "#106010"],
    [ "blue", "#0000ff"],
    [ "deepblue", "#000080"],
    [ "purple", "#800080"],
    [ "violet", "#ee82ee"],
    [ "indigo", "#4b0082"],
    [ "yellow", "#d0d000"],
    [ "aqua", "#008080"],
    [ "teal", "#00cccc"],
    [ "brown", "#421010"],
    [ "grey", "#808080"],
];

const menuMap = [
    [ document.getElementById('pen'),
        document.getElementById('pen-submenu') ],
    [ document.getElementById('pencil'),
        document.getElementById('pencil-submenu') ],
    [ document.getElementById('highlighter'),
        document.getElementById('highlighter-submenu') ],
    [ document.getElementById('eraser'),
        document.getElementById('eraser-submenu') ],
];

let settingsButton = document.getElementById("settings-button");

export class Menu {
    updateWidthDisplay(e) {
        this.penWidthOut.innerHTML = this.penWidth.value;
    }

    updatePenWidth(e) {
        this.surface.tip.width = this.penWidth.value;
    }

    makeSetPenColor(color) {
        return function(e) {
            this.surface.pen.color = color;
        }
    }

    constructor(surface) {
        this.surface = surface;

        this.penColors = document.getElementById('color-container');
        this.penWidth = document.getElementById('pen-width-slider');
        this.penWidthOut = document.getElementById('pen-width-value');

        this.penWidth.addEventListener('input', this.updateWidthDisplay.bind(this));

        this.penWidth.addEventListener('change', this.updatePenWidth.bind(this));

        this.penWidthOut.innerHTML = 5;
        this.penWidth.value = 5;

        for (let color of colorList) {
            var colorButton = document.createElement("div");
            colorButton.id = "pen-" + color[0];
            colorButton.style.backgroundColor = color[1];
            colorButton.title = color[0];
            colorButton.style.width = "50px";
            colorButton.style.height = "50px";

            colorButton.addEventListener('click', this.makeSetPenColor(color[1]).bind(this));

            this.penColors.appendChild(colorButton);
        }

        this.activeSubMenu = null;
        document.body.addEventListener('click', this.deactivateMenu.bind(this));

        document.getElementById("save").addEventListener('click', this.myFullscreen.bind(this));

        for (let menu of menuMap) {
            menu[0].addEventListener('click', this.makeShowSubMenu(...menu).bind(this));
        }

        document.getElementById('trash').addEventListener('click', surface.clearScreen.bind(surface), false);
    }

    deactivateMenu(e) {
        if (!subMenuPattern.test(e.target.className) && this.activeSubMenu) {
            this.activeSubMenu.style.display = "none";
        }
    }

    myFullscreen(e) {
        var elem = document.getElementById("bg-board");
        elem = document.body;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }
    }

    makeShowSubMenu(tip, menu) {
        return function(e) {
            if (this.activeSubMenu) {
                this.activeSubMenu.style.display = "none";
            }

            this.surface.pen.tip = tip.id;
            this.activeSubMenu = menu;
            this.activeSubMenu.style.display = "flex";
            e.cancelBubble = true;
        }
    }
}