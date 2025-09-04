import React, {Children, createRef, isValidElement, useCallback, useEffect, useLayoutEffect, useState} from 'react'
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
	const [columns, setColumns] = useState<React.ReactNode[][]>([])
	const [prevChildren, setPrevChildren] = useState<React.ReactNode>(children)
	const [childRefs, setChildRefs] = useState<React.RefObject<HTMLDivElement>[]>([])
	const [hasDistributed, setHasDistributed] = useState(false)
	const [prevColumnsCount, setPrevColumnsCount] = useState(columnsCount)
	const ContainerTag = containerTag as keyof JSX.IntrinsicElements

	useIsomorphicLayoutEffect(() => {
		const hasColumnsChanged = columnsCount !== prevColumnsCount
		if (children === prevChildren && !hasColumnsChanged) return

		const result = getEqualCountColumns(children, columnsCount)
		setColumns(result.columns)
		setChildRefs(result.childRefs)
		setHasDistributed(false)
		setPrevChildren(children)
		setPrevColumnsCount(columnsCount)
	}, [children, columnsCount, prevChildren, prevColumnsCount])

	useIsomorphicLayoutEffect(() => {
		if (!hasDistributed) {
			distributeChildren()
		}
	}, [hasDistributed, columns, childRefs])

	const distributeChildren = useCallback(() => {
		const columnHeights = Array(columnsCount).fill(0)

		const isReady = childRefs.every((ref) => ref.current && ref.current.getBoundingClientRect().height)

		if (!isReady) return

		const newColumns: React.ReactNode[][] = Array.from({length: columnsCount}, () => [])
		let validIndex = 0

		Children.forEach(children, (child) => {
			if (child && isValidElement(child)) {
				const childHeight = childRefs[validIndex].current?.getBoundingClientRect().height || 0
				const minHeightColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))

				columnHeights[minHeightColumnIndex] += childHeight
				newColumns[minHeightColumnIndex].push(child)
				validIndex++
			}
		})

		setColumns(newColumns)
		setHasDistributed(true)
	}, [children, columnsCount, childRefs])

	const getEqualCountColumns = (children: React.ReactNode, columnsCount: number) => {
		const columns: React.ReactNode[][] = Array.from({length: columnsCount}, () => [])
		let validIndex = 0
		const childRefs: React.RefObject<HTMLDivElement>[] = []

		Children.forEach(children, (child) => {
			if (child && isValidElement(child)) {
				const ref = createRef<HTMLDivElement>()
				childRefs.push(ref)

				columns[validIndex % columnsCount].push(
					<Item key={validIndex} ref={ref} style={itemStyle}>
						{child}
					</Item>
				)
				validIndex++
			}
		})

		return {columns, childRefs}
	}

	return (
		<ContainerTag className={[styles.container, className].filter(Boolean).join(' ')} style={style}>
			{columns.map((child, i) => (
				<Column key={i} columnTag={columnTag} style={columnStyle} gutter={gutter}>
					{child}
				</Column>
			))}
		</ContainerTag>
	)
}
