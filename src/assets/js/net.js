var ws

var Foodx = []
var Foody = []

// websocket连接服务器
if ("WebSocket" in window){

   // web socket
   ws = new WebSocket("ws://localhost:6789/");
   var msg = proto.msg_t

   ws.onopen = function(){//连接成功

      alert("ok WebSocket!");
   };

   //接受指令
   ws.onmessage = function (evt) { 
      var received_msg = evt.data;


      Foodx.push( parseFloat(evt) )
   };

   ws.onclose = function(){//连接成功
      alert("close WebSocket!");
   };
}
else{
   alert("no WebSocket!");
}