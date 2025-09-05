import React, {
	Children,
	createRef,
	isValidElement,
	ReactNode,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState,
} from 'react'
import {Column} from './Column'
import {Item} from './Item'
import styles from './style.module.css'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export interface MasonryProps {
	/**
	 * Children to be rendered in the Index component as items.
	 *
	 * @type {React.ReactNode}
	 */
	children: React.ReactNode
	/**
	 * Number of columns to be rendered in the Index component.
	 * Default is 3.
	 *
	 * @type {number}
	 */
	columnsCount?: number
	/**
	 * Gutter size between the columns.
	 * Default is "0".
	 *
	 * @type {string}
	 */
	gutter?: string
	/**
	 * Class name for the Index component container.
	 * Default is null.
	 *
	 * @type {string}
	 */
	className?: string
	/**
	 * Style object for the Index component container.
	 * Default is {}.
	 *
	 * @type {React.CSSProperties}
	 */
	style?: React.CSSProperties
	/**
	 * Tag name for the Index component container.
	 * Default is "div".
	 *
	 * @type {React.ComponentType}
	 */
	containerTag?: keyof HTMLElementTagNameMap
	/**
	 * Tag name for the Index component item.
	 * Default is "div".
	 *
	 * @type {string}
	 */
	columnTag?: keyof JSX.IntrinsicElements
	/**
	 * Style object for the Index component item.
	 * Default is {}.
	 *
	 * @type {React.CSSProperties}
	 */
	columnStyle?: React.CSSProperties
	itemStyle?: React.CSSProperties
}

export const Masonry: React.FC<MasonryProps> = ({
	children,
	className,
	style,
	columnStyle,
	columnTag = 'div',
	itemStyle,
	containerTag = 'div',
	gutter = '0px',
	columnsCount = 3,
}) => {
	const [columns, setColumns] = useState<ReactNode[][]>(Array.from({length: columnsCount}, () => []))

	const childRefs = useMemo(() => Children.toArray(children).map(() => createRef<HTMLDivElement>()), [children])

	const distributeChildren = () => {
		const columnHeights = Array<number>(columnsCount).fill(0)
		const newColumns = Array.from<number, ReactNode[]>({length: columnsCount}, () => [])
		Children.forEach(children, (child, idx) => {
			if (child && isValidElement(child) && childRefs.length > 0) {
				const childHeight = childRefs[idx].current?.getBoundingClientRect().height || 0
				let targetColumnIndex: number
				if (childHeight === 0) {
					targetColumnIndex = idx % columnsCount
				} else {
					targetColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))
					columnHeights[targetColumnIndex] += childHeight
				}

				newColumns[targetColumnIndex].push(
					<Item key={idx} ref={childRefs[idx]} style={itemStyle}>
						{child}
					</Item>
				)
			}
		})
		setColumns(columns)
	}

	useIsomorphicLayoutEffect(() => {
		if (childRefs.every((ref) => ref.current !== null)) {
			distributeChildren()
		}
	}, [childRefs])

	const ContainerTag = containerTag as keyof JSX.IntrinsicElements

	return (
		<ContainerTag
			className={[styles.container, className].filter(Boolean).join(' ')}
			style={{
				gap: gutter,
				...style,
			}}
		>
			{columns.map((child, i) => (
				<Column key={i} columnTag={columnTag} style={columnStyle} gutter={gutter}>
					{child}
				</Column>
			))}
		</ContainerTag>
	)
}
