

for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
        let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`)
        cell.addEventListener("blur",(e)=>{
            let address=addressBar.value;
            let [activeCell,cellProp]=getCellAndCellProp(address);
            let enteredData=activeCell.innerText;
            // if(enteredData === cellProp.value) return;

            cellProp.value=enteredData
            // console.log(activeCell)
            // console.log(cellProp.value)
            // alert(cellProp.value)
            // if data modifies remove p-c relation. formula empty, update children with new
            removeChildFromParent(cellProp.formula)
            cellProp.formula="";
            updateChildrenCells(address);
        })
    }
}
let formulaBar=document.querySelector(".formula-bar")
function addChildToParent(formula){
    let encodedFormula=formula.split(" ");
    let childAddress=addressBar.value
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65&&asciiValue<=90){
            let [parentcell,parentcellProp]=getCellAndCellProp(encodedFormula[i]);
            parentcellProp.children.push(childAddress)
        }
    }
}

formulaBar.addEventListener("keydown",async (e)=>{
    let inputFormula=formulaBar.value
    if(e.key==="Enter" && formulaBar.value){
       
        //if change in formula, break old p-c relation,evaluate new formula, add new p-c relation
        let address=addressBar.value;
        let[cell,cellProp]=getCellAndCellProp(address);
        if(inputFormula!==cellProp.formula) removeChildFromParent(cellProp.formula)
        addChildToGraphComponent(inputFormula,address)
        //check formula is cyclic or not
        let cycleResponse=isGraphCyclic(graphComponentMatrix)
        console.log(cycleResponse)
        if(cycleResponse){ 
            // alert("Your formula is cyclic")
            let response=confirm("Your formula is cyclic. Do you want to trace your path?")
            while(response === true){
                //keep on tracking color until user is satisfied
                await isGraphCyclicTracePath(graphComponentMatrix,cycleResponse) // i want to complete full iteration of color tracking
                response=confirm("Your formula is cyclic. Do you want to trace your path?")
            }
            removeChildFromGraphComponent(inputFormula,address);
            return ;
        }
        let evaluatedValue=evaluateFormula(inputFormula);
        
        
        setCellUIAndCellProp(evaluatedValue,inputFormula,address)
        addChildToParent(inputFormula)
        updateChildrenCells(address)
    }
})
function addChildToGraphComponent(formula,childAddress){
   let [crid,ccid]= decodeRIDCIDFromAddress(childAddress)
   let encodedFormula=formula.split(" ");
   for(let i=0;i<encodedFormula.length;i++){
    let asciiValue=encodedFormula[i].charCodeAt(0);
    if(asciiValue>=65&&asciiValue<=90){
        let [prid,pcid]=decodeRIDCIDFromAddress(encodedFormula[i])
        graphComponentMatrix[prid][pcid].push([crid,ccid])
    }
   }
}
function removeChildFromGraphComponent(formula,childAddress){
    let [crid,ccid]= decodeRIDCIDFromAddress(childAddress)
   let encodedFormula=formula.split(" ");
   for(let i=0;i<encodedFormula.length;i++){
    let asciiValue=encodedFormula[i].charCodeAt(0);
    if(asciiValue>=65&&asciiValue<=90){
        let [prid,pcid]=decodeRIDCIDFromAddress(encodedFormula[i])
        graphComponentMatrix[prid][pcid].push([crid,ccid])
    }
   }
}
function removeChildFromParent(formula){
    let encodedFormula=formula.split(" ");
    let childAddress=addressBar.value
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65&&asciiValue<=90){
            let [parentcell,parentcellProp]=getCellAndCellProp(encodedFormula[i]);
            let idx=parentcellProp.children.indexOf(childAddress);
            parentcellProp.children.splice(idx,1);
        }
    }
}
function updateChildrenCells(parentAddress){
    let [parentcell,parentcellProp]=getCellAndCellProp(parentAddress);
    let children=parentcellProp.children;
    for(let i=0;i<children.length;i++){
         let childAddress=children[i];
         let [childCell,childCellProp]=getCellAndCellProp(childAddress);
         let childFormula=childCellProp.formula;
        let evaluatedValue= evaluateFormula(childFormula)
        setCellUIAndCellProp(evaluatedValue,childFormula,childAddress)
        updateChildrenCells(childAddress)
    }
}
function evaluateFormula(formula){
  
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65&&asciiValue<=90){
            let [cell,cellProp]=getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i]=cellProp.value
        }
    }
    let decodedFormula=encodedFormula.join(" ");
   
    return eval(decodedFormula)
}

function setCellUIAndCellProp(evaluatedValue,formula,address){
   
    let [cell,cellProp]=getCellAndCellProp(address);
    //ui update
    cell.innerText=evaluatedValue;
    cellProp.value=evaluatedValue;
    cellProp.formula=formula
}