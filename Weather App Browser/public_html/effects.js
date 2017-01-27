var canvas;
var drops;
var imgUrl = "res//flake.png";
var flakeImage;
var flakes;
var fogUrl = "res//fog.png";
var fogImg;
var fog, fog2;
var setupComplete;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if(flakes){
      for(var i = 0; i < flakes.length; i++){
            flakes[i] = new Flake();
        }
  }
  if(drops){
      for(var i = 0; i < drops.length; i++){
            drops[i] = new Drop();
        }
  }
}

function preload(){
    fogImg = loadImage(fogUrl);
    flakeImage = loadImage(imgUrl);
}

function setupCanvas(){
    canvas = createCanvas(windowWidth,windowHeight);
    $("canvas").css('top',0);
}

function setup(){
    
    setupComplete = false;
    
    setTimeout(function(){
    
    if($(".rainy").css("display")==="block" 
            || $(".rainy").css("display")==="block"){
        setupCanvas();
        //initialize 100 raindrops
        drops = new Array(200);
        for(var i = 0; i < drops.length; i++){
            drops[i] = new Drop();
        }
    }
    
    if($(".snowy").css("display")==="block"){
        setupCanvas();
        flakes = new Array(100);
        for(var i = 0; i < flakes.length; i++){
            flakes[i] = new Flake();
        }
    }

    if($(".cloudy").css("display")==="block"){
        setupCanvas();
        $("canvas").css({
            top:"35%"
        });
        fog = new Fog();
        //second fog object for continuity
        fog2 = new Fog();
        fog2.x = $(window).width() + (fog.WIDTH/2);
    }
    
    
    setupComplete = true;
},500);
}

function draw(){
    //clears pixels of the buffer for re sketching
    clear();
    
    if(setupComplete){
    //loop through each drop object and carry out behaviour
    if($(".rainy").css("display")==="block" ||
             $(".rainy").css("display")==="block"){
        for(var i = 0; i < drops.length; i++){
            drops[i].show();
            drops[i].fall();
        }
        $("canvas").css('z-index','-1');
    }

    if($(".snowy").css("display")==="block"){
        for(var i = 0; i < flakes.length; i++){
            flakes[i].show();
            flakes[i].fall();
        }
        $("canvas").css('z-index','-1');
    }
    
    if($(".cloudy").css("display")==="block"){
        fog.fx();
        fog.show();
        fog2.fx();
        fog2.show();
        $("canvas").css('z-index','0');
    }
    
}
}


//Raindrop object
function Drop(){
    this.x = random(width);
    this.y = random(-1000,0);
    //higher z means faster yspeed and bigger drop object
    //mapping z gives parallax effect
    this.z = random(0,20);
    //closer things are faster
    this.len = map(this.z,0,20,5,20);
    this.yspeed = map(this.z,0,20,2,20);

    
    this.fall = function(){
        this.y = this.y + this.yspeed;
        if(this.y > height){
            this.y = random(-500,0);
            this.yspeed = map(this.z,0,20,2,20);
        }
        //gravity
        var grav = map(this.z,0,20,0,0.2);
        this.yspeed = this.yspeed+grav;
    };
    
    this.show = function(){
        var thick = map(this.z,0,20,1,1.5);
        strokeWeight(thick);
        stroke(158, 195, 255);
        line(this.x,this.y,this.x,this.y+this.len);
    };
    
}

//Snowflake object
function Flake(){
    
    this.z = random(0,20);
    this.x = random(0,width);
    this.y = random(-1000,0);
    this.yspeed = map(this.z,0,20,0.5,2);
    this.WIDTH = map(this.z,0,20,10,50);
    this.HEIGHT = this.WIDTH;
    
    this.fall = function(){
      this.y = this.y + this.yspeed;
      if(this.y>height){
          this.y = random(-1000,0);
          this.yspeed = map(this.z,0,20,0.5,2);
      }
      var grav = map(this.z,0,20,0,0.1);
      this.yspeed = this.yspeed+grav;
    };
    
    this.show = function(){
        image(flakeImage,this.x,this.y,this.WIDTH,this.HEIGHT);
    };
    
}

function Fog(){
    
    this.WIDTH = 4000;
    this.HEIGHT = height;
    this.x = -500;
    this.y = 0;
    this.xspeed = 1;
    
    this.fx = function(){
        this.x = this.x - this.xspeed;
        if(this.x < 0-this.WIDTH){
            this.x = width;
        }
    };
    
    this.show = function(){
      image(fogImg,this.x,this.y,this.WIDTH,this.HEIGHT);  
    };
    
}