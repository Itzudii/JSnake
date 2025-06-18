import { jsnake } from "../src/main.js";

async function main() {
    jsnake.init()
    const FPS = 60;
    jsnake.set_fps(FPS);

    const SCREENX = 288;
    const SCREENY = 512;
    const screen = jsnake.display.set_mode([SCREENX, SCREENY]);
    const GAP = 100;


    class UPipe extends jsnake.sprite.Sprite {
        constructor(y) {
            super();
            this.x = SCREENX;
            this.y = y;
            this.speed = 3;

        }
        async init() {
            this.image = await jsnake.image.imageload('./sprites/pipe-green.png');
            this.image = await jsnake.image.scale(this.image, [1, -1]);
            this.rect = jsnake.get_rect(this.image);
            this.rect.x = this.x;
            this.rect.bottom = this.y;
        }

        update() {
            this.rect.x -= this.speed;
            this.time = 0;

            if (this.rect.right < 0) {
                this.kill();
            }
        }
    }
    class LPipe extends jsnake.sprite.Sprite {
        constructor(y) {
            super();
            this.x = SCREENX;
            this.y = y;
            this.speed = 3;

        }
        async init() {
            this.image = await jsnake.image.imageload('./sprites/pipe-green.png');
            this.rect = jsnake.get_rect(this.image);
            this.rect.x = this.x;
            this.rect.bottom = this.y
            this.rect.y = this.rect.bottom + GAP;
        }

        update() {
            this.rect.x -= this.speed;
            if (this.rect.right < 0) {
                this.kill();
            }
        }
    }
    class Bird extends jsnake.sprite.Sprite {
        constructor() {
            super();
            this.x = 100;
            this.y = 100;
            this.gravity = 1;
            this.velocity = 0;
            this.jumpStrength = -10
            
            this.index = 1;
            this.time = 0;
            this.dt = 0.9;

        }
        async init() {
            this.imgdata = [await jsnake.image.imageload('./sprites/bluebird-downflap.png'),
            await jsnake.image.imageload('./sprites/bluebird-midflap.png'),
            await jsnake.image.imageload('./sprites/bluebird-upflap.png')
            ]
            this.image = this.imgdata[this.index];
            this.rect = jsnake.get_rect(this.image);
            this.rect.x = this.x;
            this.rect.y = this.y;
        }
        gravity_init() {
            this.velocity += this.gravity;
            this.rect.y += this.velocity;


        }
        wing_animation() {
            
            this.index += 1;
            if (this.index > 2) {
                this.index = 0;
            }
            this.image = this.imgdata[this.index];
        }
        jump() {
            this.velocity = this.jumpStrength;
        }

        update() {
            this.time += this.dt;
            if (this.time > 1) {
                this.gravity_init();
                this.time = 0;
            }
            this.wing_animation();
        }
    }
    class Base extends jsnake.sprite.Sprite {
        constructor(index) {
            super();
            this.index = index;
            this.speed = 3;
        }
        async init() {
            this.image = await jsnake.image.imageload('./sprites/base.png');
            this.rect = jsnake.get_rect(this.image);
            this.rect.y = SCREENY - this.rect.h;
            this.rect.x = this.index * this.rect.w;
        }

        update() {
            if (this.rect.right < 0) {
                this.rect.x = this.rect.w - this.speed;
            }
            this.rect.x -= this.speed;

        }
    }
    class BG extends jsnake.sprite.Sprite {
        constructor(index) {
            super();
            this.index = index;
            this.speed = 3;
        }
        async init() {
            this.image = await jsnake.image.imageload('./sprites/background-day.png');
            this.rect = jsnake.get_rect(this.image);
            this.rect.y = 0;
            this.rect.x = this.index * this.rect.w;
        }

        update() {
            if (this.rect.right < 0) {
                this.rect.x = this.rect.w - this.speed;
            }
            this.rect.x -= this.speed;

        }
    }
    class Score {
        constructor() {
            this.imagedata = null;
            this.score = [0, 0, 0];

        }
        async init() {
            this.imagedata = {
                0: await jsnake.image.imageload('./sprites/0.png'),
                1: await jsnake.image.imageload('./sprites/1.png'),
                2: await jsnake.image.imageload('./sprites/2.png'),
                3: await jsnake.image.imageload('./sprites/3.png'),
                4: await jsnake.image.imageload('./sprites/4.png'),
                5: await jsnake.image.imageload('./sprites/5.png'),
                6: await jsnake.image.imageload('./sprites/6.png'),
                7: await jsnake.image.imageload('./sprites/7.png'),
                8: await jsnake.image.imageload('./sprites/8.png'),
                9: await jsnake.image.imageload('./sprites/9.png'),
            }
            this.gameoverimg = await jsnake.image.imageload('./sprites/gameover.png');

        }
        add() {
            this.score[2] += 1;
            if (this.score[2] == 10) {
                this.score[1] += 1;
                this.score[2] = 0;
            }
            if (this.score[1] == 10) {
                this.score[0] += 1;
                this.score[1] = 0
            }
        }

        drawscore(screen) {
            for (let i = 0; i < this.score.length; i++) {
                screen.blit(this.imagedata[this.score[i]], [30 * i, 0])
            }
        }
        gameover(screen){
            screen.blit(this.gameoverimg,[50,200])
        }
    }

    let Upipes = new jsnake.sprite.Group();
    let Lpipes = new jsnake.sprite.Group();

    let bird = new Bird();
    await bird.init();

    let base = new jsnake.sprite.Group();
    base.add([new Base(0), new Base(1)]);

    let bg = new jsnake.sprite.Group();
    bg.add([new BG(0), new BG(1)]);

    let score = new Score();
    await score.init();

    const event = jsnake.event;
    event.init();

    const message = await jsnake.image.imageload('./sprites/message.png');
    let messagecoord = [Math.floor((SCREENX - message.width) / 2),Math.floor((SCREENY - message.height) / 2)];

    let page = 'home';
    let isrunning = true;
    jsnake.gameloop = () => {
        screen.fill([0, 0, 0]);
        
        bg.draw(screen);
        
        if (page == 'start') {
            
            if (event.Kclick(' ')) {
                bird.jump();
            }
            
            if (Upipes.__len__() < 1) {
                let rand = jsnake.random.randint(0, 300);
                Upipes.add(new UPipe(rand));
                Lpipes.add(new LPipe(rand));
                score.add()
                
            }
            let condition1 = jsnake.sprite.spritecollide(bird.rect, Lpipes, false).length != 0;
            let condition2 = jsnake.sprite.spritecollide(bird.rect, Upipes, false).length != 0;
            let condition3 = jsnake.sprite.spritecollide(bird.rect, base, false).length != 0;
            if (condition1 || condition2 || condition3) {
                isrunning = false;
            }
        
            
        bg.update();
            
        Lpipes.update();
        Lpipes.draw(screen);
        
        Upipes.update();
        Upipes.draw(screen);

        base.update();
        base.draw(screen);

        bird.update();
        bird.draw(screen);
        
        score.drawscore(screen)

    }else{
        if (event.Mclick()) {
            page = 'start';
        }
        screen.blit(message,messagecoord)

    }

        jsnake.breakpoint(isrunning);
        if (!isrunning) {
            screen.fill([0, 0, 0]);
            bg.draw(screen);
            score.gameover(screen)
            score.drawscore(screen);
            event.quit();
            jsnake.quit();



        }

    }
    jsnake.gameloop();

}

document.addEventListener("DOMContentLoaded", main);