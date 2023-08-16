import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/charts';
import moment from 'moment';
const Dashboard = (props) => {
  const { revenue } = props
  const [revenueData, setRevenueData] = useState([])
  console.log("revenue>>", revenue)


  // Map and convert "when" to days
  const getData = () => {
    const mappedData = revenue?.map(item => ({
      day: moment(item.when).format('DD-MM'),
      money: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(item.money),
    }));
    setRevenueData(mappedData);
  }

  const data = revenueData?.map(item => {
    return {
      day: item.day, money: item.money
    }
  })
  console.log(">data", data)

  // const data = [
  //   { day: 8, money: 150000 }
  // ]

  useEffect(() => {
    getData()
  }, [revenue]);


  const config = {
    data,
    width: 800,
    height: 400,
    autoFit: true,
    xField: 'day',
    yField: 'money',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };
  let chart;



  return (
    <div style={{ width: '1200px' }}>
      {data?.length > 0 ? (
        <Line {...config}
          onReady={(chartInstance) => (chart = chartInstance)} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
export default Dashboard;