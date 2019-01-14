var ws

// websocket连接服务器
if ("WebSocket" in window){

   // web socket
   ws = new WebSocket("ws://127.0.0.1:6789/");

   //数据帧
   var player_0 = new proto.Msg.Player()
   var dataframe = new proto.Msg.ClientDataFrame()
   var clientmsg = new proto.Msg.ClientMessage()
   clientmsg.setOrder(proto.Msg.ClientOrder.CLIENTORDER_DATA_FRAME)
   
   ws.onopen = function(){//连接成功
      alert("ok WebSocket!");
      
      //JavaScript 计时事件 20ms 发送数据帧
      setInterval( function () {
         var X = PlayerSelf.element.getBoundingClientRect().left+document.documentElement.scrollLeft; 
         var Y = PlayerSelf.element.getBoundingClientRect().top+document.documentElement.scrollTop;
         player_0.setSize( PlayerSelf.size)
         player_0.setPosx(X)
         player_0.setPosy(Y)
         dataframe.setPlayer(player_0)
         clientmsg.setClientdataframe(dataframe)

         var S = clientmsg.serializeBinary()//序列化
         ws.send(S) // 发送
      },100);  
   };



   //接受指令
   ws.onmessage = function (evt) { 

      var reader = new FileReader(); 

      reader.readAsArrayBuffer(evt.data);//读取数

      reader.onload = function (e) {

         servermsg = proto.Msg.ServerMessage.deserializeBinary( reader.result ) //反序列化

         switch  (servermsg.getOrder()) {//查看指令
            case proto.Msg.ServerOrder.SERVERORDER_MAP_INIT:{//如果是初始化指令
               var Map = servermsg.getMap();
               FOODS_NUM = Map.getFoodsNum();//总量
               
               //console.log(FOODS_NUM)
               var food = Map.getFoodList();

              //生成食物
               for(i=0; i<FOODS_NUM; i++){
                  makeFood(food[i].array[0], food[i].array[1], food[i].array[2],  food[i].array[3], food[i].array[4]);
               }   
               console.log("地图生成成功"); 
            }// end case SERVERORDER_MAP_INIT

            case proto.Msg.ServerOrder.SERVERORDER_MAP_UPDATE:{//如果是更新地图指令
               var update = servermsg.getUpdate();
               if (update != null){
                  var id = update.getFoodId();
                  //document.getElementById(id)

                  //删除小球
                  for(index=0; index<FOODS_NUM; index++){
                     if(foods[index] && foods[index].id == id){
                        //console.log("foodid"+foods[index].id+ "id"+ id)
                        foods[index].disappear();
                        foods.splice(index,1); 
                        break;
                     }                    
                  }

                  var food = update.getFood();
                  makeFood(id, food.array[1], food.array[2],  food.array[3], food.array[4]);
                  //console.log("地图更新成功");
               }// end  if (update != null)
            }// end  case SERVERORDER_MAP_UPDATE:

            case proto.Msg.ServerOrder.SERVERORDER_PLAYER_SET:{//如果是设置玩家信息指令
               var playerset = servermsg.getPlayerset();//获取设置消息
               if (playerset != null){
                  var player = playerset.getPlayer();//获取玩家信息
                  //console.log(PlayerSelf.element.getBoundingClientRect().left+document.documentElement.scrollLeft)
                  if(ISINIT){
                     Change_Ball_Pos(player.getPosx(), player.getPosy())
                     ISINIT = false
                  }
                  Change_Ball_Size(player.getSize())
                  //console.log(PlayerSelf.element.getBoundingClientRect().left+document.documentElement.scrollLeft)
                  //console.log("玩家初始化成功");
               }// end   if (playerset != null){
            }// end  case SERVERORDER_PLAYER_SET

            case proto.Msg.ServerOrder.SERVERORDER_ENEMY_UPDATE:{//如果是更新敌人信息
               var msg = servermsg.getEnemysmsg();//获取消息
               if (msg != null){
                  cleanEnemy()
                  ENEMY_NUM = msg.getEnemyNum() //获取敌人数量
                  var enemys = msg.getEnemyList()
                  for(index=0;index<ENEMY_NUM;index++){
                     makeEnemy(enemys[index].array[0], enemys[index].array[1],enemys[index].array[2],enemys[index].array[3],enemys[index].array[4])
                     //console.log(enemys[index].array[0]+" "+ enemys[index].array[1]+" "+ enemys[index].array[2]+" "+ enemys[index].array[3]+" "+ enemys[index].array[4])
                  }
                     console.log("敌人更新成功")
               }// end  if (msg != null){
            }// end  case SERVERORDER_ENEMY_UPDATE
            
            case proto.Msg.ServerOrder.SERVERORDER_CREATP_SPORE:{//如果是更新孢子
               var msg = servermsg.getCreatespore()
               if (msg != null){
                  var id =  msg.getSporeid()
                  var s_x = msg.getStartPosx()
                  var s_y = msg.getStartPosy()
                  var e_x =  msg.getEndPosx()
                  var e_y =  msg.getEndPosy()
                  shootspore(id, s_x, s_y, e_x, e_y);
                  console.log("shoot spore")
               }// end  if (msg != null){
            }// end  case SERVERORDER_ENEMY_UPDATE

            case proto.Msg.ServerOrder.SERVERORDER_CLEAR_SPORE:{//如果是更新孢子
               var msg = servermsg.getClearspore()
               
               if (msg != null){
                  var id = msg.getSporeid()
                  for(index=0; index<FOODS_NUM; index++){
                     if(foods[index] && foods[index].id == id){
                        //console.log("foodid"+foods[index].id+ "id"+ id)
                        foods[index].disappear();
                        foods.splice(index,1); 
                        break;
                     }                    
                  }
                  console.log("clear spore")
               }// end  if (msg != null){
            }// end  case SERVERORDER_ENEMY_UPDATE

         } //end switch
      }// end reader.onload = function (e)
   };

   ws.onclose = function(){//断开连接
      alert("close WebSocket!");
   };

}
else{
   alert("no WebSocket!");
}
