/*
 * @Author: 张伟伦
 * @Date: 2020-09-02 15:16:00
 * @LastEditors: 张伟伦
 * @LastEditTime: 2020-09-02 15:40:35
 * @FilePath: /react-virtualized-list/src/virtualListProps.d.ts
 */
declare namespace virtualListProps {
  import React from 'react';
  interface ListItemProps {
    index: number;
    text: string;
  }
  interface PositionsPorps {
    index: number;
    top: number;
    bottom: number;
    height: number;
  }

  interface VirtualListProps {
    data: ListItemProps[];
    estimatedItemSize: number;
    bufferScale?: number;
    renderItem: (itemData: ListItemProps) => React.ReactElement
  }

  export type ListItemProps = ListItemProps;
  export type ListArrayProps = ListItemProps[];
  export type PositionsPorps = PositionsPorps;
  export type VirtualListProps = VirtualListProps;
}