package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"sync"
	"time"

	Msg "proto"

	"github.com/golang/protobuf/proto"
	"golang.org/x/net/websocket"
)

var rand1 = rand.New(rand.NewSource(time.Now().UnixNano()))

//TMap 地图
var TMap = &Msg.MapInit{} //定义地图结构体
var num = 100             //定义总个数

// mapInit 初始化地图
func mapInit() {
	TMap.FOODS_NUM = *proto.Int(num) //初始化总数为100
	for i := 0; i < num; i++ {
		TFood := &Msg.Food{}
		TFood.Id = *proto.Int(i)
		TFood.PosX = rand1.Float32()
		TFood.PosY = rand1.Float32()
		TFood.Bg = rand1.Float32()
		TFood.Size = rand1.Float32()
		TMap.Food = append(TMap.Food, TFood)
	}
	fmt.Println("地图生成成功")
}

// SendMapInitOrder 发送初始化地图指令
func SendMapInitOrder(ws *websocket.Conn) {
	//设置指令
	servermsg := &Msg.ServerMessage{}                      //服务器指令
	servermsg.Order = Msg.ServerOrder_SERVERORDER_MAP_INIT //设置为初始化地图指令
	servermsg.Map = TMap

	//序列化
	pData, err := proto.Marshal(servermsg)
	if err != nil {
		fmt.Println("序列化错误")
		return
	}

	//发送数据
	if err2 := websocket.Message.Send(ws, pData); err2 != nil {
		fmt.Println("websocket.Message.Send(ws, pData)")
		return
	}

	fmt.Println("MapInit")
}

// SendMapUpdateOrder 发送更新地图食物指令
func SendMapUpdateOrder(ws *websocket.Conn, id int32) {

	//更新食物信息
	TMap.Food[id].PosX = rand1.Float32()
	TMap.Food[id].PosY = rand1.Float32()
	TMap.Food[id].Bg = rand1.Float32()
	TMap.Food[id].Size = rand1.Float32()

	update := &Msg.Update{}
	update.FoodId = *proto.Int32(id)
	update.Food = TMap.Food[id]
	fmt.Println("1")
	//设置指令
	servermsg := &Msg.ServerMessage{}                        //服务器指令
	servermsg.Order = Msg.ServerOrder_SERVERORDER_MAP_UPDATE //设置为更新地图指令
	servermsg.Update = update

	fmt.Println("2")
	//序列化
	pData, err := proto.Marshal(servermsg)
	if err != nil {
		fmt.Println("序列化错误")
		return
	}

	fmt.Println("3")
	//发送数据
	if err := websocket.Message.Send(ws, pData); err != nil {
		fmt.Println("websocket.Message.Send(ws, pData)")
		return
	}

	fmt.Println("MapUpData")
}

// ReadClientMessage 读取客户端消息
func ReadClientMessage(ws *websocket.Conn, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		//读取数据
		var pdata []byte
		if err := websocket.Message.Receive(ws, &pdata); err != nil {
			fmt.Println("websocket.Message.Receive(ws, &clientMsg)")
			return
		}

		fmt.Println("收到客户端消息")

		//解码
		clientMsg := &Msg.ClientMessage{}
		if err := proto.Unmarshal(pdata, clientMsg); err != nil {
			fmt.Println(" proto.Unmarshal(pdata, clientMsg) ")
			return
		}

		switch clientMsg.Order { //查看指令

		case Msg.ClientOrder_CLIENTORDER_FOOD_EAT: //如果是吃食物指令
			{
				overfood := clientMsg.GetFood() //获取消失的食物
				overid := overfood.GetId()      //获取id
				fmt.Println(clientMsg)
				fmt.Println(overid, "号食物消失")

				SendMapUpdateOrder(ws, overid)
			}

		} // end switch clientMsg.Order
	} // end for {
}

func serverHandler(ws *websocket.Conn) {
	fmt.Println("已经连接")

	// SendMapInitOrder 发送初始化地图指令
	SendMapInitOrder(ws)

	//读取读取客户端消息
	var wg sync.WaitGroup //实现同步
	wg.Add(1)
	go ReadClientMessage(ws, &wg)
	wg.Wait()

	/*
		//读数据
		var reply []byte
		err3 := websocket.Message.Receive(ws, &reply)
		if err3 != nil {
			fmt.Println("websocket.Message.Receive(ws, msg)")
			return
		}
		fmt.Printf("-----------------------------------------[%s]\n", reply)

		//解码
		stReceive := &Msg.Pos{}
		errp := proto.Unmarshal(reply, stReceive)
		if errp != nil {
			fmt.Println("*************proto.Unmarshal(msg, stReceive)")
			return
		}
		fmt.Printf("Receive: %f\n", stReceive.PosX)
	*/
}

func main() {

	http.Handle("/", websocket.Handler(serverHandler))

	fmt.Println("服务器启动")

	mapInit() //初始化地图

	err := http.ListenAndServe(":6789", nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}

}
