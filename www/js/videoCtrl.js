/**
 * @ngdoc controller
 * @name app.controller:videoCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


angular.module('starter').controller('videoCtrl', function($scope) {
        console.log($scope);

        $(document).ready(function () {
            var source = document.getElementById('source').getContext('2d'),
                output = source, //document.getElementById('output').getContext('2d'),
                slider = document.getElementById('hue'),
                target = document.getElementById('target'),
                tr = 255, tg = 0, tb = 0,
                width = 160,
                height = 120;

            /**
             * Converts an HSL color value to RGB. Conversion formula
             * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
             * Assumes h, s, and l are contained in the set [0, 1] and
             * returns r, g, and b in the set [0, 255].
             *
             * @param   Number  h       The hue
             * @param   Number  s       The saturation
             * @param   Number  l       The lightness
             * @return  Array           The RGB representation
             */
            function hslToRgb(h, s, l){
                var r, g, b;

                if (s == 0) {
                    r = g = b = l; // achromatic
                } else {
                    function hue2rgb(p, q, t) {
                        if(t < 0) t += 1;
                        if(t > 1) t -= 1;
                        if(t < 1/6) return p + (q - p) * 6 * t;
                        if(t < 1/2) return q;
                        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                        return p;
                    }

                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    var p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1/3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1/3);
                }

                return [r * 255, g * 255, b * 255];
            }

            slider.oninput = slider.onchange = function () {
                target.style.background = 'hsl(' + this.value + ', 100%, 50%)';
                var rgb = hslToRgb(this.value/360, 1, 0.6);
                tr = rgb[0];
                tg = rgb[1];
                tb = rgb[2];
            };

            // note: video is defined in gum.js
            video.addEventListener('loadedmetadata', function () {
                // due to bug in Chrome: http://crbug.com/168700
                if (video.videoWidth) {
                    source.canvas.width = video.videoWidth;
                    source.canvas.height = video.videoHeight;
                }
                draw();
            });


            function draw() {
                requestAnimFrame(draw);
                source.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, source.canvas.width, source.canvas.height);
                var pixels = source.getImageData(0, 0, source.canvas.width, source.canvas.height),
                    i = 0,
                    brightness;

                for (; i < pixels.data.length; i += 4) {
                    // brightness code from Tab Atkins' canvas demos
                    brightness = ((3*pixels.data[i]+4*pixels.data[i+1]+pixels.data[i+2])>>>3) / 256;

                    pixels.data[i] = ((tr * brightness)+0.5)>>0;
                    pixels.data[i+1] = ((tg * brightness)+0.5)>>0
                    pixels.data[i+2] = ((tb * brightness)+0.5)>>0
                }
                output.putImageData(pixels, 0, 0);
            }

            // shim layer with setTimeout fallback - from Paul Irish
            window.requestAnimFrame = (function(){
                return  window.requestAnimationFrame       ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame    ||
                    window.oRequestAnimationFrame      ||
                    window.msRequestAnimationFrame     ||
                    function( callback ){
                        window.setTimeout(callback, 1000 / 60);
                    };
            })();

            var article = video.parentNode,
                gum = document.getElementById('gum');

            if (navigator.getUserMedia) {
                article.removeChild(gum);
                article.className = 'supported';
            }






        })





});
