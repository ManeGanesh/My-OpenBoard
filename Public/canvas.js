let canvas= document.querySelector("canvas");
canvas.width=window.innerWidth;
canvas.height = window.innerHeight;
let pencilColor=document.querySelectorAll(".pencil-color");
let pencilWidthEle=document.querySelector(".pencil-width");
let eraserWidthEle=document.querySelector(".eraser-width");
let download= document.querySelector(".Download");
let redo=document.querySelector(".Redo");
let undo=document.querySelector(".Undo");


let penColor = "red";
let eraserColor ="white";
let penwidth = pencilWidthEle.value;
let eraserwidth = eraserWidthEle.value;


let undoRedoTracker=[];
let track=0;


let mouseDown =false;

//API
let tool=canvas.getContext("2d");
tool.strokeStyle=penColor;
tool.lineWidth=eraserwidth; 



// mousedwon -> start new path ,mousemove -> path fill(graphics)

canvas.addEventListener("mousedown",(e) => {

    mouseDown=true;

    // beginPath({

    //     x:e.clientX,
    //     y:e.clientY

    // })


    let data={

        x:e.clientX,
       y:e.clientY

    }
    // send data to server
    socket.emit("beginPath",data);

  
})


canvas.addEventListener("mousemove",(e) =>{
    if(mouseDown)
    {

        let data ={

            x:e.clientX,
            y:e.clientY,
            color:eraserFlag ? eraserColor:penColor,
            width:eraserFlag ? eraserwidth:penwidth


        }

        socket.emit("drawStroke",data);

        

    }
  

})

canvas.addEventListener("mouseup",(e) => {

mouseDown=false;

let url=canvas.toDataURL();
undoRedoTracker.push(url);
track=undoRedoTracker.length-1;



})

undo.addEventListener("click",(e)=>{

if(track>0) track--;
// track action 

let data={

    trackValue:track,
    undoRedoTracker
}


socket.emit("undeoRedoCanvas",data);

//undeoRedoCanvas(trackobj)


})

redo.addEventListener("click",(e)=>{


    if(track<undoRedoTracker.length-1) track++;

    // action

    let data={

        trackValue:track,
        undoRedoTracker
    }

    socket.emit("undeoRedoCanvas",data);

   // undeoRedoCanvas(trackobj)

    
    
})

function undeoRedoCanvas(trackobj)
{
    track=trackobj.trackValue;
    undoRedoTracker=trackobj.undoRedoTracker;

    let url=undoRedoTracker[track];
    let img= new Image(); // new image reference element
    img.src=url;
    img.onload=(e)=>{

    tool.drawImage(img,0,0,canvas.width,canvas.height);

    }




}


function beginPath(event)
{
    tool.beginPath();

    tool.moveTo(event.x,event.y);

}

function drawStroke(event)
{
    tool.strokeStyle=event.color;
    tool.lineWidth=event.width;
    tool.lineTo(event.x,event.y);
    tool.stroke();

}


pencilColor.forEach((colorEle) => {

colorEle.addEventListener("click", (e) =>{

    let color = colorEle.classList[0];
    penColor=color;
    tool.strokeStyle=penColor;



})

})


pencilWidthEle.addEventListener("change",(e)=>{

    penwidth=pencilWidthEle.value;
    tool.lineWidth=penwidth;


})


eraserWidthEle.addEventListener("change",(e)=>{

    eraserwidth=eraserWidthEle.value;
    tool.lineWidth=eraserwidth;


})

eraser.addEventListener("click",(e)=>{

if(eraserFlag)
{
    tool.strokeStyle=eraserColor;
    tool.lineWidth=eraserwidth;
}
else
{
    tool.strokeStyle=penColor;
    tool.lineWidth=penwidth;
}

})

download.addEventListener("click",(e) =>{
let url=canvas.toDataURL();

let a=document.createElement("a");
a.href=url;
a.download="board.jpg";
a.click();

})


socket.on("beginPath",(data) =>{

    //data -> data from server

    beginPath(data);
})

socket.on("drawStroke",(data)=>{

    drawStroke(data);
})

socket.on("undeoRedoCanvas",(data)=>{

    undeoRedoCanvas(data);
})