newAuthCode();
var AuthCode;
var CodeList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function newAuthCode(){
    var options={
        canvasId: "auth-code",
        txt:"ZHZH",
        height:70,
        width:200
    };
    AuthCode = options.txt = randomCode();
    writeAuthCode(options);
    document.getElementById("auth-code-input").value = "";
}

function VerifyAuth(AuthCode){
    var AuthText = document.getElementById("auth-code-input").value;
    if(AuthText.toUpperCase() == AuthCode.toUpperCase())
        return true;
    else
        return false;
}

function randomNum(min,max){
    return Math.floor(Math.random()*(max-min)+min);
}

function randomCode(){
    var CodeList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return CodeList[randomNum(0,61)]+CodeList[randomNum(0,61)]+CodeList[randomNum(0,61)]+CodeList[randomNum(0,61)];
}

function randomColor(min,max){
    var r = randomNum(min,max);
    var g = randomNum(min,max);
    var b = randomNum(min,max);

    return "rgb("+r+","+g+","+b+")";
}

function writeAuthCode(options){
    var canvas    = document.getElementById(options.canvasId);
    canvas.width  = options.width || 300;
    canvas.height = options.height|| 150;

    var ctx          = canvas.getContext("2d");//创建canvas对象
    ctx.textBaseline = "middle";
    ctx.fillStyle    = randomColor(180,255);//背景颜色
    ctx.fillRect(0,0,options.width,options.height);

    for(var i = 0;i<options.txt.length;i++){
        var txt           = options.txt.charAt(i);
        ctx.font          = "40px SimHei";//字体大小及字体
        ctx.fillStyle     = randomColor(50,160);
        ctx.shadowOffsetY = randomNum(-3,3);
        ctx.shadowBlur    = randomNum(-3,3);
        ctx.shadowColor   = "rgba(0,0,0,0.3)";
        var x   = options.width/(options.txt.length+1)*(i+1);
        var y   = options.height/2;
        var deg = randomNum(-30,30);
        //设置旋转角度和坐标原点
        ctx.translate(x,y);
        ctx.rotate(deg*Math.PI/180);
        ctx.fillText(txt,0,0);
        //恢复旋转角度及坐标原点
        ctx.rotate(-deg*Math.PI/180);
        ctx.translate(-x,-y);
    }
    //添加1~4条干扰线
    for(var i = 0;i<randomNum(1,4);i++){
        ctx.strokeStyle = randomColor(40,180);
        ctx.beginPath();
        ctx.moveTo(randomNum(0,options.width),randomNum(0,options.height));
        ctx.lineTo(randomNum(0,options.width),randomNum(0,options.height));
        ctx.stroke();
    }
    //添加若干干扰点
    for(var i=0;i<options.width/6;i++){
        ctx.fillStyle = randomColor(0,255);
        ctx.beginPath();
        ctx.arc(randomNum(0,options.width),randomNum(0,options.height),1,0,2*Math.PI);
        ctx.fill();
    }
}