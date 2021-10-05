import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2';

function ResultChart(props) {

  const data = props.loanChartData?.map(item => {
    return Math.floor(item.debtStatus)
  });

  const data2 = props.investementData?.map(item => {
    return Math.floor(item.total)
  });

  // const labels = props.loanChartData?.map(item => {
  //   return `rok ${item.month/12}`
  // });

  const labels = () => {
    const lab = []
    for (let i = 0; i <= 30; i++) {
      lab.push(`rok ${i}`)
    }
    return lab
  }

  const options = {
    type: 'bar',
    labels: labels(),
    fontColor: 'black',
    pointStyle: 'circle',
    responsive: false,
    datasets: [{
      label: 'úvěr',
      data: data,
      borderColor: "red",
      pointBackgroundColor: "red",
      borderWidth: 2,
      backgroundColor: "transparent"
    },
    {
      label: 'hodnota investice',
      data: data2,
      borderColor: "green",
      pointBackgroundColor: "green",
      borderWidth: 2,
      backgroundColor: "transparent"
    }],
    legend: {
      labels: {
        fontColor: "#fff"
      }
    }
    
  };
 

  return (
    <div className={props.className}>
      <Line
        data={options}
        options={{
          legend: {
            display: false,
            position: 'right',
          },
        }}
      />
    </div>

  );
}

export default ResultChart;