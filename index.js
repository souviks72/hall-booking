const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
console.log(port);
app.use(bodyParser.json());

let rooms = [{
        id: 1,
        name: 'Inox',
        amenities: ["AC","Dolby Sound","3-D"],
        numSeats: 60,
        pricePerHour: 40000,
        booked: false
    },{
        id: 2,
        name: 'Avantika',
        amenities: ["AC","3-D"],
        numSeats: 40,
        pricePerHour: 20000,
        booked: false
    }
];

let bookingDetails = {};

app.post('/room',(req,res)=>{
    let {amenities,numSeats,pricePerHour,name} = req.body;
    let newRoom = {name,amenities,numSeats,pricePerHour};
    newRoom = { id: rooms.length+1, ...newRoom,booked: false};
    rooms.push(newRoom);
    res.status(200).json(rooms).send();
})

app.post('/book',(req,res)=>{
    let {name, date, start, end, roomId} = req.body;
    let bookingDetail = {customerName: name,date,start,end};
    bookingDetails[roomId] = bookingDetail;
    let newRooms = rooms.map((room,idx)=>{
        if(idx===roomId-1){
            return {...room, booked: true};
        }
        return room;
    })
    rooms = newRooms;
    res.status(200).json(bookingDetails).send();
});

app.get('/roomDetails',(req,res)=>{
    let roomDetails = rooms.map(room=>{ 
        if(room.booked){
            let x = {...room,...bookingDetails[room.id]};
            
            return x;
        }
        return room;
    });
    res.status(200).json(roomDetails).send();
});

app.get('/customerDetails', (req,res)=>{
    let keys = Object.keys(bookingDetails);
    let customers = keys.map(key=>{
        let bd = bookingDetails[key];
        let room = rooms[key-1];
        return {...bd, roomName: room.name}
    });
    res.status(200).json(customers).send();
});

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});