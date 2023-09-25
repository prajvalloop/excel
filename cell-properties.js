//storage
let collectedSheetDB=[]   //contains all sheet db
let sheetDB=[];

{
    let addSheetBtn=document.querySelector(".sheet-add-icon");
    addSheetBtn.click()
    // handleSheetProperties()
}
// for(let i=0;i<rows;i++){
//     let sheetRow=[];
//     for(let j=0;j<cols;j++){
//         let cellProp={
//             bold:false,
//             italic:false,
//             underline:false,
//             alignment:"left",
//             fontFamily:"monospace",
//             fontSize:"14",
//             fontColor:"#000000",
//             BGcolor:"#000000",
//             value:"",
//             formula:"",
//             children:[]
//         }
//         sheetRow.push(cellProp);
//     }
//     sheetDB.push(sheetRow)
// }

//selectors for cell properties

let bold=document.querySelector(".bold")
let italic=document.querySelector(".italic")
let underline=document.querySelector(".underline")
let fontSize=document.querySelector(".font-size-prop");
let fontFamily=document.querySelector(".font-family-prop");
let fontColor=document.querySelector(".font-color-prop");
let BGcolor=document.querySelector(".BGcolor-prop")
let alignment=document.querySelectorAll(".alignment")
let leftAlign=alignment[0];
let ceterAlign=alignment[1];
let rightAlign=alignment[2];
// let addressBar=document.querySelector(".address-bar")

let activeColorProp="#d1d8e0";
let incativeColorProp="#ecf0f1"
//Application of two way binding
//attach property listeners
bold.addEventListener("click",(e)=>{
    let address=addressBar.value
    let [cell,cellProp]=getCellAndCellProp(address)
    //Modification
    cellProp.bold= !cellProp.bold;//data change
    cell.style.fontWeight=cellProp.bold?"bold":"normal"; //ui change
    bold.style.backgroundColor=cellProp.bold?activeColorProp:incativeColorProp
})

italic.addEventListener("click",(e)=>{
    let address=addressBar.value
    let [cell,cellProp]=getCellAndCellProp(address)
    //Modification
    cellProp.italic= !cellProp.italic;//data change
    cell.style.fontStyle=cellProp.italic?"italic":"normal"; //ui change
    italic.style.backgroundColor=cellProp.italic?activeColorProp:incativeColorProp
})

underline.addEventListener("click",(e)=>{
    let address=addressBar.value
    let [cell,cellProp]=getCellAndCellProp(address)
    //Modification
    cellProp.underline= !cellProp.underline;//data change
    cell.style.textDecoration=cellProp.underline?"underline":"none"; //ui change
    underline.style.backgroundColor=cellProp.underline?activeColorProp:incativeColorProp
})

fontSize.addEventListener("change",(e)=>{
    
    let address=addressBar.value
    let [cell,cellProp]=getCellAndCellProp(address)
    cellProp.fontSize=fontSize.value; //data change
    cell.style.fontSize=cellProp.fontSize + "px";
    fontSize.value=cellProp.fontSize

})

fontFamily.addEventListener("change",(e)=>{
    let address=addressBar.value
    let [cell,cellProp]=getCellAndCellProp(address)
    cellProp.fontFamily=fontFamily.value; //data change
    cell.style.fontFamily=cellProp.fontFamily ;
    fontFamily.value=cellProp.fontFamily

})

fontColor.addEventListener("change",(e)=>{
    let address=addressBar.value
    let [cell,cellProp]=getCellAndCellProp(address)
    cellProp.fontColor=fontColor.value; //data change
    cell.style.fontColor=cellProp.fontColor ;
    fontColor.value=cellProp.fontColor
})

BGcolor.addEventListener("change",(e)=>{
    let address=addressBar.value
    let [cell,cellProp]=getCellAndCellProp(address)
    cellProp.BGcolor=BGcolor.value; //data change
    cell.style.backgroundColor=cellProp.BGcolor ;
    BGcolor.value=cellProp.BGcolor
})
alignment.forEach((alignElem)=>{
    alignElem.addEventListener("click",(e)=>{
        let address=addressBar.value
        let [cell,cellProp]=getCellAndCellProp(address)
        let alignValue=e.target.classList[0];
        cellProp.alignment=alignValue; //data change
        cell.style.textAlign=cellProp.alignment
        switch(alignValue){
            case "left":
                leftAlign.style.backgroundColor=activeColorProp;
                ceterAlign.style.backgroundColor=incativeColorProp;
                rightAlign.style.backgroundColor=incativeColorProp;
                break;
            case "right":
                rightAlign.style.backgroundColor=activeColorProp;
                leftAlign.style.backgroundColor=incativeColorProp
                ceterAlign.style.backgroundColor=incativeColorProp
                break;
            case "center":
                rightAlign.style.backgroundColor=incativeColorProp;
                ceterAlign.style.backgroundColor=activeColorProp;
                leftAlign.style.backgroundColor=incativeColorProp;
                break;
        }
    })
})
    let allCells=document.querySelectorAll(".cell");
    for(let i=0;i<allCells.length;i++){
        addListenerToAttachCellProperties(allCells[i]);
    }
    function addListenerToAttachCellProperties(cell){
        //work;
        cell.addEventListener("click",(e)=>{
            let address=addressBar.value
            let [rid,cid]=decodeRIDCIDFromAddress(address)
            let cellProp=sheetDB[rid][cid];
            //apply cell properties
            cell.style.fontWeight=cellProp.bold?"bold":"normal"; //ui change
            cell.style.fontStyle=cellProp.italic?"italic":"normal"; //ui change
            cell.style.textDecoration=cellProp.underline?"underline":"none"; //ui change
            cell.style.fontSize=cellProp.fontSize + "px";
            cell.style.fontFamily=cellProp.fontFamily ;
            cell.style.fontColor=cellProp.fontColor ;
            cell.style.backgroundColor=cellProp.BGcolor==="#000000"?"transparent":cellProp.BGcolor ;
            cell.style.textAlign=cellProp.alignment

            //apply properties to ui props container
            bold.style.backgroundColor=cellProp.bold?activeColorProp:incativeColorProp
            italic.style.backgroundColor=cellProp.italic?activeColorProp:incativeColorProp
            underline.style.backgroundColor=cellProp.underline?activeColorProp:incativeColorProp
            fontColor.value=cellProp.fontColor
            BGcolor.value=cellProp.BGcolor
            fontSize.value=cellProp.fontSize
            fontFamily.value=cellProp.fontFamily
            switch(cellProp.alignment){
                case "left":
                    leftAlign.style.backgroundColor=activeColorProp;
                    ceterAlign.style.backgroundColor=incativeColorProp;
                    rightAlign.style.backgroundColor=incativeColorProp;
                    break;
                case "right":
                    rightAlign.style.backgroundColor=activeColorProp;
                    leftAlign.style.backgroundColor=incativeColorProp
                    ceterAlign.style.backgroundColor=incativeColorProp
                    break;
                case "center":
                    rightAlign.style.backgroundColor=incativeColorProp;
                    ceterAlign.style.backgroundColor=activeColorProp;
                    leftAlign.style.backgroundColor=incativeColorProp;
                    break;
            }
            let formulaBar=document.querySelector(".formula-bar");
            formulaBar.value=cellProp.formula
            cell.innerText=cellProp.value
        })
    }


function getCellAndCellProp(address){
  let [rid,cid]=decodeRIDCIDFromAddress(address);
    //access cell and storage
    let cell=document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`)
    let cellProp=sheetDB[rid][cid];
    return [cell,cellProp];
}

function decodeRIDCIDFromAddress(address){
    //address->"A1";
    let rid=Number(address.slice(1))-1;
    let cid=Number(address.charCodeAt(0))-65;
    return [rid,cid];
}