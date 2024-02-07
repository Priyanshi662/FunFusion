var game = document.getElementById('game');
var set = [];
var prev = 0;
var score = 0;
var times = 0;
var width = 1;
var time = 0;
var gameisover = false;
var totalTimeSecs = 60; // 60 Sec Game
var timer = setInterval(function(){
var per = Math.round((width/totalTimeSecs)*100);
  time++;
  document.getElementById('timer').style.width = per+'%';
  width++;
},1000);

let brightnessControl = null;

var timerout = setTimeout(function(){
  gameOver();
},totalTimeSecs*1000);

function genSet(){
  var htmCode = '';
  var blackID = Math.trunc(Math.random()*3);
  if(prev == blackID){
    blackID = Math.round(Math.random()*blackID);
  }
  prev = blackID;
  var tileWidth = (($('#mobileDisplay').width())/4)-1;
  for(var i=0;i<4;i++){
    if(i==blackID){
      htmCode += '<div style="width:'+tileWidth+'px;" class="tile black"></div>'; 
    } else {
      htmCode += '<div style="width:'+tileWidth+'px;" class="tile"></div>'; 
    }
  }
  return htmCode;
}

$(window).load(function(){
  var height = $('#mobileDisplay').height()/4;
  bottom = 0;
  for(var i=0;i<5;i++)
    if(i==0){      
     $('#game').html($('#game').html()+'<div class="set current" style="bottom:'+ bottom +'px;height:'+height+'px;">' + genSet() + '</div>'); 
      bottom += height;
    } else if(i==4){
     $('#game').html($('#game').html()+'<div class="set last" style="bottom:'+ bottom +'px;height:'+height+'px;">' + genSet() + '</div>');          
         }
  else {
    $('#game').html($('#game').html()+'<div class="set" style="bottom:'+ bottom +'px;height:'+height+'px;">' + genSet() + '</div>'); 
    bottom += height;
  }
  $('.current div').click(function clicked(){
     if($(this).hasClass('black')){
      if(gameisover === false){
       $(this).css("background","rgb(170,170,170)");
       $('.last').html(genSet());
       var pos = $('.current');
       var currHtm = pos.html();
       if(times > 0){
         pos.prev().html(currHtm);
         var next1 = pos.next().html();
         var next2 = pos.next().next().html();
         var next3 = pos.next().next().next().html();
         pos.html(next1);
         pos.next().html(next2);
         pos.next().next().html(next3);
       }
       times++;
       if(times == 1){
         pos.removeClass('current').next().addClass('current');
       }
       $('.current div').each(function(){
         this.onclick = clicked;
       });
       score++;
       $('#score').text(score);
        
       if(window.lamina && window.lamina.isPermitted("brightness")) {
          if(score > 20){
         if(brightnessControl == null){
           brightnessControl = score;
           if(score % 2 == 0){
            window.lamina.setBrightness(50-Math.trunc(Math.random()*50));
           } else {
             window.lamina.setBrightness(20-Math.trunc(Math.random()*10));
           }
         } else if(brightnessControl+10 == score){
           brightnessControl += 10+Math.trunc(Math.random()*10);
           if(score % 2 == 0){
            window.lamina.setBrightness(50-Math.trunc(Math.random()*50));
           } else {
             window.lamina.setBrightness(20-Math.trunc(Math.random()*10));
           }
         }
       }
       }
       if(window.lamina && window.lamina.isPermitted("vibrate")) {
         lamina.vibrate(100);
       } 
     }
    } else {
      gameisover = true;
      clearInterval(timer);
      setTimeout(gameOver,1500);     
      $(this).addClass('red');      
    }
  });  
});
function gameOver(){
    clearInterval(timer);
    clearTimeout(timerout);
    var num = score/time;
    if(isNaN(num)){ num=0; }
    $('#mobileDisplay').css('background','tomato').css('color','white');
    $('#game').html('<center><h1 style="margin-top:100px;">Game Over</h1><h3>Score : '+num.toFixed(4)+' tiles/sec </h3><button class="button button-block" onclick="location.reload();">Play Again</button></center>');
}