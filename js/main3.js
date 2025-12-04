/**
 * main.js
 * Modified for Wheel Spin Logic + KEEP existing HTML cubes
 */
;(function(window) {

    'use strict';

    // Helper vars and functions.
    function extend( a, b ) {
        for( var key in b ) { 
            if( b.hasOwnProperty( key ) ) {
                a[key] = b[key];
            }
        }
        return a;
    }

    // From http://www.quirksmode.org/js/events_properties.html#position
    function getMousePos(e) {
        var posx = 0;
        var posy = 0;
        if (!e) e = window.event;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft
                + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop
                + document.documentElement.scrollTop;
        }
        return {
            x : posx,
            y : posy
        }
    }

    // Detect mobile.
    function mobilecheck() {
        var check = false;
        (function(a){
            if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) ||
               /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) {
                check = true;
            }
        })(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

    // The Day obj.
    function Day(options) {
        this.options = extend({}, this.options);
        extend(this.options, options);
        this.number = this.options.number;
        this.color = this.options.color;
        this.previewTitle = this.options.previewTitle;
        this.isActive = !this.options.inactive;
        this.cube = this.options.cubeEl || null;
        this._layout();
    }

    Day.prototype.options = {
        cubeEl: null,
        number: 0,
        color: '#f1f1f1',
        previewTitle: '',
        inactive: false
    };

    // ✅ OVERRIDE: DO NOT REBUILD / INNERHTML CUBE
    Day.prototype._layout = function() {
        if (!this.cube && this.options.cubeEl) {
            this.cube = this.options.cubeEl;
        }
        if (!this.cube) {
            // fallback (хэрвээ cubeEl байхгүй бол л хэрэглэгдэнэ)
            this.cube = document.createElement('div');
            this.cube.className = this.isActive ? 'cube' : 'cube cube--inactive';
        } else {
            if (!this.isActive) {
                this.cube.classList.add('cube--inactive');
            }
        }
        // ямар ч innerHTML үүсгэхгүй!
        this.currentTransform = {translateZ: 0, rotateX: 0, rotateY: 0};
    };

    // NOTE: This _rotate is now mostly unused as we disabled hover logic
    Day.prototype._rotate = function(ev) {
        // hover-ийн эргэлт ашиглахгүй
        return false;
    };

    Day.prototype._setContentTitleFx = function(contentTitleEl) {
        if(typeof TextFx === 'undefined') return;
        this.titlefx = new TextFx(contentTitleEl);
        this.titlefxSettings = {
            in: {
                duration: 800,
                delay: function(el, index) { return 900 + index*20; },
                easing: 'easeOutExpo',
                opacity: { duration: 200, value: [0,1], easing:'linear' },
                rotateZ: function(el, index) { return [anime.random(-10,10), 0]; },
                translateY: function(el, index) { return [anime.random(-200,-100),0]; }
            },
            out: {
                duration: 800,
                delay: 300,
                easing: 'easeInExpo',
                opacity: 0,
                translateY: -350
            }
        };
    };

    Day.prototype._getDirection = function(ev) {
        var obj = this.cube.querySelector('.cube__side--front') || this.cube,
            w = obj.offsetWidth, 
            h = obj.offsetHeight,
            bcr = obj.getBoundingClientRect(),
            x = (ev.pageX - (bcr.left + window.pageXOffset) - (w / 2) * (w > h ? (h / w) : 1)),
            y = (ev.pageY - (bcr.top + window.pageYOffset) - (h / 2) * (h > w ? (w / h) : 1)),
            d = Math.round( Math.atan2(y, x) / 1.57079633 + 5 ) % 4;
        return d;
    };

    // The Calendar obj.
    function Calendar(el) {
        this.el = el;

        // 🔹 HTML дээрх cube-үүдийг авч байна
        var placeholderCubes = [].slice.call(this.el.querySelectorAll('.cube'));

        // 🔹 .cubes wrapper байхгүй бол үүсгэнэ
        this.cubes = this.el.querySelector('.cubes');
        if (!this.cubes) {
            this.cubes = document.createElement('div');
            this.cubes.className = 'cubes';
            this.el.appendChild(this.cubes);
        }

        this.days = [];
        var self = this;

        placeholderCubes.forEach(function(d, pos) {
            // cube-ийг wrapper рүү зөөнө
            if (d.parentNode !== self.cubes) {
                self.cubes.appendChild(d);
            }

            var day = new Day({
                cubeEl: d, // 🟢 HTML cube-г шууд ашиглана
                number: parseInt(d.getAttribute('data-number') || (pos+1), 10) - 1,
                color: d.getAttribute('data-bg-color') || '#f1f1f1',
                previewTitle: d.getAttribute('data-title') || '',
                inactive: d.hasAttribute('data-inactive')
            });

            var content = contents[pos];
            if( content !== undefined ) {
                var contentTitle = contents[pos].querySelector('.content__title');
                if (contentTitle) {
                    day._setContentTitleFx(contentTitle);
                }
            }

            self.days.push(day);
            self._initDayEvents(day);
        });

        this.dayPreview = document.createElement('h2');
        this.dayPreview.className = 'title';
        this.el.appendChild(this.dayPreview);
        
        this._initEvents();

        // SPIN товч
        this.spinButton = document.querySelector(".btn-spin");
        if (this.spinButton) {
            this.spinButton.addEventListener("click", this.spinCubes.bind(this));
        }
        
        this.selectedCubes = [];
    }

    // 🟩 SPIN Logic
    Calendar.prototype.spinCubes = function() {
        let self = this;

        if (this.days.length <= 0) return;

        // 1) бүгдийг эргүүлэх (spin aesthetic)
        self.days.forEach(function(day) {
            anime({
                targets: day.cube,
                rotateY: anime.random(360, 1080),
                rotateX: anime.random(360, 1080),
                scale: 1,
                duration: anime.random(800, 1200),
                easing: "easeOutCubic"
            });
        });

        // 2) random 2 cube сонгох (эсвэл үлдсэнээс хамаараад багасна)
        let pool = self.days.slice();
        let count = pool.length >= 2 ? 2 : 1;
        let shuffled = pool.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, count);
        self.selectedCubes = selected;

        // 3) selected биш cube-үүдийг fade/shrink
        self.days.forEach(function(day) {
            if (!selected.includes(day)) {
                anime({
                    targets: day.cube,
                    opacity: 0.25,
                    scale: 0.8,
                    duration: 600,
                    easing: "easeOutQuad"
                });
            } else {
                anime({
                    targets: day.cube,
                    opacity: 1,
                    scale: 1,
                    duration: 400
                });
            }
        });

        // 4) сонгогдсон cube-үүд bounce
        selected.forEach(function(day) {
            anime({
                targets: day.cube,
                scale: [1, 1.15],
                duration: 600,
                easing: "easeOutBack"
            });
        });
    };

    // Дараагийн spin (үлдсэн кубууд дээр)
    Calendar.prototype.nextSpin = function() {
        if (!this.selectedCubes || this.selectedCubes.length === 0) return;

        // selected-уудыг “гараад явсан” гэж үзээд array-гаас хасна
        let remaining = this.days.filter(d => !this.selectedCubes.includes(d));
        this.days = remaining;

        // үлдсэнийг буцаан normal болгож дараагийн spin-ийг эхлүүлнэ
        remaining.forEach(function(day) {
            anime({
                targets: day.cube,
                opacity: 1,
                scale: 1,
                duration: 500
            });
        });

        this.selectedCubes = [];
        if (this.days.length > 0) {
            this.spinCubes();
        }
    };

    Calendar.prototype._initEvents = function() {
        // backToCalendar, tilt г.м. хуучин логик ашиглахгүй
        return;
    };

    Calendar.prototype._initDayEvents = function(day) {
        // Hover / click open бүгд OFF
        if (!isMobile) {
            day.cube.addEventListener('mouseenter', function(){ return false; });
            day.cube.addEventListener('mouseleave', function(){ return false; });
        }
        day.cube.addEventListener('click', function(){ return false; });
    };

    Calendar.prototype._rotateCalendar = function(mousepos) {
        return false;
    };

    Calendar.prototype._showPreviewTitle = function(text, number) {
        return false; 
    };

    Calendar.prototype._hidePreviewTitle = function() {
        return false;
    };

    Calendar.prototype._showContent = function(day) {};
    Calendar.prototype._hideContent = function() {};
    Calendar.prototype._changeBGColor = function(color) {};
    Calendar.prototype._resetBGColor = function() {};

    // Snow obj.
    function Snow() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'snow';
        this.canvas.className = 'background';
        this.canvas.style.background = defaultBgColor;
        document.body.insertBefore(this.canvas, document.body.firstElementChild);

        this.flakes = [];
        this.ctx = this.canvas.getContext('2d');
        this.flakeCount = 300;
        this.mX = -100;
        this.mY = -100;

        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;

        this._init();
    }

    Snow.prototype._init = function() {
        var self = this;
        window.addEventListener('resize', function() {
            self.width = self.canvas.width = window.innerWidth;
            self.height = self.canvas.height = window.innerHeight;
        });

        for(var i = 0; i < this.flakeCount; ++i) {
            var x = Math.floor(Math.random() * this.width),
                y = Math.floor(Math.random() * this.height),
                size = (Math.random()*3.5) + .5,
                speed = size*.5,
                opacity = (Math.random() * 0.5) + 0.1;

            this.flakes.push({
                speed: speed,
                velY: speed,
                velX: 0,
                x: x,
                y: y,
                size: size,
                stepSize: (Math.random()) / 30,
                step: 0,
                opacity: opacity
            });
        }
        this._snow();
    };

    Snow.prototype._snow = function() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for(var i = 0; i < this.flakeCount; ++i) {
            var flake = this.flakes[i],
                x = this.mX,
                y = this.mY,
                minDist = 150,
                x2 = flake.x,
                y2 = flake.y,
                dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));

            if( dist < minDist ) {
                var force = minDist / (dist * dist),
                    xcomp = (x - x2) / dist,
                    ycomp = (y - y2) / dist,
                    deltaV = force / 2;
                flake.velX -= deltaV * xcomp;
                flake.velY -= deltaV * ycomp;
            }
            else {
                flake.velX *= .98;
                if( flake.velY <= flake.speed ) {
                    flake.velY = flake.speed;
                }
                flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
            }

            this.ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
            flake.y += flake.velY;
            flake.x += flake.velX;

            if( flake.y >= this.height || flake.y <= 0 ) {
                this._reset(flake);
            }
            if( flake.x >= this.width || flake.x <= 0 ) {
                this._reset(flake);
            }

            this.ctx.beginPath();
            this.ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        requestAnimationFrame(this._snow.bind(this));
    };

    Snow.prototype._reset = function(flake) {
        flake.x = Math.floor(Math.random() * this.width);
        flake.y = 0;
        flake.size = (Math.random() * 3.5) + .5;
        flake.speed = flake.size*.5;
        flake.velY = flake.speed;
        flake.velX = 0;
        flake.opacity = (Math.random() * 0.5) + 0.1;
    };

    var calendarEl = document.querySelector('.calendar'),
        settings = {
            snow: true,
            tilt: false
        },
        bgEl = document.body,
        defaultBgColor = bgEl.style.backgroundColor || '#cc0019',
        colortimeout,
        contentEl = document.querySelector('.content'),
        contents = contentEl ? contentEl.querySelectorAll('.content__block') : [],
        backCtrl = contentEl ? contentEl.querySelector('.btn-back') : null,
        contentNumber = contentEl ? contentEl.querySelector('.content__number') : null,
        isMobile = mobilecheck();

    function init() {
        if (calendarEl) {
            new Calendar(calendarEl);
        }
        if( settings.snow ) {
            var snow = new Snow();
            bgEl = snow.canvas;
        }
    }

    init();

})(window);
