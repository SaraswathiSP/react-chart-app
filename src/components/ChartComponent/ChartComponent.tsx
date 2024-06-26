import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush
} from 'recharts';
import axios from 'axios';
import './ChartComponent.css'

interface DataPoint {
  timestamp: string;
  value: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`Timestamp: ${label}`}</p>
        <p className="intro">{`Value: ${payload[0].value}`}</p>
        <p className="desc">{`Date: ${label.slice(0,10)}`}</p>
      </div>
    );
  }

  return null;
};

const ChartComponent  = () => {
    const [data, setData] = useState([]);
    const [timeframe, setTimeframe] = useState('daily');
    const [filterValue, setFilterValue] = useState(0);

  useEffect(() => {
    axios.get('/data.json')
      .then(response => {
        setData(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleClick = (data: any) => {
    if (data.activeLabel && data.activePayload && data.activePayload[0]) {
        alert(`Timestamp: ${data.activeLabel}, Value: ${data.activePayload[0].value}`);
      }
 };

  const filterDataByTimeframe = (data: DataPoint[], timeframe: string): DataPoint[] => {
    switch (timeframe) {
      case 'weekly':
        return data.filter((_, index) => index % 7 === 0);
      case 'monthly':
        return data.filter((_, index) => index % 30 === 0);
      default:
        return data;
    }
  };

  const filteredData = filterDataByTimeframe(data, timeframe).filter(point => point.value >= filterValue);

  return (
    <div>
      <div>
        <button onClick={() => setTimeframe('daily')}>Daily</button>
        <button onClick={() => setTimeframe('weekly')}>Weekly</button>
        <button onClick={() => setTimeframe('monthly')}>Monthly</button>
      </div>
      <div>
        <label>
          Filter value:
          <input
            type="number"
            value={filterValue}
            onChange={(e) => setFilterValue(Number(e.target.value))}
          />
        </label>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={filteredData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          onClick={handleClick}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} animationDuration={500} />
          <Brush dataKey="timestamp" height={30} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
