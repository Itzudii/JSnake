/*!
 * jSnake.js - A JavaScript Game Development Library
 * Copyright © 2025 [Uditya Patel]
 * Licensed under the GNU General Public License v3.0
 * https://www.gnu.org/licenses/gpl-3.0.en.html
 */
export class Display {
    /**
     * display class create a canvas
     * -> provide methods to fill color
    */
    constructor() {
        this.canvas = document.querySelector('#JSnakeCanvas');
        this.ctx = this.canvas.getContext('2d');
    }
    /**
     * set the canvas size
     * @param {Array} coord - [width, height]
     * @returns {Display instance}
     */
    set_mode(coord) {
        let [x, y] = coord;
        this.canvas.width = x;
        this.canvas.height = y;
        return this
    }
    /**
     * use to fill color to the screen.
     * @param {[0,0,0]} color -> tuples[int,int,int]
         * red => int range(0,255)
         * green => int range(0,255)
         * blue => int range(0,255)
    */
    fill(color) {
        let [r, g, b] = color;
        this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    /**
     * 
     * @param {image} img
     * @param {[x,y]} coord
     * @returns {void}
     */

    blit(img,coord) {
        try {
            img.__type__();
            this.ctx.drawImage(img.image, coord[0], coord[1]);
            return 0;
            
        } catch (error) {
            ''
        }
        this.ctx.drawImage(img, coord[0], coord[1]);

    }
    /**
     * get the type of the sprite
     * @returns {string}
     */
    __type__(){
        return 'Display';
    }

}