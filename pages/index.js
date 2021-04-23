import { useState } from "react";
import cx from "classnames"
import local from 'styles/styles.module.scss'
import Link from "next/link"
export default (props) => {


	return (
    <div className={cx(local.maze_runner, local.f_wrap, local.f_col, local.justify_around, local.align_center)}>
      <div className={cx(local.f_wrap, local.f_row, local.justify_around, local.align_center)}>
        <h1 className={cx(local.w100_percent, local.text_center)}>
          The Maze Runner
        </h1>
        <Link href="/randomizer">
          <div className={cx(local.text_center, local.card, local.f_col)}>
            <h5>
              Quick Build
            </h5>
            <p>
              Click here for a randomized maze build and solve.
            </p>
            <button className={local.maze_btn}>Randomizer</button>
          </div>
        </Link>
        <Link href="/build">
          <div className={cx(local.text_center, local.card, local.f_col)}>
            <h5>
              Build Your Own
            </h5>
            <p>
              Click here to build your own maze and have it solved.
            </p>
            <button className={local.maze_btn}>Build & Solve</button>
          </div>
        </Link>
      </div>
    </div>
	);
};
