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

const (
	// INITSIZE 玩家初始大小
	INITSIZE = 60
)

var rand1 = rand.New(rand.NewSource(time.Now().UnixNano()))

// RandbyRand 随机数生成器
func RandbyRand() float32 {
	var f1 = rand1.Float32() * 23
	var f2 = rand1.Float32() * 71
	var f3 = f1 * f2
	fmt.Println("f1:", f1, "f2:", f2, "f3:", f3)
	for f3 > 1 {
		f3 /= 10
	}
	fmt.Println("*f3:", f3)
	return f3
}

//TMap 地图
var TMap = &Msg.MapInit{} //定义地图结构体
var num = 100             //定义总个数

// Room 房间信息
var Room = &Msg.Room{} //定义房间结构体
var playernum = 0      //定义玩家总个数
var playerID int32     //定义玩家id

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
func SendMapUpdateOrder(ws *websocket.Conn, foodid int32) {

	//更新食物信息
	TMap.Food[foodid].PosX = rand1.Float32()
	TMap.Food[foodid].PosY = rand1.Float32()
	TMap.Food[foodid].Bg = rand1.Float32()
	TMap.Food[foodid].Size = rand1.Float32()

	update := &Msg.Update{}
	update.FoodId = *proto.Int32(foodid)
	update.Food = TMap.Food[foodid]
	//设置指令
	servermsg := &Msg.ServerMessage{}                        //服务器指令
	servermsg.Order = Msg.ServerOrder_SERVERORDER_MAP_UPDATE //设置为更新地图指令
	servermsg.Update = update

	//序列化
	pData, err := proto.Marshal(servermsg)
	if err != nil {
		fmt.Println("序列化错误")
		return
	}

	//发送数据
	if err := websocket.Message.Send(ws, pData); err != nil {
		fmt.Println("websocket.Message.Send(ws, pData)")
		return
	}

	fmt.Println("MapUpData")
}

// SendPlayerUpdateOrder 发送更新玩家信息的指令
func SendPlayerUpdateOrder(ws *websocket.Conn, foodid int32) {

	//eatfoodsize := TMap.Food[foodid].Size
	//NewPlayer := &Msg.Player{} //玩家信息
	//NewPlayer.Size =

}

// ReadClientMessage 读取客户端消息
func ReadClientMessage(ws *websocket.Conn, wg *sync.WaitGroup, id int, playerID int32) {
	defer wg.Done()
	for {
		//读取数据
		var pdata []byte
		if err := websocket.Message.Receive(ws, &pdata); err != nil {
			return
		}

		fmt.Println("id:", id, "收到客户端", playerID, "消息")

		//解码
		clientMsg := &Msg.ClientMessage{}
		if err := proto.Unmarshal(pdata, clientMsg); err != nil {
			fmt.Println(" proto.Unmarshal(pdata, clientMsg) ")
			return
		}

		switch clientMsg.Order { //查看指令

		case Msg.ClientOrder_CLIENTORDER_FOOD_EAT: //如果是吃食物指令
			{
				Msg := clientMsg.GetEatfoodmsg() //获取吃食物消息
				overfood := Msg.GetFood()        //获取消失的食物
				overid := overfood.GetId()       //获取id
				fmt.Println(clientMsg, overid, "号食物消失")
				SendPlayerUpdateOrder(ws, overid) //发送玩家信息更新指令
				SendMapUpdateOrder(ws, overid)    //发送地图更新指令
			}
		} // end switch clientMsg.Order
	} // end for {
}

// 删除玩家
func playerDelate(id int32) {
	for index := 0; index < playernum; index++ {
		if Room.Players[index].GetPlayerId() == id {
			Room.Players = append(Room.Players[:index], Room.Players[index+1:]...)
		}
	}
	playernum--
	fmt.Println(id, "玩家退出房间")
	fmt.Println("Room", Room)
}

// SendPlayerInitMsg 发送玩家初始信息
func SendPlayerInitMsg(ws *websocket.Conn) {
	//增加玩家
	playernum++
	playerID++
	player := &Msg.Player{}
	player.PlayerId = playerID  //设置玩家id
	player.Size = INITSIZE      //玩家初始大小
	player.PosX = RandbyRand()  //玩家位置
	player.PosY = RandbyRand()  //玩家位置
	player.Bg = rand1.Float32() //设置玩家颜色

	//添加玩家到房间
	Room.Players = append(Room.Players, player)
	fmt.Println(playerID, "玩家加入房间")

	//发送消息
	playerset := &Msg.PlayerSet{} //准备设置玩家信息消息
	playerset.Player = player
	servermsg := &Msg.ServerMessage{} //服务器消息
	servermsg.Order = Msg.ServerOrder_SERVERORDER_PLAYER_SET
	servermsg.Playerset = playerset

	//数据序列化
	pData, err := proto.Marshal(servermsg)
	if err != nil {
		fmt.Println("序列化错误")
		return
	}

	//发送数据
	if err := websocket.Message.Send(ws, pData); err != nil {
		fmt.Println("websocket.Message.Send(ws, pData)")
		return
	}
	fmt.Println(playerID, "玩家初始化完成")
}

func serverHandler(ws *websocket.Conn) {

	// SendMapInitOrder 发送初始化地图指令
	SendMapInitOrder(ws)

	//设置玩家初始信息
	SendPlayerInitMsg(ws)

	//删除该玩家
	defer playerDelate(playerID)

	//读取读取客户端消息
	var wg sync.WaitGroup //实现同步
	for i := 0; i < 5; i++ {
		wg.Add(1)
		go ReadClientMessage(ws, &wg, i, playerID)
	}
	wg.Wait()
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
