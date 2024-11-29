import {
  Children,
  createElement,
  createRef,
  CSSProperties,
  FC,
  isValidElement,
  ReactNode,
  RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react"

interface MasonryProps {
  /**
   * Children to be rendered in the Index component as items.
   *
   * @type {React.ReactNode}
   */
  children: ReactNode
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
   * @type {string | null}
   */
  className?: string | null
  /**
   * Style object for the Index component container.
   * Default is {}.
   *
   * @type {React.CSSProperties}
   */
  style?: CSSProperties
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
  columnTag?: keyof HTMLElementTagNameMap
  /**
   * Style object for the Index component item.
   * Default is {}.
   *
   * @type {React.CSSProperties}
   */
  columnStyle?: CSSProperties
  itemStyle?: CSSProperties
}

const MasonryFC: FC<MasonryProps> = ({
  children,
  className,
  style,
  columnStyle,
  columnTag = "div",
  itemStyle,
  containerTag = "div",
  gutter = "0px",
  columnsCount = 3,
}) => {
  const [columns, setColumns] = useState<ReactNode[][]>(
    Array.from({length: columnsCount}, () => [])
  )

  const childRefs = useMemo(
    () => Children.toArray(children).map(() => createRef<HTMLDivElement>()),
    [children]
  )

  useEffect(() => {
    const {columns: initialColumns} = getEqualCountColumns(
      children,
      columnsCount
    )
    setColumns(initialColumns)
  }, [children, columnsCount])

  useLayoutEffect(() => {
    if (childRefs.every((ref) => ref.current !== null)) {
      distributeChildren()
    }
  }, [childRefs, children])

  const getEqualCountColumns = (
    children: ReactNode | ReactNode[],
    columnsCount: number
  ): {columns: ReactNode[][]; childRefs: RefObject<HTMLDivElement>[]} => {
    const columns: ReactNode[][] = Array.from({length: columnsCount}, () => [])
    const refs: RefObject<HTMLDivElement>[] = []
    let validIndex = 0

    Children.forEach(children, (child) => {
      if (child && isValidElement(child)) {
        const ref = createRef<HTMLDivElement>()
        refs.push(ref)
        columns[validIndex % columnsCount].push(
          createElement(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "stretch",
                ...itemStyle,
              },
              key: validIndex,
              ref: childRefs[validIndex],
            },
            child
          )
        )
        validIndex++
      }
    })

    return {columns, childRefs: refs}
  }

  const distributeChildren = () => {
    const columnHeights = Array<number>(columnsCount).fill(0)
    const columns = Array.from<number, ReactNode[]>(
      {length: columnsCount},
      () => []
    )
    let validIndex = 0
    Children.forEach(children, (child) => {
      if (child && isValidElement(child) && childRefs) {
        const childHeight =
          childRefs[validIndex].current?.getBoundingClientRect().height || 0
        const minHeightColumnIndex = columnHeights.indexOf(
          Math.min(...columnHeights)
        )
        columnHeights[minHeightColumnIndex] += childHeight
        columns[minHeightColumnIndex].push(child)
        validIndex++
      }
    })
    setColumns(columns)
  }

  const renderColumns = useMemo(() => {
    const columnStyled = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignContent: "stretch",
      flex: 1,
      width: 0,
      gap: gutter,
      ...columnStyle,
    }

    return columns.map((column, i) =>
      createElement(columnTag, {key: i, style: columnStyled}, column)
    )
  }, [columns, columnTag, gutter, columnStyle])

  return createElement(
    containerTag,
    {
      style: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "stretch",
        boxSizing: "border-box",
        width: "100%",
        gap: gutter,
        ...style,
      },
      className,
    },
    renderColumns
  )
}

export default MasonryFC
