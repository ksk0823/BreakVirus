  //init
  var WIDTH;
  var HEIGHT;
  var x = 500;
  var y = 400;
  var radius = 10;
  var dx = 2;
  var dy = 4;

  var canvasMinX;
  var canvasMaxX;

  var is_gameover = false;

  var hardboss_head1 = false;
  var hardboss_head2 = false;
  var hardboss_head3 = false;

  //paddle
  var paddlex;
  var paddleh;
  var paddlew;


  // 보스관련

  var ix=340;
  var iy=100;
  var vx=2;
  var vy=2;
  var imgindex = 0;
  var bosshp=10;

  var easybosslist = ["img/boss/easyboss1.png", "img/boss/easyboss2.png", "img/boss/easyboss3.png", "img/boss/easyboss4.png"];
  var normalbosslist = ["img/boss/nmbs1.png", "img/boss/nmbs2.png", "img/boss/nmbs3.png", "img/boss/nmbs4.png", "img/boss/nmbs5.png", "img/boss/nmbs6.png"];
  //하드보스 이미지설정
  var hardbosslist = [];


  //보스공격
  var bsatk1=new Image();
  bsatk1.src='img/nmatk1.png'
  var bsatk2=new Image();
  bsatk2.src='img/nmatk2.png'
  var atkx1=Math.random()*900;
  var atkx2=Math.random()*900;
  var atky1=0;
  var atky2=0;
  var atkdy1=4;
  var atkdy2=5;
  //보스스킬
  var skill1=new Image();
  skill1.src='img/skill/skill1.png'
  // 사운드
  var bosshit=new Audio('sound/bosshit.mp3')
  var bossdie=new Audio('sound/easybossdie.wav')
  var nmbsatk=new Audio('sound/nmbsatk.mp3')
  var bomb=new Audio('sound/bomb.mp3')
  var bounce=new Audio('sound/bounce.mp3')
  var oops=new Audio('sound/oops.mp3')
  // 배경
  var bgi = new Image();
  // 시작이미지
  var startimg=new Image();
  startimg.src='img/backimg/startBoss.png'


  // 라이프
  var life=3;
  //스코어
  var score=0;
  ////////////////////////////////////
  var bosslevel= 3;
  ////////////////////////////////////

  var damage;
  var bgm;
  var infinite;


  var ctx;
  var anim;

  var ebimages=[];
  var nbimages=[];
  var hbimages=[];

  

  function gamestart(){
    window.cancelAnimationFrame(anim);
    ctx.beginPath();
    ctx.drawImage(startimg,0,0,WIDTH,HEIGHT);
    ctx.closePath();
    ctx.fill();

  }
    function init() {
    //canvas 가져오기
    ctx = $("#canvas")[0].getContext("2d");
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();

    canvasMinX = $("#canvas").offset().left;
    canvasMaxX = canvasMinX + WIDTH;
    //animation

    //TODO : 데이터 들고오기
    $.ajax({
      url: "/getSessionData",
      // dataType: "json",
      type: "GET",
      async : false,
      success: function (playingData) {
        bosslevel = playingData.level;
        life = playingData.life;
        score = playingData.score;
        damage = playingData.damage;
        radius = playingData.radius;
        paddlew = playingData.paddlew;
        bgm = playingData.bgm;
        infinite = playingData.infinite;
      },
    });

  
    if(bosslevel==1){
      bgi.src ="img/backimg/phase1-2.png";
      bosshp=10;
    }
    if(bosslevel==2){
      bosshp=20;
      ix=340;
      iy=100;
      vx=3;
      vy=3;
      bgi.src ="img/backimg/phase2-2.png";
    }
    if(bosslevel==3){
      bosshp=30;
      ix=-60;
      iy=-50;
      vx=1;
      vy=0;
      hardboss_head1=true;
      bgi.src ="img/backimg/phase3-2.png";
    }
  }
function initBackground(){
     //배경 넣기
     if(bosslevel == 1)
     {
       document.body.style.backgroundImage = "url('img/backimg/background1.png')";
     } else if(bosslevel == 2 ) {
       document.body.style.backgroundImage = "url('img/backimg/background2.png')";
     } else {
       document.body.style.backgroundImage = "url('img/backimg/background3.png')";
     }
   
     // document.body.style.backgroundImage = "url('img/backimg/background1.png')";
     document.body.style.backgroundSize = "cover";
     document.body.style.backgroundRepeat = "no-repeat";
   
     var position = 0;
     var speed = 1; // 이동 속도 조정
     var windowWidth = window.innerWidth; // 창의 가로 크기
   
     function moveBackground() {
       position -= speed;
       if (position <= -windowWidth) {
         position = 0;
       }
       document.body.style.backgroundPosition = position + "px 0";
     }
   
     setInterval(moveBackground, 20);
}
 

  

  // 이지 보스 모드 이야기  // 이지 보스 모드 이야기  // 이지 보스 모드 이야기
  // 이지 보스 모드 이야기  // 이지 보스 모드 이야기  // 이지 보스 모드 이야기
  // 이지 보스 모드 이야기  // 이지 보스 모드 이야기  // 이지 보스 모드 이야기

    function easydraw() {
    clear();
    bgimage();
    ball(x, y, radius);
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
    drawbosshp();

    
    if(infinite)
      $("#life").text("Life: ∞");
    else
      $("#life").text("Life: "+ life);
    $("#score").text("Score: "+ score);

    if(bosshp>0){
      easyboss(ix,iy)
    }

    x += dx;
    y += dy;
    ix += vx;
    iy += vy;

    //보스충돌감지

      if (bosshp>0 && x>ix+10 && x<ix+290 && y>iy+20 && y<iy+250) {
        dy = -dy;
        dx = -dx;
        vx = -vx;
        vy = -vy;
        if(bosshp<=5){
          if(vx<0) vx= 3;
          if(vx>0) vx= -3;
          if(vy<0) vy= 3;
          if(vy>0) vy= -3;
        }
        bosshp-=damage;
        score+=1200
        updateMessage(1);
        if(bgm)
          bosshit.play();
        if(bosshp<=0){
          if(bgm)
            bossdie.play();
          score+=10000
          saveData(false);
          nextLevel();
        }
    }
    

    if (x >= WIDTH - radius || x <= 0 + radius) {
      dx = -dx;
      if(bgm)
        bounce.play();
    }
    if (y <= 0 + radius) {
      dy = -dy;
      if(bgm)
        bounce.play();
    } else if (y >= HEIGHT - radius) {
      if (x > paddlex && x < paddlex + paddlew) {
        dx = -((paddlex + paddlew / 2 - x) / paddlew) * 10;
        dy = -dy;
        if(bgm)
          bounce.play();
      } else {
        if(infinite){
          x = 500;
          y = 400;
        }else{
          if(life>1){
            updateMessage(0);
              life--;
              x = 500;
              y = 400;
              score-=2000;
              if(bgm)
                oops.play();
            }else{
              if(!infinite)
                is_gameover = true;
            }
        }
      }
    }
    //보스움직임제한
    if (ix < 0 || ix > 660) {
      vx = -vx;
    }
    if (iy < 0 || iy > 200) {
      vy = -vy;
    }

    if(imgindex>=ebimages.length){
      imgindex=0;

    }

    if (is_gameover) {
      saveData(false);
    window.location.href = "score.html";

      window.cancelAnimationFrame(anim);
    } else {
      anim = window.requestAnimationFrame(easydraw);
    }
  }

  //노말 보스 모드 이야기  //노말 보스 모드 이야기  //노말 보스 모드 이야기
  //노말 보스 모드 이야기  //노말 보스 모드 이야기  //노말 보스 모드 이야기
  //노말 보스 모드 이야기  //노말 보스 모드 이야기  //노말 보스 모드 이야기
  



    function normaldraw() {
    clear();
    bgimage();
    ball(x, y, radius);
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
    drawbosshp();
    
    if(bosshp>0){
      normalboss(ix,iy);
      bsatkimg1();
      atky1+=atkdy1;
    }
    if(atky2<1000&&bosshp<11){
      bsatkimg2();
      atky2+=atkdy2;
    }

    if(infinite)
      $("#life").text("Life: ∞");
    else
      $("#life").text("Life: "+ life);

    $("#score").text("Score: "+ score);
    
    x += dx;
    y += dy;
    ix += vx;
    iy += vy;
    

    //보스충돌감지
      if (bosshp>0 && x>ix+30 && x<ix+250 && y>iy && y<iy+230) {
        dy = -dy;
        dx = -dx;
        vx = -vx;
        vy = -vy;
        if(bosshp<=10){
          if(vx<0) vx= 5;
          if(vx>0) vx= -5;
          if(vy<0) vy= 5;
          if(vy>0) vy= -5;
        }
        bosshp-=damage;
        score+=1600;
        updateMessage(1);

        if(bgm)
          bosshit.play();

        if(bosshp<=0){
          if(bgm)
            bossdie.play();
          score+=25000;
          middle_boss=false
          saveData(false);
          nextLevel();
        }
      }

    if (x >= WIDTH - radius || x <= 0 + radius) {
      dx = -dx;
      if(bgm)
        bounce.play();
    }
    if (y <= 0 + radius) {
      dy = -dy;
      if(bgm)
        bounce.play();
    } else if (y >= HEIGHT - radius) {
      if (x > paddlex && x < paddlex + paddlew) {
        dx = -((paddlex + paddlew / 2 - x) / paddlew) * 10;
        dy = -dy;
        if(bgm)
          bounce.play();
      } else {
        if(infinite){
          x = 500;
          y = 400;
        }else{
        if(life>1 && infinite==false){
        updateMessage(0);
          life--;
          ix = 380;
          iy = 100;
          x = 500;
          y = 400;
          score-=3000;
          if(bgm)
            oops.play();
        }else{
          if(!infinite)
            is_gameover = true;
        }
      }
      }
    }
    //y=0;
    //보스공격충돌감지
    if(bosshp>0&&atkx1>paddlex-paddlew&&atkx1<paddlex+paddlew&&atky1>560){
      if(life>1 && infinite==false){
        atkx1=Math.random()*900;
        atky1=0;
        updateMessage(0);

        if(bgm)
          bomb.play();
        life--;
        score-=3000;
      }else{
        if(!infinite)
            is_gameover = true;
      }
    }
     if(bosshp>0&&atkx2>paddlex-paddlew&&atkx2<paddlex+paddlew&&atky2>560){
      if(life>1 && infinite==false){
        atkx2=Math.random()*900;
        atky2=0;
        updateMessage(0);

        if(bgm)
          bomb.play();
        life--;
        score-=3000;
      }else{
        if(!infinite)
            is_gameover = true;
      }
    }

    //보스움직임제한
    if(ix<0||ix>660){
      vx = -vx;
    }
    if(iy<0||iy>200){
      vy = -vy;
    }
    //보스배열초기화(그림표시설정)
    if(imgindex>=nbimages.length){
      imgindex=0;
    }
    //보스공격y좌표초기화
    if(bosshp>0&&atky1>580){
      atky1=0;
      atkx1=Math.random()*900;
      if(bgm)
        nmbsatk.play();
    }
    if(bosshp>0&&atky2>560){
      atky2=0;
      atkx2=Math.random()*900;
      if(bgm)
        nmbsatk.play();
    }


    if (is_gameover) {
      saveData(false);
      window.location.href = "score.html";
      window.cancelAnimationFrame(anim);
    } else {
      anim = window.requestAnimationFrame(normaldraw);
    }
  }
  // 노말보스 공격
  function bsatkimg1(){
    ctx.drawImage(bsatk1,atkx1,atky1,80,80);
  }
  function bsatkimg2(){
    ctx.drawImage(bsatk2,atkx2,atky2,100,100);
  }

  //하드 보스 모드 이야기  //하드 보스 모드 이야기  //하드 보스 모드 이야기
  //하드 보스 모드 이야기  //하드 보스 모드 이야기  //하드 보스 모드 이야기
  //하드 보스 모드 이야기  //하드 보스 모드 이야기  //하드 보스 모드 이야기

    function harddraw() {
    clear();
    if(hardboss_head3){
      bgi.src ="img/backimg/phase3-2a.png"
    }else{
      bgi.src ="img/backimg/phase3-2.png"
    }
    bgimage();
    ball(x, y, radius);
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
    drawbosshp();
    if(hardboss_head2)
      drawskill1();
    if(bosshp>0){
      hardboss(ix,iy);
      bsatkimg1();
      atky1+=atkdy1;
      
    }
    if(bosshp>0&&hardboss_head1){
      
      bsatkimg2();
      
      atky2+=atkdy2;
    }

    if(infinite)
      $("#life").text("Life: ∞");
    else
      $("#life").text("Life: "+ life);
    $("#score").text("Score: "+ score);
    
    x += dx;
    y += dy;
    ix += vx;
    iy += vy;
    

    //보스충돌감지
      if (bosshp>0 && x>ix+200 && x<ix+300 && y>iy+210 && y<iy+310) {
        dx = -dx;
        dy = -dy;
        vx = -vx;
        bosshp-=damage;
        score+=2500;
        updateMessage(1);

        if(bgm)
          bosshit.play();
        if(hardboss_head1 && bosshp<=20){
          hardboss_head1=false;
          hardboss_head2=true;
          ix=245;
          iy=-150;
        }
        if(hardboss_head2 && bosshp<=10){
          hardboss_head2=false;
          hardboss_head3=true;
          ix=570;
          iy=-110;
        }
        // if(hardboss_head3 && bosshp<=5){
        //   hardboss_head3=false;
        //   hardboss_head1=true;
        //   ix=-60;
        //   iy=-50;
        // }
        if(bosshp<=0){
          if(bgm)
            bossdie.play();
          score+=60000
          saveData(true);
          nextLevel();
        }
      }

    if (x >= WIDTH - radius || x <= 0 + radius) {
      dx = -dx;
      if(bgm)
        bounce.play();
    }
    if (y <= 0 + radius) {
      dy = -dy;
      if(bgm)
        bounce.play();
    } else if (y >= HEIGHT - radius) {
      if (x > paddlex && x < paddlex + paddlew) {
        dx = -((paddlex + paddlew / 2 - x) / paddlew) * 10;
        dy = -dy;
        if(bgm)
          bounce.play();
      } else {
        if(infinite){
          x = 500;
          y = 400;
        }else{
        if(life>1 && infinite==false){
        updateMessage(0);

          life--;
          score-=5000;
          x = 500;
          y = 400;
          if(bgm)
            oops.play();
        }else{
          if(!infinite)
            is_gameover = true;
        }
      }
    }
  }
     //보스공격충돌감지
    if(atkx1>paddlex-paddlew&&atkx1<paddlex+paddlew&&atky1>560){
      if(life>1 && infinite==false){
        score-=5000;
        atkx1=Math.random()*900;
        atky1=0;
        updateMessage(0);

        if(bgm)
          bomb.play();
        life--;
      }else{
        if(!infinite)
            is_gameover = true;
      }
    }
     if(atkx2>paddlex-paddlew&&atkx2<paddlex+paddlew&&atky2>560){
      if(life>1 && infinite==false){
        score-=5000;
        atkx2=Math.random()*900;
        atky2=0;
        updateMessage(0);

        if(bgm)
          bomb.play();
        life--;
      }else{
        if(!infinite)
            is_gameover = true;
      }
    }
    //보스움직임제한
    if(hardboss_head1){
      if(ix<-80||ix>-40){
      vx= -vx;
      }
    }
    if(hardboss_head2){
      if(ix<215||ix>275){
      vx= -vx;
      }
    }
    if(hardboss_head3){
      if(ix<530||ix>610){
      vx= -vx;
      }
    }

    
    if(iy<-70||iy>-30){
      vy = -vy;
    }
    //보스배열초기화(그림표시설정)
    if(imgindex>=hbimages.length){
      imgindex=0;
    }
    //보스공격y좌표초기화
    if(bosshp>0&&atky1>580){
      atky1=0;
      atkx1=Math.random()*900;
      if(bgm)
        nmbsatk.play();
    }
    if(bosshp>0&&atky2>560){
      atky2=0;
      atkx2=Math.random()*900;
      if(bgm)
        nmbsatk.play();
    }

    if(bosshp<16){
      if(dx>0) dx= 4;
      if(dx<0) dx= -4;
      if(dy>0) dy= 6;
      if(dy<0) dy= -6;
    }


    if (is_gameover) {
      saveData(false);
      window.location.href = "score.html";
      window.cancelAnimationFrame(anim);
    } else {
      anim = window.requestAnimationFrame(harddraw);
    }
  }
  
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////


  function drawbosshp() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Boss HP: " + bosshp, 8, 30);
  }
  function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }
  // 이지 보스 그래픽
  function easyboss(ix, iy) {
    if (ebimages[imgindex]) {
      var ebimage = ebimages[imgindex];
      ctx.drawImage(ebimage, ix, iy, 300, 300);
     imgindex++;

    }
  }
  // 노말 보스 그래픽
  function normalboss(ix, iy) {
    if (nbimages[imgindex]) {
      var nbimage = nbimages[imgindex];
      ctx.drawImage(nbimage, ix, iy, 250, 250);
     imgindex++;
    }
  }
  // 하드 보스 그래픽
  function hardboss(ix, iy) {
    if (hbimages[imgindex]) {
      var hbimage = hbimages[imgindex];
      ctx.drawImage(hbimage, ix, iy, 500, 500);
     imgindex++;
     if(bosshp<20)
      imgindex++;
    if(bosshp<10)
      imgindex++;
    }
  }
  function drawskill1(){
    ctx.drawImage(skill1,840,10,100,80);
  }
  function bgimage() {
    ctx.drawImage(bgi, 0, 0, canvas.width, canvas.height);
  }
  function ball(x, y, r) {
    ctx.fillStyle = "#03158a";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }
  function rect(x, y, w, h) {
    //TEST 바 이미지 공 이미지
    var barChain = new Image();
    barChain.src = "img/figure/chain.png";
    ctx.beginPath();
    ctx.drawImage(barChain, x, y, w, h);
    ctx.closePath();
    ctx.fill();
  }
  function init_paddle() {
    paddlex = WIDTH / 2;
    paddleh = 10;
  }

  function onMouseMove(e) {
    if (e.pageX >= canvasMinX && e.pageX <= canvasMaxX) {
      if(!hardboss_head2){
        paddlex = e.pageX - canvasMinX - paddlew / 2;
      } else{
        var cursorX = e.pageX - canvasMinX;
        paddlex = canvasMaxX - cursorX - paddlew / 2;
      }
    }
  }

  function saveData(w){
    var tmp = bosslevel+1;
    
    var body = {
      level: tmp,
      life: life,
      score: score,
      damage: damage,
      radius: radius,
      paddlew: paddlew,
      bgm: bgm,
      infinite: infinite
    }
    if(w)
      body.win = w;      
    $.ajax({
      url: "/save",
      contentType: 'application/json',
      type: "POST",
      async: false,
      data: JSON.stringify(body),
      success: function (data) {
        console.log("save success");
      },
    });
  }
  function nextLevel(){
    if(bosslevel == 3){
      window.location.href = "score.html";
    }else{
      window.location.href = "phase1.html";
    }
  }
  function updateMessage(idx){
    switch (idx) {
      case 0:
      $("#message").text("Life - 1");
        break;
      case 1:
        $("#message").text("Boss " + damage + " Damaged");
        break;
      default:
        break;
    }
  }
  function switchGame(){
    if(bosslevel==1){
      anim = requestAnimationFrame(easydraw);
    }
    if(bosslevel==2){
      anim = requestAnimationFrame(normaldraw);
    }
    if(bosslevel==3){
      anim = requestAnimationFrame(harddraw);
    }
  }
  function bossImginit(){
    if(bosslevel==1){
    easybosslist.forEach(function(src,index){
      var ebimg=new Image();
      ebimg.src=src;
      ebimg.onload=function(){
        ebimages[index]=ebimg;
      }
    });
    }else if(bosslevel==2){
    normalbosslist.forEach(function(src,index){
      var nbimg=new Image();
      nbimg.src=src;
      nbimg.onload=function(){
        nbimages[index]=nbimg;
      }
    });
    }else if(bosslevel==3){
      for (var i = 0; i <= 72; i++) {
        var imageName = "hbs" + i + ".png";
        var imagePath = "img/hbs/" + imageName;
        hardbosslist.push(imagePath);
        }
     hardbosslist.forEach(function(src,index){
      var hbimg=new Image();
      hbimg.src=src;
      hbimg.onload=function(){
        hbimages[index]=hbimg;
      }
    });
  }
}
$(function () {


  $('#canvas').click(function() {
    switchGame();
    $('#canvas').unbind('click');
  });
  init();
  initBackground();
  bossImginit();
  setTimeout(gamestart,300);

  init_paddle();
  
  
  $(document).mousemove(onMouseMove);
});
