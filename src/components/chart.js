import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const AttendanceChart = ({ present, absent, leave }) => {
  const donutChartRef = useRef(null);
  const donutChartInstance = useRef(null);

  useEffect(() => {
    // Create or update donut chart
    if (donutChartInstance.current) {
      donutChartInstance.current.destroy(); // Destroy existing donut chart before creating a new one
    }

    const donutCtx = donutChartRef.current.getContext('2d');
    donutChartInstance.current = new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent', 'Leave'],
        datasets: [{
          backgroundColor: ['#F3B2C3', '#FFD773', '#74CDCC'],
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 0,
          data: [present, absent, leave]
        }]
      },
      options: {
        responsive: true,
        aspectRatio: 1, // Maintain a square aspect ratio
      }
    });

    return () => {
      if (donutChartInstance.current) {
        donutChartInstance.current.destroy(); // Ensure the donut chart is destroyed when the component is unmounted
      }
    };
  }, [present, absent, leave]);

  return (
    <div>
      <canvas style={{ height: "300px", width: "300px" }} ref={donutChartRef} />
    </div>
  );
};

export default AttendanceChart;
