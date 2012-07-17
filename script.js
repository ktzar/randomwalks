/*
    1- Place N (e.g. 10) arbitrary start points with elevation 'height' (e.g. 500)
    2- For each point P in the map, choose a random neighbor P'.
    3- Calculate their difference in elevation minus one: diff = P.height - P'.height - 1
    4- If diff > 0, move that amount of elevation to the neighbour P'. (i.e. P.height -= diff; P'.height += diff;).
    5- Go back to step 2.
*/
    var RandomWalks = function(canvas, initHeight, initPoints, callbacks) {
        this.cnv        = canvas;
        this.ctx        = this.cnv.getContext('2d');
        this.initHeight = initHeight;
        this.initPoints = initPoints;
        this.world      = new Array(this.cnv.width);
        this.continuous = false;
        this.cycle      = 0;
        this.currentMaxHeight = 0;
        this.callbacks  = callbacks;

        //set canvas properties
        this.ctx.strokeStyle = "black";
        this.ctx.fillStyle = "black";

        var that = this;

        this.init = function () {
            //Initialise the world
            for (i = 0;i<that.cnv.width;i++) {
                that.world[i] = new Array(that.cnv.height);
            }
            for (x = 0;x<that.cnv.width;x++) {
                for (y = 0;y<that.cnv.width;y++) {
                    that.world[x][y] = 0;
                }
            }

            //draw some random points
            for (i = 0;i<initPoints;i++) {
                var x = parseInt(Math.random()*that.cnv.width);
                var y = parseInt(Math.random()*that.cnv.height);
                that.world[x][y] = that.initHeight;

            }
            that.ctx.clearRect(0,0,that.cnv.width,that.cnv.height);
        }

        var getPoints = function()
        {
            var Ps = [], x, y;
            var maxHeight = 0;
            //write down all the points here
            for (x = 0;x<that.cnv.width;x++) {
                for (y = 0;y<that.cnv.width;y++) {
                    if (that.world[x][y] > 0 ) {
                        maxHeight = Math.max(maxHeight, that.world[x][y]);
                        Ps.push([x,y]);
                    }
                }
            }
            if (maxHeight < 2) {
                that.continuous = false;
                return new Array();
            }
            that.currentMaxHeight  = maxHeight;
            return Ps;
        }

        var iterate = function(){
            var _i, _x, _y, diff;
            Ps = getPoints();
            //clone
            newPs = new Array();//Ps.slice(0);
            for (i in Ps) {
                x = Ps[i][0];
                y = Ps[i][1];
                //pick random neighbor
                _i = parseInt(Math.random()*8);
                if (_i == 1 || _i == 4 || _i == 6) {
                    _x = x-1;
                }else if( _i == 2 || _i == 7) {
                    _x = x;
                }else{
                    _x = x+1;
                }
                if (_i == 1 || _i == 2 || _i == 3) {
                    _y = y-1;
                }else if( _i == 4 || _i == 5) {
                    _y = y;
                }else{
                    _y = y+1;
                }
                //skip borders
                if (_y >= that.cnv.height || _x >= that.cnv.width || _y < 0 || _x < 0)
                    continue;
                //random neighbor is in _x,_y
                diff = that.world[x][y] - that.world[_x][_y] - 1;
                if (diff > 0 ) {
                    that.world[_x][_y] += diff;
                    that.world[x][y] -= diff;
                    newPs.push([_x,_y]);
                }
            }
            if (that.continuous == true) {
                setTimeout(iterate,10);
            }
            drawMap(newPs);
            that.cycle ++;
        }

        this.start = function(){
            that.continuous = true;
            iterate();
        }

        this.stop = function(){
            that.continuous = false;
        }

        this.addPoint = function (x,y) {
            that.world[x][y] = that.initHeight;
        }

        var drawMap = function(precalculatedPoints){
            //No precalculated points, let's find them
            if (typeof precalculatedPoints == "undefined") {
                precalculatedPoints = [];
                for (x = 0;x<that.cnv.width;x++) {
                    for (y = 0;y<that.cnv.width;y++) {
                        if (that.world[x][y] > 0 ) {
                            precalculatedPoints.push([x,y]);
                        }
                    }
                }
            }

            //Draw all the found points
            for (i in precalculatedPoints) {
                x = precalculatedPoints[i][0];
                y = precalculatedPoints[i][1];
                that.ctx.fillRect(x,y,1,1);
            }
            that.callbacks.stats(that.currentMaxHeight, that.cycle);
        }

    };

var randomralks;
var $ = function(id){return document.getElementById(id)};
var statsCallback = function (maxHeight, cycle) {
    $('stats').innerHTML = 'MaxHeight: '+maxHeight+'<br/>Cycle: '+cycle;
}
window.addEventListener('load', function(){
    $('bt_init').addEventListener('click', function(e){
        var iniHeight = parseInt($('ini_height').value);
        var iniPoints = parseInt($('ini_points').value);
        randomwalks = new RandomWalks($('myCanvas'), iniHeight,iniPoints, {
            stats: statsCallback
        });
        randomwalks.init();
        $('myCanvas').addEventListener('click', function(e){
            randomwalks.addPoint(e.offsetX,e.offsetY);
        });
        $('bt_start').addEventListener('click', function(){
            randomwalks.start();
        });
        $('bt_stop').addEventListener('click', function(){
            randomwalks.stop();
        });
    });
});
