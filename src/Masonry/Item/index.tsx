import {forwardRef, HTMLAttributes} from 'react'

import styles from './style.module.css'

export interface ItemProps extends HTMLAttributes<HTMLDivElement> {}

export const Item = forwardRef<HTMLDivElement, ItemProps>(({children, ...props}, ref) => {
	return (
		<div ref={ref} className={styles.item} {...props}>
			{children}
		</div>
	)
})
