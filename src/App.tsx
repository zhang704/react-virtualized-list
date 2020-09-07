import React, { useState, useEffect } from 'react';
import faker from 'faker';
import VirtualList from './components/VirtualList';
import './style.css';

const App = () => {
  const [list, setList] = useState<virtualListProps.ListArrayProps>([]);
  useEffect(() => {
    const getList = () => {
      const res: virtualListProps.ListArrayProps = [];
      for (let i = 0; i < 1000; i++) {
        res.push({
          index: i,
          text: faker.lorem.sentences()
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
        estimatedItemSize={100}
        renderItem={data => {
          return (
            <div className="vir-list-item">
              <span className="line-count">这是第{data.index}行</span>
              <span>{data.text}</span>
            </div>
          )
        }}
      />
    </div>
  );
}

export default App;