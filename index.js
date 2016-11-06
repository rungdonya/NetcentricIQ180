var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

playerName=[]; c=0;
var client = {user: "", score:0, start:0};
var num=[5], sum, number ="", quest = "", temp;


app.use(express.static(__dirname + '/'));

app.get('/',function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var roomno=0;
var rooms=[];
var scores = 0;
io.sockets.on('connection',function (socket) {
    var clientIpAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
    console.log(' new request from : '+clientIpAddress);
    //Try with other computer
    //console.log(socket.handshake.address);
    //socket.connect(3000,'192.168.1.44');   why mai dai

    socket.on('send username',function (data, callback) {   //receive user name -> check duplicate
        console.log(data + " is connecting");
        if(playerName.indexOf(data)!=-1) {
            callback(false);
        }else{
            callback(true);
            socket.name = data;  //push name[]
            playerName.push(socket.name);

            socket.emit('welcomeuser',"Welcome "+data);
            io.sockets.emit('listOfUser',playerName);  //update
            socket.broadcast.emit('broadcast',socket.name +' has joined the chat');
            io.sockets.emit('broadcast', 'there are '+playerName.length+' users online');
            console.log('# of users online : '+playerName.length);
            client.user = socket.name; //keep name of client in server
        }

    });

    // socket.broadcast.emit('broadcast',playerName +' has joined the chat');

    socket.on('send msg',function (data) {
        console.log(socket.name + " : "+ data);
        io.sockets.emit('new msg',{msg:data, nick: socket.name});
    });
    send();
    clients = [];
    var count =0;

    socket.on('pair',function () {
        //emit message when player are ready!
        socket.broadcast.emit('broadcast',socket.name +' is READY!');

        //clients.push(client);
        console.log("Room "+roomno);
        temp = roomno;
        if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) {
            roomno++;
        }
        if(roomno!=temp){
            send();
        }
        socket.join("room-"+roomno);
        console.log('number of user in the room = '+io.nsps['/'].adapter.rooms["room-"+roomno].length);
        console.log(socket.name+" in room "+roomno);

        // Random who start first, after
        // check if the user is the first user
        if(io.nsps['/'].adapter.rooms["room-" + roomno].length == 1) {
            scores =0;
            rooms[roomno]= {
                first: {},
                second: {}
            };
            // socket.room=roomno;
            rooms[roomno].first["id"] = socket.id;
            rooms[roomno].first["name"] = socket.name;
            rooms[roomno].first["score"] = scores;

            //   rooms[roomno].first["room"] = socket.room;
            // end random code
            // this is for second player joining
        } else if (io.nsps['/'].adapter.rooms["room-" + roomno].length == 2) {
            scores =0;
            rooms[roomno].second["id"] = socket.id;
            rooms[roomno].second["name"] = socket.name;
            rooms[roomno].second["score"] = scores;
            //  rooms[roomno].second["room"] = socket.room;


            strt = Math.floor(Math.random()*10)+1;
            console.log('Random Number to find starter :'+strt);
            starterid = '';anotherid ='';

            if(strt<=5){

                //first that enters the room plays first
                console.log(rooms[roomno].first.name + ' plays first');
                io.to(rooms[roomno].first.id).emit('connectToRoom', {
                    descriptions: '1st player',num : num, sum: sum, playturn :true,turn :0,
                    room: roomno, username :rooms[roomno].first["name"], opponent: rooms[roomno].second["name"],
                    rooms: rooms[roomno],yourScore: rooms[roomno].first["score"], opponentScore: rooms[roomno].second["score"]
                });

                //emit waiting page to 2nd player
                io.to(rooms[roomno].second.id).emit('connectToRoom', {
                    descriptions: '2nd player',num : num , sum: sum, playturn : false,turn :0,
                    room: roomno, username :rooms[roomno].second["name"], opponent: rooms[roomno].first["name"],
                    rooms: rooms[roomno],yourScore: rooms[roomno].second["score"], opponentScore: rooms[roomno].first["score"]
                });


            }else{

                //second players that enter the room plays first
                console.log(rooms[roomno].second.name + ' plays first');

                io.to(rooms[roomno].second.id).emit('connectToRoom', {
                    descriptions: '1st player',num : num, sum: sum, playturn : true,turn: 0,
                    room: roomno, username :rooms[roomno].second["name"], opponent: rooms[roomno].first["name"],
                    rooms: rooms[roomno],yourScore: rooms[roomno].second["score"], opponentScore: rooms[roomno].first["score"]
                });

                //emit waiting page to first player
                io.to(rooms[roomno].first.id).emit('connectToRoom', {
                    descriptions: '2nd player',num : num , sum: sum, playturn : false,turn:0,
                    room: roomno, username :rooms[roomno].first["name"], opponent: rooms[roomno].second["name"],
                    rooms: rooms[roomno],yourScore: rooms[roomno].first["score"], opponentScore: rooms[roomno].second["score"]
                });
            }
            console.log(rooms[roomno]);


            socket.on('continue',function (data) {
             send();
             // rooms[data.room].first["name"] = data.winner;
             // rooms[data.room].second["name"] = data.loser;
             // rooms[data.room].first["score"] = data.firstScore;
             // rooms[data.room].second["score"] = data.secondScore;

            if(data.winner === rooms[data.room].first['name']){

                rooms[data.room].first['score'] = data.winningScore;
                rooms[data.room].second['score'] = data.losingScore;

                io.to(rooms[data.room].first.id).emit('connectToRoom', {
                    descriptions: '1st player',num : num, sum: sum, playturn : true, turn :0, rooms: data.rooms,
                    room: data.room, username :rooms[data.room].first["name"], opponent: rooms[data.room].second["name"],
                    yourScore: rooms[data.room].first["score"] , opponentScore: rooms[data.room].second["score"]
                });

                io.to(rooms[data.room].second.id).emit('connectToRoom', {
                    descriptions: '2nd player',num : num , sum: sum, playturn : false,turn:0, rooms: data.rooms,
                    room: data.room, username :rooms[data.room].second["name"], opponent: rooms[data.room].first["name"],
                    yourScore: rooms[data.room].second["score"], opponentScore: rooms[data.room].first["score"]
                });
            }else if(data.winner == rooms[data.room].second['name']){
                rooms[data.room].second['score'] = data.winningScore;
                rooms[data.room].first['score'] = data.losingScore;

                io.to(rooms[data.room].second.id).emit('connectToRoom', {
                    descriptions: '1st player',num : num, sum: sum, playturn : true, turn :0,rooms: data.rooms,
                    room: data.room, username :rooms[data.room].second["name"], opponent: rooms[data.room].first["name"],
                    yourScore: rooms[data.room].second["score"] , opponentScore: rooms[data.room].first["score"]
                });

                io.to(rooms[data.room].first.id).emit('connectToRoom', {
                    descriptions: '2nd player',num : num , sum: sum, playturn : false,turn:0,rooms: data.rooms,
                    room: data.room, username :rooms[data.room].first["name"], opponent: rooms[data.room].second["name"],
                    yourScore: rooms[data.room].first["score"], opponentScore: rooms[data.room].second["score"]
                });
            }

            });

            console.log('======================END=======================');
        }

        socket.on('timesup',function(data){
            console.log(''+data.timesup);
            if(data.timesup){
                socket.emit('changePlayer',{timesup:data.timesup});
            }
        });

        socket.on('showit', function(data) {

            console.log("player "+socket.id);

            //if player==1 --> kon tee 1 just played   //keep score+time
            if (socket.id == rooms[data.room].first.id) {

                //emit to second player ==> second play that enters the room
                io.to(rooms[data.room].second.id).emit('play', {
                    descriptions: '2nd player', num: data.num, sum: data.sum, playturn: true,
                    firstTime: data.firstTime, turn: 1, room: data.room, rooms: rooms[roomno],
                    username :rooms[roomno].second["name"], opponent: rooms[roomno].first["name"],
                    firstCorrect : data.firstCorrect, secondCorrect : data.secondCorrect,
                    yourScore: rooms[data.room].second["score"], opponentScore: rooms[data.room].first["score"]
                });

                //emit to first player (waiting room) ==>  first player that enters the room
                io.to(rooms[data.room].first.id).emit('play', {
                    descriptions: '1st player', num: data.num, sum: data.sum, playturn: false,
                    firstTime: data.firstTime, turn: 1, room: data.room, rooms: rooms[roomno],
                    username :rooms[roomno].second["name"], opponent: rooms[roomno].first["name"],
                    firstCorrect : data.firstCorrect, secondCorrect : data.secondCorrect,
                    yourScore: rooms[data.room].first["score"], opponentScore: rooms[data.room].second["score"]
                });

                console.log(rooms[data.room]);
                console.log('2nd player turn');

                //first player is rooms.first
            } else if (socket.id == rooms[data.room].second.id){

                io.to(rooms[data.room].first.id).emit('play', {
                    descriptions: '2nd player', num: data.num, sum: data.sum, playturn: true,
                    firstTime: data.firstTime, turn: 1, room: data.room, rooms: rooms[roomno],
                    username :rooms[roomno].first["name"], opponent: rooms[roomno].second["name"],
                    firstCorrect : data.firstCorrect, secondCorrect : data.secondCorrect,
                    yourScore: rooms[data.room].second["score"], opponentScore: rooms[data.room].first["score"]
                });

                io.to(rooms[data.room].second.id).emit('play', {
                    descriptions: '1st player', num: data.num, sum: data.sum, playturn: false,
                    firstTime: data.firstTime, turn: 1, room: data.room, rooms: rooms[roomno],
                    username :rooms[roomno].second["name"], opponent: rooms[roomno].first["name"],
                    firstCorrect : data.firstCorrect, secondCorrect : data.secondCorrect,
                    yourScore: rooms[data.room].first["score"], opponentScore:rooms[data.room].second["score"]
                });
                console.log('2nd player turn');
            }
            //else socket.emit(conclusion)  --->keb data tunglai player1Name, player1Score,player2Name, player2Score
        });

        console.log('############## END JOIN ##############');

        //   socket.leave("room-"+roomno);
    });



   
    socket.on('isclick',function(){
        console.log('clicked');
    });

    //After 2 players had played --> emitted diff page
    socket.on('done', function(data){
        var winner,loser,winningScore,losingScore;

        console.log('done'+ data.firstCorrect+'...'+data.secondCorrect);
        //firstCorrect,firstTIme = player 1's data, second,firsTime = player's 2 data

        //second player is the first one that enters the room
        //firstCorrect = rooms[data.room].second.score

        if(socket.id == data.rooms.first.id) {
            console.log('both correct??');
            if (data.firstCorrect == data.secondCorrect) {

                if (data.firstCorrect == 1) {

                    if (data.firstTime <= data.secondTime) {
                        scores  = rooms[data.room].second['score'];
                        scores ++;
                        rooms[data.room].second['score']= scores;

                        winner = rooms[data.room].second["name"];
                        winningScore = rooms[data.room].second["score"];

                        loser = rooms[data.room].first["name"];
                        losingScore = rooms[data.room].first["score"];

                        console.log('1' + winningScore + losingScore);

                    } else if (data.firstTime > data.secondTime) {
                        scores = rooms[data.room].first.score +1;
                        rooms[data.room].first["score"] = scores;

                        winner = rooms[data.room].first["name"];
                        winningScore = rooms[data.room].first["score"];

                        loser = rooms[data.room].second["name"];
                        losingScore = rooms[data.room].second["score"];
                        console.log('2' + winningScore + losingScore);
                    }
                } else if (data.firstCorrect != 1) {
                    console.log("both fail to answer");
                    loser = rooms[data.room].first["name"] + "and" + rooms[data.room].second["name"];
                    losingScore = rooms[data.room].second["score"];

                    winner = "there is no winner";
                    winningScore = rooms[data.room].first["score"];

                    console.log('3' + winningScore + losingScore);
                }
            } else if (data.firstCorrect != data.secondCorrect) {
                console.log('one correct??');
                //firstCorrect = first player ==>rooms[roomno].second
                if (data.firstCorrect == 1) {

                    scores = rooms[data.room].first.score +1;
                    rooms[data.room].first["score"] = scores;

                    winner = rooms[data.room].second["name"];
                    winningScore = rooms[data.room].second["score"];

                    loser = rooms[data.room].first["name"];
                    losingScore = rooms[data.room].first["score"];
                    console.log('4' + winningScore + losingScore);

                } else if (data.secondCorrect == 1) {
                    scores = rooms[data.room].second.score +1;
                    rooms[data.room].second["score"] = scores;


                    winner = rooms[data.room].first["name"];
                    winningScore = rooms[data.room].first["score"];

                    loser = rooms[data.room].second["name"];
                    losingScore = rooms[data.room].second["score"];
                    console.log('5' + winningScore + losingScore);
                }
            }

         //second player is the second player that enters the room
        }else if(socket.id == data.rooms.second.id){

            if (data.firstCorrect == data.secondCorrect) {

                if (data.firstCorrect == 1) {

                    if (data.firstTime <= data.secondTime) {

                        rooms[data.room].first["score"] += 1;
                        winner = rooms[data.room].first["name"];
                        winningScore = rooms[data.room].first["score"];

                        loser = rooms[data.room].second["name"];
                        losingScore = rooms[data.room].second["score"];

                        console.log('1' + winningScore + losingScore);

                    } else if (data.firstTime > data.secondTime) {

                        rooms[data.room].second["score"] += 1;

                        winner = rooms[data.room].second["name"];
                        winningScore = rooms[data.room].second["score"];

                        loser = rooms[data.room].first["name"];
                        losingScore = rooms[data.room].first["score"];
                        console.log('2' + winningScore + losingScore);
                    }
                } else if (data.firstCorrect != 1) {
                    console.log("both fail to answer");
                    loser = rooms[data.room].first["name"] + "and" + rooms[data.room].first["name"];
                    losingScore = rooms[data.room].first["score"];

                    winner = "there is no winner";
                    winningScore = rooms[data.room].second["score"];

                    console.log('3' + winningScore + losingScore);
                }
            } else if (data.firstCorrect != data.secondCorrect) {
                //firstCorrect = first player ==>rooms[roomno].second
                if (data.firstCorrect == 1) {
                    rooms[data.room].first["score"] += 1;
                    winner = rooms[data.room].first["name"];
                    winningScore = rooms[data.room].first["score"];

                    loser = rooms[data.room].second["name"];
                    losingScore = rooms[data.room].second["score"];
                    console.log('4' + winningScore + losingScore);

                } else if (data.secondCorrect == 1) {
                    rooms[data.room].first["score"] += 1;

                    winner = rooms[data.room].second["name"];
                    winningScore = rooms[data.room].second["score"];

                    loser = rooms[data.room].first["name"];
                    losingScore = rooms[data.room].first["score"];
                    console.log('5' + winningScore + losingScore);
                }
            }
        }
        console.log(rooms[data.room]);

        //ต้องแก้ตัวแปรที่เก็บคนเล่นกับคนที่เข้าห้องใหม่นิดนึง
        //firstName = first person that enters the room, secondName = second person that enters the room
        io.to(rooms[data.room].first.id).emit('conclusion', {
            room: roomno, firstName: rooms[roomno].first["name"], secondName: rooms[roomno].second["name"],
            firstScore: rooms[roomno].first["score"], secondScore: rooms[roomno].second["score"], winner: winner, loser: loser,
            winningScore: winningScore, losingScore: losingScore, rooms : data.rooms,
            firstid:rooms[data.room].first.id,secondid:rooms[data.room].second.id
        });

        io.to(rooms[data.room].second.id).emit('conclusion', {
            room: roomno, firstName: rooms[roomno].first["name"], secondName: rooms[roomno].second["name"],
            firstScore: rooms[roomno].first["score"], secondScore: rooms[roomno].second["score"], winner: winner, loser: loser,
            winningScore: winningScore, losingScore: losingScore,rooms : data.rooms,
            firstid:rooms[data.room].first.id,secondid:rooms[data.room].second.id
        });
    });

    socket.on('reset',function(data){
        io.to(data.firstid).emit('back',{room:null});
        io.to(data.secondid).emit('back',{room:null});
        rooms[data.room] = null;
        console.log(rooms[data.room]);
        io.sockets.emit('broadcast','THE GAME HAD ENDED!!');
    });


    socket.on('disconnect',function (data) {  //cut name out
        // when disconnect
        if(!socket.name) return;
        io.sockets.emit('broadcast',socket.name +' has left the chat');
        playerName.splice(playerName.indexOf(socket.name),1);
        io.sockets.emit('listOfUser',playerName);
        io.sockets.emit('broadcast', 'there are '+playerName.length+' online');
        console.log('# of users online : '+playerName.length);
    });
});

server.listen(3000, function () {
    console.log('Server listening at port : 3000');
});

function send(){
    for(i=0;i<5;i++){
        num[i] = Math.floor((Math.random() * 9)+1);
        number += " "+num[i];
        if(i==0){
            sum = num[i];
            quest = ""+num[i];
        }else {
            var op = Math.floor((Math.random() * 4) + 1);
            if (op == 1) {
                sum += num[i];
                quest += "+ " + num[i];
            } else if (op == 2) {
                sum -= num[i];
                quest += "-" + num[i];
            } else if (op == 3) {
                sum *= num[i];
                quest += "*" + num[i];
            } else {
                temp = sum;
                sum /= num[i];
                if(sum%num[i]==0) {
                    quest += "/" + num[i];
                }else{
                    sum =temp;
                    i--;
                }
            }
        }

    }
    if(sum>=100||sum<=0){
        send();
    }
}