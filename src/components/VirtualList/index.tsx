import React, { useState, useMemo, useRef } from 'react';
import './index.css';

type PositionsListPorps = virtualListProps.PositionsPorps[];

const VirtualList: React.FC<virtualListProps.VirtualListProps> = (props) => {
  const { data, estimatedItemSize, bufferScale, renderItem } = props;
  // 可显示的列表数量
  const getVisibleCount = (): number => {
    const screenH = document.body.clientHeight;
    return Math.ceil(screenH / estimatedItemSize);
  }
  // 定义父节点 list 的 ref
  const listRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(getVisibleCount());
  // 定义 positions ，用于列表项渲染后存储每一项的高度以及位置信息
  const [positions, setPositions] = useState<PositionsListPorps>([]);
  //二分法查找
  const binarySearch = (list: PositionsListPorps, value: number): number => {
    let start = 0;
    let end = list.length - 1;
    let tempIndex = -1;
    while (start <= end) {
      let midIndex = Math.floor((start + end) / 2);
      let midValue = list[midIndex].bottom;
      if (midValue === value) {
        return midIndex + 1;
      } else if (midValue < value) {
        start = midIndex + 1;
      } else if (midValue > value) {
        if (tempIndex === -1 || tempIndex > midIndex) {
          tempIndex = midIndex;
        }
        end = end - 1;
      }
    }
    return tempIndex;
  }
  //获取列表起始索引
  const getStartIndex = (scrollTop = 0): number => {
    //二分法查找
    return binarySearch(positions, scrollTop);
  }
  const updateItemsSize = () => {
    const childNodes = listRef.current?.childNodes;
    const nPositions: PositionsListPorps = JSON.parse(JSON.stringify(positions));
    childNodes?.forEach((node): void => {
      const rect = (node as Element).getBoundingClientRect();
      const { height } = rect;
      const index = +(node as Element).id.slice(1);
      const oldHeight = positions[index].height;
      const dValue = oldHeight - height;
      // 存在差值
      if (dValue) {
        nPositions[index].bottom = nPositions[index].bottom - dValue;
        nPositions[index].height = height;
        for (let k = index + 1; k < nPositions.length; k++) {
          nPositions[k].top = nPositions[k - 1].bottom;
          nPositions[k].bottom = nPositions[k].bottom - dValue;
        }
        setPositions(nPositions);
      }
    })
  }
  // 并在初始时根据 estimatedItemSize 对positions进行初始化
  useMemo(() => {
    const initPositions = (): void => {
      const res: PositionsListPorps = data.map((v, i) => ({
        index: i,
        height: estimatedItemSize,
        top: i * estimatedItemSize,
        bottom: (i + 1) * estimatedItemSize
      }))
      setPositions(res);
    }
    initPositions();
  }, [data, estimatedItemSize]);
  // 计算可视区上方渲染条数
  const aboveCount = () => Math.min(start, Math.floor((bufferScale as number) * getVisibleCount()))
  // 计算可视区下方渲染条数
  const belowCount = () => Math.min(data.length - end, Math.ceil((bufferScale as number) * getVisibleCount()))
  // 计算列表的总高度
  const LIST_HEIGHT = useMemo(() => positions.reduce((totalHeight, node) => {
    return totalHeight + node.height;
  }, 0), [positions]);
  // 获取真实显示的列表数据
  const getVisibleData = useMemo(() => {
    const nStart = start - aboveCount();
    const nEnd = end + belowCount();
    return data.slice(nStart, nEnd);
  }, [data, start, end]);
  const setStartOffsets = () => {
    // let startOffset = start >= 1 ? positions[start - 1].bottom : 0;
    let startOffset;
    if (start >= 1) {
      let size = positions[start].top - (positions[start - aboveCount()] ? positions[start - aboveCount()].top : 0);
      startOffset = positions[start - 1].bottom - size;
    } else {
      startOffset = 0;
    }
    (listRef.current as HTMLElement).style.transform = `translate3d(0,${startOffset}px,0)`;
  }
  // 监听滚动函数
  const scrollEvent = (event: React.UIEvent): void => {
    // 获取当前滚动的位置
    const { scrollTop } = event.target as HTMLElement;
    // 计算滚动后，开始的索引
    const currentStart: number = getStartIndex(scrollTop);
    setStart(currentStart);
    // 当前开始的索引 + 页面显示的数量
    setEnd(currentStart + getVisibleCount());
    // 计算此刻的偏移量
    // setStartOffset(scrollTop - (scrollTop % itemH));
  }
  useMemo(() => {
    if (!listRef.current || !listRef.current.childNodes.length) {
      return;
    }
    //获取真实元素大小，修改对应的尺寸缓存
    updateItemsSize();
    //更新真实偏移量
    setStartOffsets();
  }, [start]);
  return (
    <div className="list-container" onScroll={scrollEvent}>
      <div className="list-phantom" style={{ height: LIST_HEIGHT }}></div>
      <div className="list" ref={listRef}>
        {getVisibleData.map(v => (
          <div
            key={v.index}
            id={`_${v.index}`}
            className="list-item"
          >{renderItem(v)}</div>
        ))}
      </div>
    </div>
  )
}

VirtualList.defaultProps = {
  bufferScale: 1
}

export default VirtualList;