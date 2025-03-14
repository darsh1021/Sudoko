import './App.css';
import { useState } from 'react';


function App() {

    const initial =[
        [-1, 5, -1, 9, -1, -1, -1, -1, -1],
        [8, -1, -1, -1, 4, -1, 3, -1, 7],
        [-1, -1, -1, 2, 8, -1, 1, 9, -1],
        [5, 3, 8, 6, -1, 7, 9, 4, -1],
        [-1, 2, -1, 3, -1, 1, -1, -1, -1],
        [1, -1, 9, 8, -1, 4, 6, 2, 3],
        [9, -1, 7, 4, -1, -1, -1, -1, -1],
        [-1, 4, 5, -1, -1, -1, 2, -1, 9],
        [-1, -1, -1, -1, 3, -1, -1, 7, -1]
      ]
   
    const[sudokuArr,setSudokuArr] = useState(getDeepCopy(initial));

    function getDeepCopy(arr)
    {
        return JSON.parse(JSON.stringify(arr));
    }
    function onInputChange(e,row,col)
    {
        var val =parseInt(e.target.value) || -1 ,grid = getDeepCopy(sudokuArr);

        if(val == -1 || val>= 1 && val<= 9)
        {
            grid[row][col] = val ;
        }
        setSudokuArr(grid);
    }
    
    function comapreSudokus(currentSudoku,solvedSudoku)
    {
        let res = {
            isComplete:true,
            isSolvable:true
        }
          for(var i =0;i<9;i++)
          {
             for(var j=0;j<9;j++)
             {
                if(currentSudoku[i][j] != solvedSudoku[i][j])
                {
                    if(currentSudoku[i][j] != -1)
                    {
                        res.isSolvable = false; 
                    }
                    res.isComplete = false;
                }
             }
          }
          return res;
    }
    function checkSudoku()
    {
          let sudoku = getDeepCopy(initial);
          solver(sudoku);
          let compare = comapreSudokus(sudokuArr,sudoku);
          if(compare.isComplete)
          {
            alert("Congratulations! You have solved sudoku !");
          }
          else if(compare.isSolvable)
          {
            alert("Kepp going");
          }
          else
          {
            alert("Sudoku can't be solved.Try again")
          }
    }


    function solvedSudoku()
    {
         let sudoku= getDeepCopy(initial);
         solver(sudoku);
         setSudokuArr(sudoku);
    }

    function checkValid(grid,row,col,num)
    {
        //num should be unique in row ,col, 3*3
        if(checkRow(grid,row,num) && checkCol(grid,col,num) && checkBox(grid,row,col,num))
        {
              return true;
        }
        return false;
    }

    function checkRow(grid,row,num)
    {
         return  grid[row].indexOf(num) === -1;
    }
    function checkCol(grid,col,num)
    {
        return grid.map(row=>row[col]).indexOf(num)===-1;
    }
    function checkBox(grid,row,col,num)
    {
        let boxArr =[],
        rowStart = row-(row%3),
        colStart = col-(col%3);

        for(let i = 0;i<3;i++)
        {
            for(let j = 0;j<3;j++)
            {
                boxArr.push(grid[rowStart+1][colStart+1]);
            }
        }

        return boxArr.indexOf(num) === -1;
    
    }

    function getNext(row,col)
    {
        return  col!==8 ? [row,col+1] : row!=8 ? [row+1,0] :[0,0];
    }

    function solver(grid,row=0,col=0)
    {
        if(grid[row][col] !== -1)
        {   
            let isLast = row>=8 && col>=8;

            if(!isLast)
            {
                let [newRow,newColumn] =getNext(row,col);
                return solver(grid,newRow,newColumn);
            }
         
        }
        for(let num = 1;num<=9;num++)
        {
            if(checkValid(grid,row,col,num))
            {
                   grid[row][col] = num;
                
                let [newRow,newColumn]  =getNext(row,col)

                if(!newRow && !newColumn){
                    return true;
                }
                if(solver(grid,newRow,newColumn))
                {
                    return true;
                }
            }
        }

        grid[row][col] =-1;
        return false;
    }

    function resetSudoku()
    {
         let sudoku = getDeepCopy(initial);
         setSudokuArr(sudoku);
    }
return (
<div className="App">
<div className="App-Header">
<h3>Sudoku Solver</h3>
<table>
    <tbody>
        {
            [0,1,2,3,4,5,6,7,8].map((row,rIndex)=>{
                return <tr key={rIndex} className={(row+1)%3 === 0?'bBorder' : ''}>

                    {[0,1,2,3,4,5,6,7,8].map((col,cIndex)=>{
                          return<td key={rIndex+cIndex} className={(col+1)%3 === 0?'rBorder' : ''}>
                          <input onChange={(e)=>onInputChange(e,row,col)}
                          value ={sudokuArr[row][col]=== -1 ? '' :sudokuArr[row][col]}
                          className="cellInput"
                          disabled={initial[row][col] != -1}/>
                          </td>
                    })}
                   
                </tr>
            })
        }
        
    </tbody>
</table>
<div className="buttonContainer">
<button className="checkButton" onClick={checkSudoku}>Check</button>
<button className="solveButton" onClick={solvedSudoku}>SOLVE</button>
    <button className="resetButton" onClick={resetSudoku}>Reset</button>
</div>
</div>
</div>
);
}

export default App;