//游戏状态
const INIT_SIZE = 60;           // 玩家小球初始大小
const INIT_SPEED = 200;         // 小球初始速度
const IS_SAME_SIZE = false;     // 食物/炸弹大小是否固定(false表示大小随机)
const DEFAULT_FOOD_SIZE = 15;   // 食物默认大小(IS_SAME_SIZE为true时有效)

INIT_COLOR = 5;                 // 小球默认颜色下标
FOODS_NUM = 50;                 // 食物默认数量

//玩家
var PlayerSelf 

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
}// end class Food

//食物集合
var foods =  [];

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

function Change_Ball_Size(size){
    PlayerSelf.setSize(size)
}

function Change_Ball_Pos(posx, posy){
    PlayerSelf.setPos(posx, posy)
}

//开始设置
$(function () {

    var name = $.cookie("playerName");
    var isDie = false;

    //获取姓名
    if(name==null) {
        name = prompt("Input Your Name", "");
        $.cookie("playerName",name);
    }

    //------------------------------------------------------------玩家球类
    class Ball{
        constructor(element, size ,bg, name){
            this.element = element;
            this.size = size;
            this.bg = FOODS_COLORS[bg];
            this.name = name;
            this.p_left = 0;
            this.p_top = 0;
            this.element.style.width = size + "px";
            this.element.style.height = size + "px";
            this.element.style.background = this.bg;
            this.element.style.lineHeight = size+"px";
            this.element.innerHTML = name;
        }

        stopbykey(){//停止移动
            if($.cookie("playerName")==this.name){
                $(this.element).velocity("stop");
                switch (event.which){
                    case 65:{ // ← 左 a
                        console.log("A")
                        this.p_left = 0
                    };break;
                    case 87:{// 上 "W"
                        console.log("W")
                        this.p_top =  0
                    };break;
                    case 68:{// 右 "D"
                        console.log("D")
                        this.p_left = 0
                    };break;
                    case 83:{// 下 "s"
                        console.log("S")
                        this.p_top = 0
                    };break;
                    default:break;
                }
                var b_left = parseFloat(this.element.style.left.split("px")[0]) + this.p_left
                var b_top = parseFloat(this.element.style.top.split("px")[0]) + this.p_top
                console.log("p_left: " + this.p_left + " p_top: " +this.p_top  + "b_left: " + b_left + " b_top: " +b_top + " event.which: " + event.which);
                $(this.element).velocity({
                    left: b_left, top: b_top
                },{
                    duration:INIT_SPEED * this.size,
                    easing:"linear",                
                    progress:function () {
                        for(let i=0;i<foods.length;i++){
                            if(Food.isEat(PlayerSelf, foods[i])){ //检测食物是否被球吃掉
                                var overfood = new proto.Msg.Food();//声明食物结构体
                                var eatfoodMsg = new proto.Msg.EatFoodMsg(); //声明吃食物消息结构体
                                var clientMsg = new proto.Msg.ClientMessage(); //声明客户端消息结构体

                                overfood.setId(foods[i].id)     //设置食物id
                                eatfoodMsg.setFood(overfood)    //设置被吃食物信息
                                clientMsg.setOrder(proto.Msg.ClientOrder.CLIENTORDER_FOOD_EAT) //设置吃食物指令
                                clientMsg.setEatfoodmsg(eatfoodMsg) //设置客户端消息

                                var S = clientMsg.serializeBinary()//序列化
                                ws.send(S)

                                //ball.eat(foods[i]);
                                foods[i].disappear();
                                foods.splice(i,1);
                                console.log(i + "号小球被吃");
                            }
                        }
                    },
                });
                return true;
            }else return false;
        }

        movebykey(){//移动
            if($.cookie("playerName")==this.name){
                $(this.element).velocity("stop");
                switch (event.which){
                    case 65:{ // ← 左 a
                        console.log("A")
                        this.p_left = -1000
                    };break;
                    case 87:{// 上 "W"
                        console.log("W")
                        this.p_top =  -1000
                    };break;
                    case 68:{// 右 "D"
                        console.log("D")
                        this.p_left = 1000
                    };break;
                    case 83:{// 下 "s"
                        console.log("S")
                        this.p_top = 1000
                    };break;
                    default:break;
                }
                var b_left = parseFloat(this.element.style.left.split("px")[0]) + this.p_left
                var b_top = parseFloat(this.element.style.top.split("px")[0]) + this.p_top
                console.log("p_left: " + this.p_left + " p_top: " +this.p_top  + "b_left: " + b_left + " b_top: " +b_top + " event.which: " + event.which);
                $(this.element).velocity({
                    left: b_left, top: b_top
                },{
                    duration:INIT_SPEED * this.size,
                    easing:"linear",
                    progress:function () {
                        for(let i=0;i<foods.length;i++){
                            if(Food.isEat(PlayerSelf, foods[i])){ //检测食物是否被球吃掉
                                var overfood = new proto.Msg.Food();//声明食物结构体
                                var eatfoodMsg = new proto.Msg.EatFoodMsg(); //声明吃食物消息结构体
                                var clientMsg = new proto.Msg.ClientMessage(); //声明消息结构体

                                overfood.setId(foods[i].id)     //设置食物id
                                eatfoodMsg.setFood(overfood)    //设置被吃食物信息
                                clientMsg.setOrder(proto.Msg.ClientOrder.CLIENTORDER_FOOD_EAT) //设置吃食物指令
                                clientMsg.setEatfoodmsg(eatfoodMsg) //设置客户端消息

                                var S = clientMsg.serializeBinary()//序列化
                                ws.send(S)

                                //ball.eat(foods[i]);
                                foods[i].disappear();
                                foods.splice(i,1);
                                console.log(i + "号小球被吃");
                            }
                        }
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
        setPos(posx, posy){//设置位置
            var change_posx = parseFloat(posx) * document.documentElement.clientWidth;
            var change_posy = parseFloat(posy) * document.documentElement.clientHeight;
            this.element.style.left = change_posx+"px";
            this.element.style.top = change_posy+"px";
        }

        eat(food){
            var change_size = parseFloat(this.size)+food.size*INCREASE_SPEED;
            this.size = change_size;
            this.element.style.width = change_size + "px";
            this.element.style.height = change_size + "px";
            this.element.style.lineHeight = change_size+"px";
            this.element.style.fontSize = change_size/5+"px";
        }

        static Init(){
            //初始化球 Ball
            var color_index = INIT_COLOR; //默认颜色下标
            var ball_div = document.createElement("div");
            ball_div.setAttribute("class","ball");
            ball_div.setAttribute("id","ball");
            document.body.appendChild(ball_div);
            var ball_div = document.body.lastChild;
            return (new Ball(ball_div, INIT_SIZE, color_index, name));
        }
    }// end class Ball

    //生成玩家 Player
    PlayerSelf = Ball.Init()

    //随机玩家位置
    //Change_Ball_Pos(Math.random(), Math.random())
    
    //键盘控制运动
    $(document).on("keydown",function () {
        if(isDie==false){
            PlayerSelf.movebykey();
        }else{
            alert("You Die.");
        }
    });

     //停止运动
     $(document).on("keyup",function () {
        if(isDie==false){
            PlayerSelf.stopbykey();
        }else{
            alert("You Die.");
        }
    });
});


/*
    //鼠标移动指令
    $(document).on("mousemove",function () {
        if(isDie==false){
            ball.move();
        }else{
            alert("You Die.");
            $(document).unbind();
        }
    });
    */
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
                    },
                });
                return true;
           }else return false;
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

    function getColorIndex(color){
        for (let i=0;i<FOODS_COLORS.length;i++){
            if(FOODS_COLORS[i] == color){
                return i;
            }
        }
    }

*/
