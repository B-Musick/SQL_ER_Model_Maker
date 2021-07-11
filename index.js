let fullPage = document.querySelector("body");
let erModelDrawArea = document.getElementById("er-model-area");

// Keeps track of the amount of shape types
let buttonShapeAmounts = {
    "entity":0, 
    "relationship":0
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
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

erModelDrawArea.addEventListener('click',()=>{
    // Loop through entities and select them
    for (let entityNum = 0; entityNum < buttonShapeAmounts['entity']; entityNum++){
        dragElement(document.getElementById("entity-container-"+entityNum));
    }

    for (let relationshipNum = 0; relationshipNum < buttonShapeAmounts['relationship']; relationshipNum++) {
        dragElement(document.getElementById("relationship-container-" + relationshipNum));
    }
})



