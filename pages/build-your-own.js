import {useState, useEffect, useRef} from 'react'
import cx from 'classnames'
import local from 'styles/styles.module.scss'
import Maze from "components/maze"
import Runner from "components/runner"



export default ()=> {
  const [currentCompleted, setCurrentCompleted] = useState(false)
  const [currentTile, setCurrentTile] = useState("wall")
  const [start, setStart] = useState(false)
  const [end, setEnd] = useState(false)
  const [scaled, setScaled] = useState(1)
  const [height, setHeight] = useState(30)
  const [width, setWidth] = useState(30)

  const resetMaze = () => {
    return [...new Array(Number(height))].map((_, j)=> {
      return [...new Array(Number(width))].map((_, i)=> (i == 0 || j == 0 || i == width-1 || j == height-1) ? "wall" : "space")
    })
  }

  const [currentMaze, setCurrentMaze] = useState(resetMaze())

  const mazeContainerInner = useRef(null)

  const solveMaze = () => {
    const refactor = currentMaze.map((row)=> {
      return row.map((tile)=> {
        switch(tile) {
          case "start":
            return "s"
          case "end":
            return "e"
          case "wall":
            return "#"
          default: 
            return " "
        }
      }).join("")
    }).join("\n")

    const maze = Maze({layout: refactor})
    const runner = Runner(maze);
    runner.makeNodePaths();
    runner.buildPath();
    
    setCurrentCompleted(runner);
  }

  const updateMazeWidth = (n) => {
    let newMaze = [...currentMaze]
    newMaze.map((x, i)=> x.length > n ? x.splice(x.length-2, 1) : x.splice(x.length-1, 0, (i == 0 || i == height-1) ? "wall" : "space"))
    setWidth(n)
    setCurrentMaze(newMaze)
  }

  const updateMazeHeight = (n) => {
    let newMaze = [...currentMaze]
    newMaze.length > n ? newMaze.splice(newMaze.length-2, 1) : newMaze.splice(newMaze.length-1, 0, [...Array(Number(width))].map((_, i)=> (i == 0 || i == width-1) ? "wall" : "space"))
    setHeight(n)
    setCurrentMaze(newMaze)
  }

  const checkMaxMin = (n) => {
     if (n > 200) return 200
     if (n < 0) return 0
     return n
  }

  const toggleTileType = (x, y) => {
    if (x == length || y == height) return 

    let newMaze = [...currentMaze]
    if (currentTile == "start") {
      if (start) newMaze[start[0]][start[1]] = "space"
      setStart([x, y])
    }

    if (currentTile == "end") {
      if (end) newMaze[end[0]][end[1]] = "space"
      setEnd([x, y])
    }

    newMaze[x][y] = currentTile
    setCurrentMaze(newMaze)
  }

  useEffect(()=> {
    [...document.querySelectorAll(`.${local.path}`)].map((e)=> e.classList.add(local.visible))
    
    const ele = mazeContainerInner.current;
    ele.style.cursor = 'grab';

    let pos = { top: 0, left: 0, x: 0, y: 0 };
  
    const mouseDownHandler = function(e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';
  
        pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };
  
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
  
    const mouseMoveHandler = function(e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;
  
        // Scroll the element
        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
    };
  
    const mouseUpHandler = function() {
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');
  
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
  
    // Attach the handler
    ele.addEventListener('mousedown', mouseDownHandler);
  })

  const completedMaze = currentCompleted.completed ? currentCompleted.mappedMaze.map((row)=> {
    return (
      <div className={cx(local.f_row)}>
        {row.map((el, i)=> {
          return <div key={i} className={cx(
            local.maze_tile, 
            {[local.start]: el == "s"},
            {[local.end]: el == "e"},
            {[local.wall]: el == "#"},
            {[local.open]: el == " "},
            {[local.path]: el == currentCompleted.pathChar},
          )} />
        })}
      </div>
    )
  }) : (
    <div className={cx(local.h100_percent, local.w100_percent, local.f_row, local.justify_center, local.align_center, local.text_center)}>
      <h4>Maze is not Solvable</h4>
    </div>
  )
  return (
    <div className={cx(local.container, local.maze_runner, local.f_col, local.justify_end, local.align_center)}>
      <div className={cx(local.zoom_container, local.f_col, local.justify_center, local.align_center)}>
        <button 
          onClick={()=> setScaled(scaled < 2 ? scaled + .1 : 2)}
          className={local.zoom_btn}
        >+</button>
        <button 
          onClick={()=> setScaled(scaled >= .2 ? scaled - .1 : .1)}
          className={local.zoom_btn}
        >-</button>
      </div>
      <div 
        className={cx(local.maze_container, local.f_row, local.justify_center, local.align_center)}
        ref={mazeContainerInner}
      >
      <div className={cx(local.maze_container_middle, local.f_col, local.justify_center, local.align_center)}>
        <div 
          className={cx(local.maze_container_inner)} 
          style={{
            transform: `scale(${scaled})`,
            padding: `${20/scaled}px`,
          }}
        >
          {currentMaze && currentMaze.map((row, j)=> {
            return (
              <div className={cx(local.f_row)}>
                {row.map((el, i)=> {
                  return <div 
                    key={i} 
                    className={cx(
                      local.maze_tile, 
                      {[local.start]: el == "start"},
                      {[local.end]: el == "end"},
                      {[local.wall]: el == "wall"},
                      {[local.open]: el == "space"},
                    )} 
                    onClick={()=> toggleTileType(j, i)}
                  />
                })}
              </div>
            )
          })}

          {currentCompleted && (
            <div 
              className={local.solved}
              style={{top: `${20/scaled}px`}}
            >
              {completedMaze}
            </div>
          )}
        </div>
        </div>
        </div>
      <div className={cx(local.f_row, local.f_wrap, local.justify_center, local.align_center, local.settings_container)}>
        <div className={local.number_container}>
          <label>Height:</label>
          <input 
            type="number" 
            value={height} 
            className={local.number_input}
            onChange={(e)=> {
              setCurrentCompleted(false)
              updateMazeHeight(checkMaxMin(e.target.value))
            }} 
          />
        </div>
        <div className={local.number_container}>
          <label>Width:</label>
          <input 
            type="number" 
            value={width}
            className={local.number_input}
            onChange={(e)=> {
              setCurrentCompleted(false)
              updateMazeWidth(checkMaxMin(e.target.value))
            }} 
          />
        </div>
        <div className={cx(local.w100_percent, local.f_row, local.f_wrap, local.align_end, local.justify_center)}>
          <span>Current Maze Tile Type</span>
          <select 
            name="type" 
            onChange={(e)=> {
              setCurrentTile(e.target.value)
            }}
          >
            <option selected value="wall">Wall</option>
            <option value="space">Space</option>
            <option value="start">Start Point</option>
            <option value="end">End Point</option>
          </select>  
        </div>
        <div className={cx(local.f_row, local.justify_around, local.align_center)}>
          <button 
            onClick={()=> (start && end) ? solveMaze() : alert("Maze must have start and end values")}
            className={local.maze_btn}
          >Solve</button>
          <button 
            onClick={()=> {
              setCurrentCompleted(false)
              setCurrentMaze(resetMaze())
            }}
            className={local.maze_btn}
          >Reset</button>       
          {currentCompleted && <button 
            onClick={()=> setCurrentCompleted(false)}
            className={local.maze_btn}
          >Keep Editing</button>}
        </div>
      </div>
      
    </div>
  )
}


