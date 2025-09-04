import React, {
	Children,
	cloneElement,
	createElement,
	FC,
	isValidElement,
	ReactElement,
	ReactNode,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState,
} from 'react'

const DEFAULT_COLUMNS_COUNT = 1

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const useHasMounted = () => {
	const [hasMounted, setHasMounted] = useState(false)
	useIsomorphicLayoutEffect(() => {
		setHasMounted(true)
	}, [])
	return hasMounted
}

const useWindowWidth = () => {
	const hasMounted = useHasMounted()
	const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

	const handleResize = useCallback(() => {
		if (!hasMounted) return
		setWidth(window.innerWidth)
	}, [hasMounted])

	useIsomorphicLayoutEffect(() => {
		if (hasMounted) {
			window.addEventListener('resize', handleResize)
			handleResize()
			return () => window.removeEventListener('resize', handleResize)
		}
	}, [hasMounted, handleResize])

	return width
}

export interface ResponsiveMasonryProps {
	/**
	 * Children to be rendered in the ResponsiveMasonry component as items.
	 *
	 * @type {React.ReactNode}
	 */
	children: React.ReactNode
	/**
	 * Breakpoints for the number of columns to be rendered in the ResponsiveMasonry component.
	 * Default is { 350: 1, 750: 2, 900: 3 }
	 *
	 * @type {{[breakpoint: number]: number}}
	 */
	columnsCountBreakPoints?: {[breakpoint: number]: number}
	/**
	 * Class name for the ResponsiveMasonry component container.
	 * Default is null.
	 *
	 * @type {string}
	 */
	className?: string
	/**
	 * Style object for the ResponsiveMasonry component container.
	 * Default is null.
	 *
	 * @type {React.CSSProperties}
	 */
	style?: React.CSSProperties
}

export const MasonryResponsive: FC<ResponsiveMasonryProps> = ({
	columnsCountBreakPoints = {
		350: 1,
		750: 2,
		900: 3,
	},
	children,
	className,
	style,
}) => {
	const windowWidth = useWindowWidth()
	const columnsCount = useMemo(() => {
		const breakPoints = Object.keys(columnsCountBreakPoints)
			.map(Number)
			.sort((a, b) => a - b)
		let count = breakPoints.length > 0 ? columnsCountBreakPoints[breakPoints[0]] : DEFAULT_COLUMNS_COUNT

		breakPoints.forEach((breakPoint) => {
			if (breakPoint < windowWidth) {
				count = columnsCountBreakPoints[breakPoint]
			}
		})

		return count
	}, [windowWidth, columnsCountBreakPoints])

	const isChildWithColumnsCount = (child: ReactNode): child is ReactElement =>
		isValidElement(child) && 'columnsCount' in child.props

	return createElement(
		'div',
		{
			className,
			style,
		},
		Children.map(
			children,
			(child, index) =>
				isChildWithColumnsCount(child) &&
				cloneElement<{columnsCount: number}>(child, {
					key: index,
					columnsCount,
				})
		)
	)
}
