let emptyCell = " ";
var grid = [];

////////////////// Display the sudoku grid ///

function reset(){
  var g = document.getElementsByClassName('sudoku')[0];
  g.innerHTML = ""
  grid = []
  generateSudokuGrid();
  cellClick();
}

function displayCell(cell){
  if(cell == 0){
    return emptyCell;
  }
  else return cell;
}

function generateSudokuGrid(){
  console.log("Generate Grid !");

  var g = document.getElementsByClassName('sudoku')[0];
  var table = document.createElement('table');
  var tbody = document.createElement('tbody');

  for(var i = 0; i< 9; i++){

    var row = document.createElement("tr");
    var tmp = [];

    for(var j = 0; j<9;j++){
      let cell = document.createElement("td");
      // Id of the cell
      cell.id = i*9+j;
      // Right border
      if(j%3==2 && j!=8){
        cell.classList.add('right');
      }
      // bottom border
      if(i%3==2 && i!=8){
        cell.classList.add('bottom');
      }

      var cell_text = document.createTextNode(displayCell(0));

      cell.appendChild(cell_text);
      row.appendChild(cell);
      tmp.push(0);
    }

    grid.push(tmp);
    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  g.appendChild(table);
}

// Change the value of a cell by clicking on it.


function changeValue(value, elem){
  let x = Math.floor(elem.id / 9);
  let y = elem.id % 9;
  var poss = findPossibilities(x,y);
  if (value == emptyCell) value = 0; // Transform an empty cell as 0.
  let nextValue = (parseInt(value)+1)%10;
  if(poss.includes(nextValue) || nextValue == 0) {
    grid[x][y] = nextValue;
    if(nextValue == 0) elem.classList.remove("userselect");
    else elem.classList.add("userselect");
    return nextValue;
  }
  else return changeValue(nextValue, elem);
}

function cellClick(){
  for(var i=0; i < 81; i++){
    let cell = document.getElementById(i);
    cell.addEventListener('click', function () {
      let v = cell.innerHTML;
      let id = cell.id;
      cell.innerHTML = displayCell(changeValue(v,this));
    })
  }
}

//////////////// Solver //////////////

function firstEmptyCell(){
  for(var i =0; i<9; i++){
    for(var j=0; j < 9; j++){
      if(grid[i][j] == 0) {
        return [i,j];
      }
    }
  }
  return null;
}

function isFinished(){
  let res = firstEmptyCell();
  //console.log(res);
  return res == null;
}

function findPossibilities(x , y){
  let p = new Set([1,2,3,4,5,6,7,8,9]);
  // lign & column
  for(var j=0; j< 9; j++){
    let elem_lign = grid[x][j];
    let elem_col = grid[j][y];
    if(p.has(elem_lign)) p.delete(elem_lign);
    if(p.has(elem_col)) p.delete(elem_col);
  }
  // Square
  x = Math.floor(x/3)*3;
  y = Math.floor(y/3)*3;
  for(var i=0; i<3; i++){
    for(var j=0; j<3; j++){
      let elem_square = grid[x+i][y+j];
      if(p.has(elem_square)) p.delete(elem_square);
    }
  }
  return Array.from(p);
}

function changeCell(x,y,value){
  v = parseInt(value);
  grid[x][y] = v;
  let id = x*9+y;
  let cell = document.getElementById(id);
  cell.innerHTML = displayCell(v);
}

function solve(){
  if(isFinished()) return true;
  else{
    let ec = firstEmptyCell();
    let x = ec[0]; let y = ec[1];
    let poss = findPossibilities(x,y);
    if(poss.size == 0) return false;
    else {
      for(var i = 0; i < poss.length; i++){
        changeCell(x,y,poss[i]);
        if(solve()) return true;
        changeCell(x,y,0);
      }
    }
  }
}

function main(){
  start = new Date();
  solve();
  end = new Date();
  let time = (end-start)+" ms.";
  console.log(time);
}

//////////////// Setup ///////////////

function setupListeners(){
  generateSudokuGrid();
  cellClick();
}


window.addEventListener('load', setupListeners);
