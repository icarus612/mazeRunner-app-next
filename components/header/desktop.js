import React from 'react';
import cx from "classnames"
import local from 'styles/styles.module.scss'
import Link from "next/link"

export default ()=> {
    return (
        <nav className={cx(local.f_row, local.nav_bar, local.justify_end, local.align_center)}>
            <Link href="/randomizer">Quick Builder</Link>
						<div className={local.divider}>|</div>
            <Link href="/build">Build Your Own</Link>
						<div className={local.divider}>|</div>
						<Link href="/info">How It Works</Link>
        </nav>
       
    )
}
