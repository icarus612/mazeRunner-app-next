import {useState, useEffect, useRef} from 'react'
import cx from 'classnames'
import styles from 'styles/styles.module.scss'
import Maze from "components/maze"
import Runner from "components/runner"

export default ()=> {
  const [currentMaze, setCurrentMaze] = useState(false)
  const [currentCompleted, setCurrentCompleted] = useState(false)
  const [mazeType, setMazeType] = useState("h")
  const [scaled, setScaled] = useState(1)
  const [height, setHeight] = useState(30)
  const [width, setWidth] = useState(30)
  const mazeContainerInner = useRef(null)

  const newMaze = () => {
    setCurrentMaze(Maze({build: [height, width], buildType: mazeType}))
    setCurrentCompleted(false)
  }
  const solveMaze = () => {
    const runner = Runner(currentMaze);
    runner.makeNodePaths();
    runner.buildPath();
    setCurrentCompleted(runner);
  }

  const resetMazes = () => {
    setCurrentMaze(false)
    setCurrentCompleted(false)
  }

  const checkMaxMin = (n) => {
     if (n > 200) return 200
     if (n < 0) return 0
     return n
  }
  
  useEffect(()=> {
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
      <div className={cx(styles.f_row)}>
        {row.map((el, i)=> {
          return <div key={i} className={cx(
            styles.maze_tile, 
            {[styles.start]: el == currentMaze.startChar},
            {[styles.end]: el == currentMaze.endChar},
            {[styles.wall]: el == currentMaze.wallChar},
            {[styles.open]: el == currentMaze.openChar},
            {[styles.path]: el == currentCompleted.pathChar},
          )} />
        })}
      </div>
    )
  }) : (
    <div className={cx(styles.h100_percent, styles.w100_percent, styles.f_row, styles.justify_center, styles.align_center, styles.text_center)}>
      <h4>Maze is not Solvable</h4>
    </div>
  )
  return (
    <div className={cx(styles.container, styles.maze_runner, styles.f_col, styles.justify_end, styles.align_center)}>
      <div className={cx(styles.zoom_container, styles.f_col, styles.justify_center, styles.align_center)}>
        <button 
          onClick={()=> setScaled(scaled < 2 ? scaled + .1 : 2)}
          className={styles.zoom_btn}
        >+</button>
        <button 
          onClick={()=> setScaled(scaled >= .2 ? scaled - .1 : .1)}
          className={styles.zoom_btn}
        >-</button>
      </div>
      <div 
        className={cx(styles.maze_container, styles.f_row, styles.justify_center, styles.align_center)}
        ref={mazeContainerInner}
      >
      <div className={cx(styles.maze_container_middle, styles.f_col, styles.justify_center, styles.align_center)}>
        <div 
          className={cx(styles.maze_container_inner)} 
          style={{
            transform: `scale(${scaled})`,
            padding: `${20/scaled}px`,
          }}
        >
          {currentMaze ? currentMaze.layout.map((row)=> {
            return (
              <div className={cx(styles.f_row)}>
                {row.map((el, i)=> {
                  return <div key={i} className={cx(
                    styles.maze_tile, 
                    {[styles.start]: el == currentMaze.startChar},
                    {[styles.end]: el == currentMaze.endChar},
                    {[styles.wall]: el == currentMaze.wallChar},
                    {[styles.open]: el == currentMaze.openChar},
                  )} />
                })}
              </div>
            )
          }) : [...new Array(Number(height))].map((_, j)=> {
              return (
                <div className={cx(styles.f_row)}>
                  { [...new Array(Number(width))].map((_, i)=> {
                    return <div key={`${i}${j}`} className={cx(
                      styles.maze_tile, 
                      styles[( i == 0 || j == 0 || i == width-1 || j == height-1) ? "wall" : "space"]
                    )} />
                  })}
                </div>
              )
            }
          )}

          {currentCompleted && (
            <div 
              className={styles.solved}
              style={{
                top: `${20/scaled}px`
              }}
            >
              {completedMaze}
            </div>
          )}
        </div>
        </div>
        </div>
      <div className={cx(styles.f_row, styles.f_wrap, styles.justify_center, styles.align_center, styles.settings_container)}>
        <div className={styles.number_container}>
          <label>Height:</label>
          <input 
            type="number" 
            value={height} 
            className={styles.number_input}
            onChange={(e)=> {
              resetMazes()
              setHeight(checkMaxMin(e.target.value))
            }} 
          />
        </div>
        <div className={styles.number_container}>
          <label>Width:</label>
          <input 
            type="number" 
            value={width}
            className={styles.number_input}
            onChange={(e)=> {
              resetMazes()
              setWidth(checkMaxMin(e.target.value))
            }} 
          />
        </div>
        <div className={cx(styles.w100_percent, styles.f_row, styles.f_wrap, styles.align_end, styles.justify_center)}>
          <span>Endpoint Placement:</span>
          <select 
            name="type" 
            onChange={(e)=> {
              resetMazes()
              setMazeType(e.target.value)
            }}
          >
            <option selected value="h">Start: top | End: bottom</option>
            <option value="v">Start: left | End: right</option>
            <option value="r">Start: random | End: random</option>
          </select>  
        </div>
        <div className={cx(styles.f_row, styles.justify_around, styles.align_center)}>
          <button 
            onClick={()=> newMaze()}
            className={styles.maze_btn}
          >New Maze</button>
          {currentMaze && <button 
            onClick={()=> solveMaze()}
            className={styles.maze_btn}
          >Attempt to Solve</button>}
        </div>
      </div>
      
    </div>
  )
}
