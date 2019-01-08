
//游戏状态
const INIT_SIZE = 60;           // 玩家小球初始大小
const INIT_SPEED = 0.082;       // 小球初始速度
const INIT_COLOR = 5;           // 小球默认颜色下标
FOODS_NUM =50;                  // 食物默认数量
const BOMB_NUM = 0;             // 炸弹默认数量
const DEFAULT_FOOD_SIZE = 15;   // 食物默认大小(IS_SAME_SIZE为true时有效)
const DEFAULT_BOMB_SIZE = 12;   // 炸弹默认大小(IS_SAME_SIZE为true时有效)
const REFRESH_TIME = 1.6;       // 食物/炸弹刷新时间
const INCREASE_SPEED = 0.05;    // 小球增长速度
const IS_SAME_SIZE = false;     // 食物/炸弹大小是否固定(false表示大小随机)
const BOMB_COLORS = [
    "#000000"
];
const FOODS_COLORS = [
    "#FE9D01",
    "#C5DA01",
    "#99CF15",
    "#008678",
    "#D40045",
    "#CAB2D6",
    "rgb(200,200,169)",
    "rgb(254,67,101)",
    "rgb(131,175,155)",
    "rgb(249,205,173)",
    "rgb(250,227,113)",
    "rgb(38,157,128)",
    "rgb(6,128,67)",
    "rgb(137,157,192)"
];



//------------------------------------------------------------食物类
class Food{
    constructor(element, id,  size, bg, posX, posY){
        this.element = element;
        this.size = size;
        this.id = id;
        this.bg = FOODS_COLORS[bg];
        this.posX = posX;
        this.posY = posY;
        this.element.style.width = size+"px";
        this.element.style.height = size+"px";
        this.element.style.background = this.bg;
        this.element.style.left = posX+"px";
        this.element.style.top = posY+"px";
    }
    disappear(){
        this.element.remove();
    }
    static isEat(ball,food){
        var ballSIZE = ball.size;
        var ballX = parseFloat(ball.element.style.left.split("px")[0])+ballSIZE/2;
        var ballY = parseFloat(ball.element.style.top.split("px")[0])+ballSIZE/2;
        var length = Math.sqrt(Math.pow((parseFloat(food.posX) + food.size/2 - ballX),2) + Math.pow((parseFloat(food.posY) + food.size/2 - ballY),2));
        if(length<(parseFloat(ballSIZE)-food.size)/2) {
            return true;
        }
        else return false;
    }
}

//食物集合
var foods =  [];
console.log(foods.length); 


//生成食物
function makeFood(id, x, y, _bg, fs) {
    var food_div = document.createElement("div");
    food_div.setAttribute("class","food");
    food_div.setAttribute("id", id);
    document.body.insertBefore(food_div,document.body.firstChild);
    let size;
    if(IS_SAME_SIZE){
        size = DEFAULT_FOOD_SIZE;
    }else {
        size = fs*20;
    }
    let bg = parseInt(_bg*(FOODS_COLORS.length-1));
    let pos_x = x*document.documentElement.clientWidth;
    let pos_y = y*document.documentElement.clientHeight;
    var food = new Food(food_div, id, size, bg, pos_x, pos_y);
    foods.push(food);
}

$(function () {

    var name = $.cookie("playerName");
    var isDie = false;

    function getColorIndex(color){
        for (let i=0;i<FOODS_COLORS.length;i++){
            if(FOODS_COLORS[i] == color){
                return i;
            }
        }
    }

    //------------------------------------------------------------球球
    class Ball{
        constructor(element, size ,bg, name){
            this.element = element;
            this.size = size;
            this.bg = FOODS_COLORS[bg];
            this.name = name;
            this.element.style.width = size + "px";
            this.element.style.height = size + "px";
            this.element.style.background = this.bg;
            this.element.style.lineHeight = size+"px";
            this.element.innerHTML = name;
        }
        move(){//移动
           if($.cookie("playerName")==this.name){
                $(this.element).velocity("stop");
                let left = event.pageX-(parseFloat(this.size)/2);
                let top = event.pageY-(parseFloat(this.size)/2);
                var times = this.size/INIT_SPEED + left/5 + top/5;
                $(this.element).velocity({
                    left: left, top:top
                },{
                    duration:times,
                    easing:"linear",
                    progress:function () {
                          for(let i=0;i<foods.length;i++){
                            if(Food.isEat(ball, foods[i])){ //检测食物是否被球吃掉
                                var overfood = new proto.Msg.Food();//声明食物结构体
                                var clientMsg = new proto.Msg.ClientMessage(); //声明消息结构体

                                overfood.setId(foods[i].id)
                                clientMsg.setOrder(proto.Msg.ClientOrder.CLIENTORDER_FOOD_EAT)
                                clientMsg.setFood(overfood)
                                
                                //console.log(clientMsg.toObject());
                                var S = clientMsg.serializeBinary()//序列化
                                ws.send(S)

                                //ball.eat(foods[i]);
                                foods[i].disappear();
                                foods.splice(i,1);
                                console.log(i + "号小球被吃");
                            }
                       }
                       /*
                       for (let i=0;i<bombs.length;i++){
                           if(Bomb.isBoom(ball,bombs[i])){
                               ball.boom(bombs[i]);
                               bombs[i].disappear();
                               bombs.splice(i,1);
                           }
                       }
                       */
                    },
                });
                return true;
           }else return false;
        }
        setSize(val){//设置大小
            var change_size = parseFloat(val);
            this.size = change_size;
            this.element.style.width = change_size + "px";
            this.element.style.height = change_size + "px";
            this.element.style.lineHeight = change_size+"px";
            this.element.style.fontSize = change_size/5+"px";
         }
        eat(food){
            var change_size = parseFloat(this.size)+food.size*INCREASE_SPEED;
            this.size = change_size;
            this.element.style.width = change_size + "px";
            this.element.style.height = change_size + "px";
            this.element.style.lineHeight = change_size+"px";
            this.element.style.fontSize = change_size/5+"px";
        }
        boom(bomb){
            $(this.element).velocity("stop");
            let food_div = document.createElement("div");
            food_div.setAttribute("class","food");
            document.body.insertBefore(food_div,document.body.firstChild);
            let px = window.getComputedStyle(this.element,null)["left"].split("px")[0];
            let py = window.getComputedStyle(this.element,null)["top"].split("px")[0];
            this.element.remove();
            isDie = true;
            let food = new Food(food_div,this.size,getColorIndex(this.bg),px,py);
            foods.push(food);
        }
    }



 

    //------------------------------------------------------------炸弹类
    class Bomb{
        constructor(element, size, bg, posX, posY){
            this.element = element;
            this.size = size;
            this.bg = BOMB_COLORS[bg];
            this.posX = posX;
            this.posY = posY;
            this.element.style.width = size+"px";
            this.element.style.height = size+"px";
            this.element.style.background = this.bg;
            this.element.style.left = posX+"px";
            this.element.style.top = posY+"px";
        }
        disappear(){
            this.element.remove();
        }
        static isBoom(ball,bomb){
            var ballSIZE = ball.size;
            var ballX = parseFloat(ball.element.style.left.split("px")[0])+ballSIZE/2;
            var ballY = parseFloat(ball.element.style.top.split("px")[0])+ballSIZE/2;
            var length = Math.sqrt(Math.pow((parseFloat(bomb.posX) + bomb.size/2 - ballX),2) + Math.pow((parseFloat(bomb.posY) + bomb.size/2 - ballY),2));
            if(length<(parseFloat(ballSIZE)+bomb.size)/2) {
                return true;
            }
            else return false;
        }
    }

    //-----------------------------------------------------------游戏设置

    //获取姓名
    if(name==null) {
        name = prompt("Input Your Name", "");
        $.cookie("playerName",name);
    }

    //初始化球 Ball
    var color_index = INIT_COLOR;
    var ball_div = document.createElement("div");
    ball_div.setAttribute("class","ball");
    ball_div.setAttribute("id","ball");
    document.body.appendChild(ball_div);
    var ball_div = document.body.lastChild;
    var ball = new Ball(ball_div,INIT_SIZE,color_index,name);

    /*
    //初始化食物
    function FoodInit(){
        for(let i=0;i<FOODS_NUM;i++){
            makeFood(Math.random(),Math.random(),Math.random(),Math.random());
        }
    }

    //开始初始化
    FoodInit()

    //JavaScript 计时事件
    setInterval( function () {
        if(foods.length < FOODS_NUM){
            let num = FOODS_NUM - foods.length;
            makeFood(Math.random(),Math.random(),Math.random(),Math.random());
        }
    },REFRESH_TIME*100);
    */


    

    //鼠标移动指令
    $(document).on("mousemove",function () {
        if(isDie==false){
            ball.move();
        }else{
            alert("You Die.");
            $(document).unbind();
        }
    });

});

function off(){
    console.log("哈哈哈哈哈哈");
}