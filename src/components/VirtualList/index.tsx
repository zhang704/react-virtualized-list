import React, { useState, useEffect } from 'react';
import { ListItemProps } from '../../App';
import './index.css';

interface VirtualListProps {
  data: ListItemProps[]
}

const itemH = 80;

const VirtualList: React.FC<VirtualListProps> = (props) => {
  const { data } = props;
  //列表总高度
  const getListHeight = (): number => {
    return data.length * itemH;
  }
  // 可显示的列表数量
  const getVisibleCount = (): number => {
    const screenH = document.body.clientHeight;
    return Math.ceil(screenH / itemH);
  }
  const [startOffset, setStartOffset] = useState<number>(0);
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(0);
  useEffect(() => {
    setEnd(getVisibleCount());
  }, [data]);
  // 偏移量对应的style
  const getTransformStyle = (): string => {
    return `translate3d(0, ${startOffset}px, 0)`;
  }
  // 获取真实显示的列表数据
  const getVisibleData = (): ListItemProps[] => {
    const jsonData: ListItemProps[] = JSON.parse(JSON.stringify(data));
    return jsonData.slice(start, Math.min(end, jsonData.length));
  }
  // 监听滚动函数
  const scrollEvent = (event: React.UIEvent): void => {
    // 获取当前滚动的位置
    const { scrollTop } = event.target as HTMLElement;
    // 计算滚动后，开始的索引
    const currentStart: number = Math.floor(scrollTop / itemH);
    setStart(currentStart);
    // 当前开始的索引 + 页面显示的数量
    setEnd(currentStart + getVisibleCount());
    // 计算此刻的偏移量
    setStartOffset(scrollTop - (scrollTop % itemH));
  }
  return (
    <div className="list-container" onScroll={scrollEvent}>
      <div className="list-phantom" style={{ height: getListHeight() }}></div>
      <div className="list" style={{ transform: getTransformStyle() }}>
        {getVisibleData().map(v => (
          <div
            key={v.index}
            className="list-item"
            style={{
              height: itemH
            }}
          >{v.text}</div>
        ))}
      </div>
    </div>
  )
}

export default VirtualList;