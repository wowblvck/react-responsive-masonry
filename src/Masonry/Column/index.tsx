import styles from './style.module.css'

export interface ColumnProps extends React.PropsWithChildren {
	columnTag: keyof JSX.IntrinsicElements
	style?: React.CSSProperties
	gutter: string
}

export const Column: React.FC<ColumnProps> = ({children, columnTag, style, gutter}) => {
	const Component = columnTag as keyof JSX.IntrinsicElements
	return (
		<Component
			className={styles.column}
			style={{
				gap: gutter,
				...style,
			}}
		>
			{children}
		</Component>
	)
}
