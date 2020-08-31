import React, { useState, useEffect } from 'react';
import VirtualList from './components/VirtualList';

export interface ListItemProps {
  index: number;
  text: string;
}

type ListArray = ListItemProps[];
const App = () => {
  const [list, setList] = useState<ListArray>([]);
  useEffect(() => {
    const getList = () => {
      const res: ListArray = [];
      for (let i = 0; i < 10000; i++) {
        res.push({
          index: i,
          text: i + ''
        })
      }
      setList(res);
    }
    getList();
  }, []);
  return (
    <div className="App">
      <VirtualList
        data={list}
      />
    </div>
  );
}

export default App;
