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

io.sockets.on('connection',function (socket) {

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
    var player1score;

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
            rooms[roomno]= {
                first: {},
                second: {}
            };
            // socket.room=roomno;
            rooms[roomno].first["id"] = socket.id;
            rooms[roomno].first["name"] = socket.name;

            //   rooms[roomno].first["room"] = socket.room;
            // end random code
            // this is for second player joining
        } else if (io.nsps['/'].adapter.rooms["room-" + roomno].length == 2) {

            rooms[roomno].second["id"] = socket.id;
            rooms[roomno].second["name"] = socket.name;
            //  rooms[roomno].second["room"] = socket.room;


            strt = Math.floor(Math.random()*10)+1;
            console.log('Random Number to find starter :'+strt);

            if(strt<=5){
                console.log(rooms[roomno].first.name + ' plays first');

            }else{
                console.log(rooms[roomno].second.name + ' plays second');
            }
            console.log(rooms[roomno]);
            //Send this event to everyone in the room.
            //If there 2 ppl clicked button , emit sum

            // if (io.nsps['/'].adapter.rooms["room-" + roomno].length == 2) {
            //numnull = ['x','x','x','x','x','x'];


            io.to(rooms[roomno].first.id).emit('connectToRoom', {
                descriptions: '1st player',num : num, sum: sum, playturn : true,
                room: roomno, firstplayer :rooms[roomno].first["name"], secondplayer: rooms[roomno].second["name"]
            });

            console.log(roomno);

            io.to(rooms[roomno].second.id).emit('connectToRoom', {
                descriptions: '2nd player',num : num , sum: sum, playturn : false,
                room: roomno, firstplayer :rooms[roomno].first["name"], secondplayer: rooms[roomno].second["name"]
            });


            /*socket.on('continue',function (data) {
             send();
             rooms[roomno].first.name = socket.data.winner;  //roomno pung nae nae
             io.to(rooms[roomno].first.name).emit('connectToRoom', {
             descriptions: '1st player',num : num, sum: sum, playturn : true
             });
             rooms[roomno].second.name = socket.data.looser;
             io.to(rooms[roomno].second.id).emit('connectToRoom', {
             descriptions: '2nd player',num : numnull , sum: 'x', playturn : false
             });
             });  */

            console.log('======================END=======================');
        }

        socket.on('showit', function(data) {

            console.log("player "+socket.id);

            //if player==1 --> kon tee 1 just played   //keep score+time
            if (socket.id === rooms[data.room].first.id) {
                io.to(rooms[data.room].second.id).emit('play', {
                    descriptions: '2nd player', num: data.num, sum: data.sum, playturn: true
                });
                console.log(rooms[data.room]);
                console.log('2nd player turn');
            } else {
                io.to(rooms[data.room].first.id).emit('play', {
                    descriptions: '2nd player', num: data.num, sum: data.sum, playturn: true
                });
                console.log(rooms[data.room]);
                console.log('2nd player turn');
            }
            //else socket.emit(conclusion)  --->keb data tunglai player1Name, player1Score,player2Name, player2Score
        });

        console.log('############## END JOIN ##############');

        //   socket.leave("room-"+roomno);
    });



    socket.on('disconnect',function (data) {  //cut name out when disconnect
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

}