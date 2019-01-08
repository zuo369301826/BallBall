var ws

// websocket连接服务器
if ("WebSocket" in window){

   // web socket
   ws = new WebSocket("ws://127.0.0.1:6789/");

   
   ws.onopen = function(){//连接成功
      //alert("ok WebSocket!");
   };

   //接受指令
   ws.onmessage = function (evt) { 
      
      var reader = new FileReader(); 
      
      reader.readAsArrayBuffer(evt.data);//读取数据
      
      reader.onload = function (e) {

         servermsg = proto.Msg.ServerMessage.deserializeBinary( reader.result ) //反序列化

         switch  (servermsg.getOrder()) {//查看指令
            case proto.Msg.ServerOrder.SERVERORDER_MAP_INIT:{//如果是初始化指令
               var Map = servermsg.getMap();
               var FOODS_NUM = Map.getFoodsNum();//设置总量
               console.log(Map.getFoodsNum());
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
                  var food = update.getFood();
                  makeFood(id, food.array[1], food.array[2],  food.array[3], food.array[4]);
                  console.log("地图更新成功");
               }// end  if (update != null)
            }// end  case SERVERORDER_MAP_UPDATE:
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
