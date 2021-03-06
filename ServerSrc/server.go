package main

import (
	"fmt"
	"log"
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
	INITSIZE = 50
)

//随机数种子
var rand1 = rand.New(rand.NewSource(time.Now().UnixNano()))

// Hub 集线器
type Hub struct {
	num int32
	WSs map[int32]*websocket.Conn
}

//集线器对象
var hub Hub

// Init 初始化
func (hub *Hub) Init() {
	hub.num = 0
	hub.WSs = make(map[int32]*websocket.Conn)
}

// Add 添加端口
func (hub *Hub) Add(ws *websocket.Conn, wsid int32) {
	hub.WSs[wsid] = ws
	hub.num++
	log.Println("连接器: ", hub)
}

//Delete 端口 根据id(key)删除
func (hub *Hub) Delete(wsid int32) {
	delete(hub.WSs, wsid)
	hub.num--
	log.Println("连接器: ", hub)
}

// RandbyRand 随机数生成器
func RandbyRand() float32 {
	var f1 = rand1.Float32() * 23
	var f2 = rand1.Float32() * 71
	var f3 = f1 * f2
	for f3 > 1 {
		f3 /= 10
	}
	return f3
}

//TMap 地图
var TMap = &Msg.MapInit{} //定义地图结构体
var num int32 = 500       //定义食物总个数
var pid int32 = 10000     //袍子id

// Room 房间信息
var Room = &Msg.Room{} //定义房间结构体
var playernum int32    //定义玩家总个数
var playerID int32     //定义玩家id

// mapInit 初始化地图
func mapInit() {
	TMap.FOODS_NUM = *proto.Int32(num) //初始化总数为100
	var i int32
	for ; i < num; i++ {
		TFood := &Msg.Food{}
		TFood.Id = *proto.Int32(i)
		TFood.PosX = rand1.Float32()
		TFood.PosY = rand1.Float32()
		TFood.Bg = rand1.Float32()
		TFood.Size = rand1.Float32()
		TMap.Food = append(TMap.Food, TFood)
	}
	log.Println("地图生成成功")
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
		log.Fatalln("序列化错误: ", err)
	}

	//发送数据
	if err2 := websocket.Message.Send(ws, pData); err2 != nil {
		log.Fatalln("websocket.Message.Send(ws, pData): ", err)
	}
	fmt.Println("MapInit")
}

// SendMapUpdateOrderBySpore 发送更新地图食物指令
func SendMapUpdateOrderBySpore(foodid int32) {

	clearspore := &Msg.ClearSpore{} //服务器指令
	clearspore.Sporeid = foodid
	//设置指令
	servermsg := &Msg.ServerMessage{}                         //服务器指令
	servermsg.Order = Msg.ServerOrder_SERVERORDER_CLEAR_SPORE //设置为更新孢子
	servermsg.Clearspore = clearspore

	//序列化
	pData, err := proto.Marshal(servermsg)
	if err != nil {
		log.Fatalln("序列化错误: ", err)
		return
	}

	//给所有的客户端发送数据
	for index := range hub.WSs {
		if err := websocket.Message.Send(hub.WSs[index], pData); err != nil {
			log.Println("hub: ", hub)
			log.Println("hub: ", hub)
			log.Fatalln("SendMapUpdateOrder websocket.Message.Send(ws, pData): ", err)
		}
	}
	log.Println("所有玩家孢子已更新")
}

// SendMapUpdateOrder 发送更新地图食物指令
func SendMapUpdateOrder(foodid int32) {

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
		log.Fatalln("序列化错误: ", err)
		return
	}

	//给所有的客户端发送数据
	for index := range hub.WSs {
		if err := websocket.Message.Send(hub.WSs[index], pData); err != nil {
			log.Println("hub: ", hub)
			log.Println("hub: ", hub)
			log.Fatalln("SendMapUpdateOrder websocket.Message.Send(ws, pData): ", err)
		}
	}
	log.Println("所有玩家地图已更新")
}

// SendPlayerUpdateOrderBySpore 发送更新玩家信息的指令吃食物
func SendPlayerUpdateOrderBySpore(ws *websocket.Conn, foodid int32, playerID int32) {
	var eatfoodsize float32 = 10
	var index int32
	for ; index < playernum; index++ {
		if Room.Players[index].PlayerId == playerID {
			Room.Players[index].Size += eatfoodsize                  //改变大小
			playerset := &Msg.PlayerSet{}                            //准备玩家设置协议
			playerset.Player = Room.Players[index]                   //添加玩家信息
			servermsg := &Msg.ServerMessage{}                        //准备服务器消息协议
			servermsg.Order = Msg.ServerOrder_SERVERORDER_PLAYER_SET //设置服务器命令
			servermsg.Playerset = playerset                          //设置内容

			//序列化
			pData, err := proto.Marshal(servermsg)
			if err != nil {
				log.Fatalln("序列化错误", err)
			}

			//发送数据
			if err := websocket.Message.Send(ws, pData); err != nil {
				log.Fatalln("SendPlayerUpdateOrderByFood websocket.Message.Send(ws, pData):", err)
				return
			}
			break
		}
	}
}

// SendPlayerUpdateOrderByFood 发送更新玩家信息的指令吃食物
func SendPlayerUpdateOrderByFood(ws *websocket.Conn, foodid int32, playerID int32) {
	eatfoodsize := TMap.Food[foodid].Size
	var index int32
	for ; index < playernum; index++ {
		if Room.Players[index].PlayerId == playerID {
			Room.Players[index].Size += eatfoodsize                  //改变大小
			playerset := &Msg.PlayerSet{}                            //准备玩家设置协议
			playerset.Player = Room.Players[index]                   //添加玩家信息
			servermsg := &Msg.ServerMessage{}                        //准备服务器消息协议
			servermsg.Order = Msg.ServerOrder_SERVERORDER_PLAYER_SET //设置服务器命令
			servermsg.Playerset = playerset                          //设置内容

			//序列化
			pData, err := proto.Marshal(servermsg)
			if err != nil {
				log.Fatalln("序列化错误", err)
			}

			//发送数据
			if err := websocket.Message.Send(ws, pData); err != nil {
				log.Fatalln("SendPlayerUpdateOrderByFood websocket.Message.Send(ws, pData):", err)
				return
			}
			break
		}
	}
}

// SendPlayerUpdateOrderByEnemy 发送更新玩家信息的指令吃敌人
func SendPlayerUpdateOrderByEnemy(ws *websocket.Conn, overid int32, playerID int32) {
	var eatenmeysize float32
	var index int32
	for ; index < playernum; index++ {
		if Room.Players[index].PlayerId == overid {
			eatenmeysize = Room.Players[index].GetSize() / 2
		}
	}
	for index = 0; index < playernum; index++ {
		if Room.Players[index].PlayerId == playerID {
			Room.Players[index].Size += eatenmeysize                 //改变大小
			playerset := &Msg.PlayerSet{}                            //准备玩家设置协议
			playerset.Player = Room.Players[index]                   //添加玩家信息
			servermsg := &Msg.ServerMessage{}                        //准备服务器消息协议
			servermsg.Order = Msg.ServerOrder_SERVERORDER_PLAYER_SET //设置服务器命令
			servermsg.Playerset = playerset                          //设置内容

			//序列化
			pData, err := proto.Marshal(servermsg)
			if err != nil {
				log.Fatalln("序列化错误", err)
			}

			//发送数据
			if err := websocket.Message.Send(ws, pData); err != nil {
				log.Fatalln("SendPlayerUpdateOrderByFood websocket.Message.Send(ws, pData):", err)
				return
			}
			break
		}
	}
}

// SendPlayerDie 处理死亡玩家
func SendPlayerDie(overid int32) {
	servermsg := &Msg.ServerMessage{}                      //准备服务器消息协议
	servermsg.Order = Msg.ServerOrder_SERVERORDER_GAMEOVER //设置服务器命令

	//序列化
	pData, err := proto.Marshal(servermsg)
	if err != nil {
		log.Fatalln("序列化错误", err)
	}

	//发送数据
	if err := websocket.Message.Send(hub.WSs[overid], pData); err != nil {
		log.Println(hub.WSs[overid], overid)
		log.Fatalln("SendPlayerUpdateOrderByFood websocket.Message.Send(ws, pData):", err)
		return
	}

	hub.WSs[overid].Close()
}

// SendEnemyDataOrder 发送更新敌人指令
func SendEnemyDataOrder(playerID int32) {
	enemyupdata := &Msg.EnemyUpdata{}     //准备enemyupdata协议
	enemyupdata.ENEMY_NUM = playernum - 1 //设置敌人总数
	var index int32
	for ; index < playernum; index++ {
		if Room.Players[index].GetPlayerId() != playerID {
			enemyupdata.Enemy = append(enemyupdata.Enemy, Room.Players[index])
		}
	}

	servermsg := &Msg.ServerMessage{}                          //准备ServerMessage协议
	servermsg.Order = Msg.ServerOrder_SERVERORDER_ENEMY_UPDATE //设置指令
	servermsg.Enemysmsg = enemyupdata

	//序列化
	pData, err := proto.Marshal(servermsg)
	if err != nil {
		log.Fatalln("序列化错误", err)
	}

	//发送
	if _, ok := hub.WSs[playerID]; ok {
		if err := websocket.Message.Send(hub.WSs[playerID], pData); err != nil {
			log.Fatalln("err := websocket.Message.Send(ws, pData)", err)
		}
		log.Println(playerID, "敌人更新成功")
	}

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
			log.Fatalln("proto.Unmarshal(pdata, clientMsg)", err)
			return
		}

		log.Println(clientMsg)

		switch clientMsg.Order { //查看指令

		case Msg.ClientOrder_CLIENTORDER_FOOD_EAT: //如果是吃食物指令
			{
				Msg := clientMsg.GetEatfoodmsg() //获取吃食物消息
				overfood := Msg.GetFood()        //获取消失的食物
				overid := overfood.GetId()       //获取id
				if overid < 10000 {
					log.Println("[", clientMsg, "]", overid, "号食物消失")
					SendPlayerUpdateOrderByFood(ws, overid, playerID) //发送玩家信息更新指令
					SendMapUpdateOrder(overid)                        //发送地图更新指令给所有客户端
				} else {
					log.Println("[", clientMsg, "]", overid, "号孢子消失")
					SendPlayerUpdateOrderBySpore(ws, overid, playerID) //发送玩家信息更新指令
					SendMapUpdateOrderBySpore(overid)
				}
			}

		case Msg.ClientOrder_CLIENTORDER_ENEMY_EAT: //如果是吃敌人指令
			{
				Msg := clientMsg.GetEatenemymsg() //获取吃敌人消息
				overenemy := Msg.GetPlayer()      //获取消失的食物
				overid := overenemy.GetPlayerId() //获取id
				log.Println("[", clientMsg, "]", overid, "号敌人死亡")
				if _, ok := hub.WSs[overid]; ok {
					SendPlayerUpdateOrderByEnemy(ws, overid, playerID) //发送玩家信息更新指令
					SendPlayerDie(overid)                              //给死亡玩家发送死亡指令，并删除该玩家
				}
			}

		case Msg.ClientOrder_CLIENTORDER_DATA_FRAME: //客户端数据包
			{
				msg := clientMsg.GetClientdataframe()
				player := msg.GetPlayer() //获取到玩家信息
				var index int32
				for ; index < playernum; index++ {
					if Room.Players[index].PlayerId == playerID {
						Room.Players[index].Size = player.GetSize()
						Room.Players[index].PosX = player.GetPosX()
						Room.Players[index].PosY = player.GetPosY()
						log.Println(Room.Players[index].PosX, Room.Players[index].PosY, playerID, "号玩家数据帧")
						SendEnemyDataOrder(playerID) //发送更新敌人指令
					}
				}
			}

		case Msg.ClientOrder_CLIENTORDER_SHOOT_SPORE: // 如果是发射袍子指令
			{
				msg := clientMsg.GetShootspore()
				pid++

				createspore := &Msg.CreateSpore{}
				createspore.Sporeid = pid
				createspore.StartPosx = msg.GetStartPosx()
				createspore.StartPosy = msg.GetStartPosy()
				createspore.EndPosx = msg.GetEndPosx()
				createspore.EndPosy = msg.GetEndPosy()

				servermsg := &Msg.ServerMessage{}
				servermsg.Order = Msg.ServerOrder_SERVERORDER_CREATP_SPORE
				servermsg.Createspore = createspore

				pData, _ := proto.Marshal(servermsg)

				//给所有的客户端发送数据
				for index := range hub.WSs {
					//if index != playerID {
					if err := websocket.Message.Send(hub.WSs[index], pData); err != nil {
						log.Println("hub: ", hub)
						log.Println("hub: ", hub)
						log.Fatalln("SendMapUpdateOrder websocket.Message.Send(ws, pData): ", err)
					}
					//}
				}
				log.Println("所有玩家孢子已更新")
			}
		} // end switch clientMsg.Order
	} // end for {
}

// 删除玩家
func playerDelate(id int32) {
	var index int32
	for ; index < playernum; index++ {
		if Room.Players[index].GetPlayerId() == id {
			Room.PLAYER_NUM--
			Room.Players = append(Room.Players[:index], Room.Players[index+1:]...)
			break
		}
	}
	playernum--
	log.Println(id, "号玩家退出房间")
	log.Println("Room: [", Room, "]")
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
	Room.PLAYER_NUM = playernum
	Room.Players = append(Room.Players, player)
	log.Println(playerID, "玩家加入房间")

	//发送消息
	playerset := &Msg.PlayerSet{} //准备设置玩家信息消息
	playerset.Player = player
	servermsg := &Msg.ServerMessage{} //服务器消息
	servermsg.Order = Msg.ServerOrder_SERVERORDER_PLAYER_SET
	servermsg.Playerset = playerset

	//数据序列化
	pData, err := proto.Marshal(servermsg)
	if err != nil {
		log.Fatalln("序列化错误", err)
	}

	//发送数据
	if err := websocket.Message.Send(ws, pData); err != nil {
		log.Fatalln("websocket.Message.Send(ws, pData)", err)
	}

	log.Println(playerID, "玩家初始化完成")
}

// serverHandler 服务器任务
func serverHandler(ws *websocket.Conn) {

	// SendMapInitOrder 发送初始化地图指令
	SendMapInitOrder(ws)

	//设置玩家初始信息
	SendPlayerInitMsg(ws)

	//删除该玩家
	defer playerDelate(playerID)

	//设置集线器
	hub.Add(ws, playerID)
	defer hub.Delete(playerID)

	//读取读取客户端消息
	var wg sync.WaitGroup //实现同步
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go ReadClientMessage(ws, &wg, i, playerID)
	}
	wg.Wait()
}

func main() {

	//设置日志
	log.SetFlags(log.LstdFlags | log.Lshortfile | log.Lmicroseconds)

	http.Handle("/", websocket.Handler(serverHandler))

	//初始化集线器
	hub.Init()

	log.Println("服务器启动")

	mapInit() //初始化地图

	err := http.ListenAndServe(":6789", nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}
