package main

import (
	"fmt"
	"math/rand"
	"net/http"

	Msg "proto"

	"github.com/golang/protobuf/proto"
	"golang.org/x/net/websocket"
)

//TMap 地图
var TMap = &Msg.Map{} //定义地图结构体
var num = 100           //定义总个数

func mapInit() {
	TMap.FOODS_NUM = *proto.Int(num) //初始化总数为100
	for i := 0; i < num; i++ {
		TFood := &Msg.Food{}
		TFood.Id = *proto.Int(i)
		TFood.PosX = rand.Float32()
		TFood.PosY = rand.Float32()
		TFood.Bg = rand.Float32()
		TFood.Size = rand.Float32()
		TMap.Food = append(TMap.Food, TFood)
	}
	fmt.Println("地图生成成功")

}

func echoHandler(ws *websocket.Conn) {
	fmt.Println("已经连接")
	for {
		//序列化
		pData, err := proto.Marshal(TMap)
		if err != nil {
			fmt.Println("序列化错误")
			return
		}

		//发送数据
		if err2 := websocket.Message.Send(ws, pData); err2 != nil {
			fmt.Println("websocket.Message.Send(ws, pData)")
			return
		}
		fmt.Println("Init")

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
		MPos := &Msg.Food{}
		var s string
		fmt.Scan(&s)

		pData, err3 := proto.Marshal(MPos)
		if err3 != nil {
			panic(err3)
		}

		fmt.Println("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@33333")

		if err2 := websocket.Message.Send(ws, pData); err2 != nil {
			fmt.Println("websocket.Message.Send(ws, &pData)")
			return
		}
		fmt.Println("Init")

	}
}

func main() {
	http.Handle("/", websocket.Handler(echoHandler))

	fmt.Println("服务器启动")

	mapInit() //初始化地图

	err := http.ListenAndServe(":6789", nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}

}
