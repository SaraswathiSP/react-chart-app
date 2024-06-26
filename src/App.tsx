import React from 'react';
import './App.css';
import ChartComponent from '../src/components/ChartComponent/ChartComponent';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Chart Application</h1>
      </header>
      <main>
        <ChartComponent />
      </main>
    </div>
  );
};

export default App;
