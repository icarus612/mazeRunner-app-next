import { useState } from "react";
import cx from "classnames"
import local from 'styles/styles.module.scss'

import Header from "components/header/desktop"
import Link from "next/link"

export default (props) => {
	return (
    <div className={cx(local.maze_runner, local.f_wrap, local.f_col, local.justify_around, local.align_center)}>
      <Header />
      <div className={cx(local.container)}>
				<h1>
          The Maze Runner Project
        </h1>
        <p>
					This project was origionaly built in python and used a command line interface. 
					Eventually a flask app GUI was built for it. 
					It has sense been ported over to Javascript and is now a Next/React app.
				</p>
				<p>
					There are 2 versions: the random placement quickbuild version or the build your own. 
					For the randomized quick builder just choose your height, width, and end pont placement and your off! 
					For the build your own, choose the initial height and width, 
					as well as the type of tile you're placing, and build your own maze. 
					Aftwards let the maze runner attempt to solve your maze. 
				</p>
      </div>
    </div>
	);
};
