let fullPage = document.querySelector("body");
let erModelDrawArea = document.getElementById("er-model-area");

// Keeps track of the amount of shape types
let buttonShapeAmounts = {
    "entity":0, 
    "relationship":0, 
    "weak-entity":0, 
    'relationship-constraint':0,
    "line": 0,
    "line-point-one": 0,
    "line-point-two": 0
}

let buttonPress = (buttonID)=>{
    let button = document.getElementById(buttonID+"-button");

    button.addEventListener('click', () => {
        let shapeCount = buttonShapeAmounts[buttonID]; // Get the shape number

        // Create the container for the element
        let shapeContainer = document.createElement('div');
        shapeContainer.classList.add(buttonID+'-container');
        shapeContainer.id = buttonID + '-container-' + shapeCount;

        // Create shape element
        let shape = document.createElement('div');
        shape.classList.add(buttonID+'-shape');
        shape.id = buttonID + "-" + shapeCount; // Set the ID for the shape

        buttonShapeAmounts[buttonID]++; // Increment shape counts

        // Add shape to DOM
        shapeContainer.appendChild(shape);
        erModelDrawArea.appendChild(shapeContainer);

    })
}

buttonPress('entity');
buttonPress('relationship');
buttonPress('weak-entity');
// buttonPress('relationship-constraint');

// Logic obtained from:
// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_draggable
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "-shape")) {
        document.getElementById(elmnt.id + "-shape").onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
        e = e || window.event;
        pos3 = parseInt(e.clientX);
        pos4 = parseInt(e.clientY);
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        return false;
    }

    function elementDrag(e) {
        e = e || window.event;
        pos1 = pos3 - parseInt(e.clientX);
        pos2 = pos4 - parseInt(e.clientY);
        pos3 = parseInt(e.clientX);
        pos4 = parseInt(e.clientY);
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        // Need to redraw the line
        if (elmnt.classList[0] == "line-point-two-container"){
            // Get the id number
            let lineNum = elmnt.id.split('').pop();
            let lineOnePoint = document.getElementById('line-point-one-'+lineNum);
            let line = document.getElementById('line-'+lineNum);
            line.remove();
            connect(lineOnePoint, elmnt, 'black', '2', erModelDrawArea, lineNum);
        } else if (elmnt.classList[0] == "line-point-one-container"){
            // Get the id number
            let lineNum = elmnt.id.split('').pop();
            let lineTwoPoint = document.getElementById('line-point-two-' + lineNum);
            let line = document.getElementById('line-' + lineNum);
            line.remove();
            connect(lineTwoPoint, elmnt, 'black', '2', erModelDrawArea, lineNum);
        };
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

erModelDrawArea.addEventListener('click',()=>{
    // Loop through entities and select them
    selectEntities(buttonShapeAmounts, 'entity');
    selectEntities(buttonShapeAmounts, 'relationship');
    selectEntities(buttonShapeAmounts, "weak-entity");
    selectEntities(buttonShapeAmounts, 'line-point-one');
    selectEntities(buttonShapeAmounts, 'line-point-two');
    selectEntities(buttonShapeAmounts, 'line');

})

/**
 * 
 * @param {*} buttonShapeAmounts 
 * @param {*} id 
 */
let selectEntities = (buttonShapeAmounts, id) =>{
    for (let entityNum = 0; entityNum < buttonShapeAmounts[id]; entityNum++) {
        dragElement(document.getElementById(id+"-container-"+entityNum));
    }
}

// Line attempt
let drawLine = () => {
    buttonID1 = 'line-point-one';
    let shapeCount = buttonShapeAmounts[buttonID1]; // Get the shape number

    // Create the container for the element
    let shapeContainer = document.createElement('div');
    shapeContainer.classList.add(buttonID1 + '-container');
    shapeContainer.id = buttonID1 + '-container-' + shapeCount;

    // Create shape element
    let shape = document.createElement('div');
    shape.classList.add(buttonID1 + '-shape');
    shape.id = buttonID1 + "-" + shapeCount; // Set the ID for the shape

    buttonShapeAmounts[buttonID1]++; // Increment shape counts

    // Add shape to DOM
    shapeContainer.appendChild(shape);
    erModelDrawArea.appendChild(shapeContainer);

    buttonID2 = 'line-point-two';

    let shapeCounts = buttonShapeAmounts['line-point-two']; // Get the shape number

    // Create the container for the element
    let shapeContainers = document.createElement('div');
    shapeContainers.classList.add(buttonID2 + '-container');
    shapeContainers.id = buttonID2 + '-container-' + shapeCounts;

    // Create shape element
    let shapes = document.createElement('div');
    shapes.classList.add(buttonID2 + '-shape');
    shapes.id = buttonID2 + "-" + shapeCounts; // Set the ID for the shape

    buttonShapeAmounts[buttonID2]++; // Increment shape counts

    // Add shape to DOM
    shapeContainers.appendChild(shapes);
    erModelDrawArea.appendChild(shapeContainers);

    // Get the location of the squares centers
    var rect = shapeContainer.getBoundingClientRect();
    console.log(rect.left + ((rect.right-rect.left)/2));

    var rects = shapeContainers.getBoundingClientRect();
    console.log(rects.left + ((rects.right - rects.left) / 2));

    connect(shapeContainer, shapeContainers, 'black', '2', erModelDrawArea, shapeCount);

    


}

let relButtonPress = document.getElementById('relationship-constraint-button');

relButtonPress.addEventListener('click',()=>{
    drawLine();
})

// https://stackoverflow.com/questions/8672369/how-to-draw-a-line-between-two-divs
function getOffset(el) {
    var rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset,
        width: rect.width || el.offsetWidth,
        height: rect.height || el.offsetHeight
    };
}

function connect(div1, div2, color, thickness, appendTo, lineNum) { // draw a line connecting elements
    var off1 = getOffset(div1);
    var off2 = getOffset(div2);
    // bottom right
    var x1 = off1.left + off1.width;
    var y1 = off1.top + off1.height;
    // top right
    var x2 = off2.left + off2.width;
    var y2 = off2.top;
    // distance
    var length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
    // center
    var cx = ((x1 + x2) / 2) - (length / 2);
    var cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    var angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);
  
    let newDiv = document.createElement('div');
    newDiv.setAttribute('id', 'line-'+lineNum);
    newDiv.style.padding = "0px";
    newDiv.style.margin = "0px";
    newDiv.style.height = thickness+"px";
    newDiv.style.backgroundColor = color;
    newDiv.style.lineHeight = "1px";
    newDiv.style.position = "absolute";
    newDiv.style.left = cx+"px";
    newDiv.style.top = cy+"px"; 
    newDiv.style.width = length + "px";
    newDiv.style.MozTransform = 'rotate(' + angle + 'deg)';
    newDiv.style.WebkitTransform = 'rotate(' + angle + 'deg)';
    newDiv.style.OTransform = 'rotate(' + angle + 'deg)';
    newDiv.style.msTransform = 'rotate(' + angle + 'deg)';
    newDiv.style.transform = 'rotate(' + angle + 'deg)';




    // newDiv.setAttribute('-moz-transform','rotate(' + angle + 'deg)');







    appendTo.appendChild(newDiv);


    // document.body.innerHTML += htmlLine;
}

