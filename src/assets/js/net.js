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
      reader.readAsArrayBuffer(evt.data);
      reader.onload = function (e) {
         Map = proto.Msg.Map.deserializeBinary( reader.result ) //反序列化

         FOODS_NUM = Map.getFoodsNum()//设置总量
         console.log(Map.getFoodsNum());
  
         food = Map.getFoodList()
         //console.log(food.getPosX());

         /*
         for (var index in food){
            //x = food[index].getPosX()
            //console.log(x);
            console.log(food[index].array[1]);
            console.log(index);
        }
        */

         for(i=0; i<FOODS_NUM; i++){
           makeFood(food[i].array[1], food[i].array[2],  food[i].array[3], food[i].array[4])
           console.log(i);
         }
         console.log(Map);
      }
   };

   ws.onclose = function(){//断开连接
      alert("close WebSocket!");
   };
}
else{
   alert("no WebSocket!");
}



/***********************************************
//发送消息
 * 
 *    var M1 = new proto.Msg.Pos(); //声明结构体
      
      M1.setPosx("12.5")//赋值
      M1.setPosy("12.5")
      console.log(M1.toObject());
      S2 = M1.serializeBinary()//序列化
      console.log(S2);
      ws.send(S2)
      alert(M1)
 * 
 * 
//接受消息
   var received_msg = evt.data;
   alert(received_msg)
   
   var reader = new FileReader();
   reader.readAsArrayBuffer(evt.data);
   reader.onload = function (e) {
      var buffer = reader.result 
      var len = buffer.slice(0, 4);
      buffer = buffer.slice(4);
      s = proto.Msg.Pos.deserializeBinary( buffer ) //反序列化
      var x = s.getPosx();
      var y = s.getPosy();
      console.log(x);
      a = y * 10
      alert(a)
      console.log(s);
   }

 */