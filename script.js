
var randomralks;
var statsCallback = function (maxHeight, cycle) {
    $('#height').html(maxHeight);
    $('#cycle').html(cycle);
}
$(function(){
    $('#bt_init').click(function(e){
        var iniHeight = parseInt($('#ini_height').val());
        var iniPoints = parseInt($('#ini_points').val());
        randomwalks = new RandomWalks(document.getElementById('myCanvas'), iniHeight, iniPoints, {
            stats: statsCallback
        });
        randomwalks.init();
        $('#myCanvas').click(function(e){
            randomwalks.addPoint(e.offsetX,e.offsetY);
        });
        $('#myCanvas').mousemove(function(e){
            $('#watch').html(randomwalks.getPointValue(e.offsetX,e.offsetY));
        });
        $('#bt_start').click(function(){
            randomwalks.start();
        });
        $('#bt_stop').click(function(){
            randomwalks.stop();
        });
        $('#bt_save').click(function(){
            document.location.href = randomwalks.save();
        });
    });
});
