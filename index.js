
// Importing the required modules
const WebSocketServer = require('ws');

// Creating a new websocket server
const wss = new WebSocketServer.Server({ port: process.env.PORT || 3000})

var Players = [];
var ClientID = 0;

function stateUpdate()
{
    for(let i in Players)
    {
        var PlayerInfo = {
            ID : Players[i].ID,
            x : Players[i].x,
            y : Players[i].y,
            name : Players[i].Name,
            Sprite: Players[i].Sprite,
            ImgSpeed: Players[i].ImgSpeed,
            ImgIndex: Players[i].ImgIndex,
            XScale: Players[i].XScale,
            YScale: Players[i].YScale,

            //You can delete this in case the player doesnt have an tail in game
            ImgSpeedTail: Players[i].ImgSpeedTail,
            ImgIndexTail: Players[i].ImgIndexTail,
            SpriteTail: Players[i].SpriteTail,
            
            EventName : "StateUpdate",
        }

        for(let j in Players)
        {
            Players[j].SocketObject.send(JSON.stringify(PlayerInfo))
        }
    }

    setTimeout(stateUpdate, 16)
}

stateUpdate();

wss.on("connection", ws => {
    ClientID++;

    ws.ClientID = ClientID

	//code that should execute just after the player connects
    console.log("A New Player is connected")

    //when the client sends us a message
    ws.on("message", data => {
        var RealData = JSON.parse(data);
        var EventName = RealData.EventName;

        switch(EventName)
        {
            case "create_player_request":
                var Player = {
                    ID: ClientID,
                    x: 0,
                    y: 0,
                    Sprite: 0,
                    ImgSpeed: 0,
                    ImgIndex: 0,
                    XScale: 0,
                    YScale: 0,

                    //You can delete this in case the player doesnt have an tail in game
                    ImgSpeedTail: 0,
                    ImgIndexTail: 0,
                    SpriteTail: 0,
                    
                    Name: RealData.Name,
                    SocketObject: ws,
                } 

                Players.push(Player);
                console.log(Players);

                ws.send(
                    JSON.stringify({
                        EventName: "CreateYou",
                        ID: ClientID,
                    })
                );
            break;

            case "position_update":
                var ThisClientID = RealData.ID

                for(let i in Players)
                {
                    if (Players[i].ID == ThisClientID)
                    {
                        Players[i].x = RealData.x;
                        Players[i].y = RealData.y;
                        Players[i].Sprite = RealData.Sprite;
                        Players[i].ImgIndex = RealData.ImgIndex;
                        Players[i].ImgSpeed = RealData.ImgSpeed;
                        Players[i].XScale = RealData.XScale;
                        Players[i].YScale = RealData.YScale;

                        //You can delete this in case the player doesnt have an tail in game
                        Players[i].ImgIndexTail = RealData.ImgIndexTail;
                        Players[i].ImgSpeedTail = RealData.ImgSpeedTail;
                        Players[i].SpriteTail = RealData.SpriteTail;
                    }
                }
            break;
        }
    })
    // handling what to do when clients disconnects from server
    ws.on("close", () => { 
        console.log("A Player Has Disconnected");

        var WhoDisconnected = ws.ClientID;

        var StringToSend = {
            ID : WhoDisconnected,
            EventName : "PlayerDisconnected"
        }

        for(let i in Players)
        {
            Players[i].SocketObject.send(
                JSON.stringify(StringToSend)
            )

            if (Players[i].ID == WhoDisconnected)
            {
                Players.splice(i, 1)
            }
        }
    })

    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred");
    }

    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred");
    }
});

console.log("The WebSocket server is running");


