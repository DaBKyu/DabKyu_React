import React, { useEffect, useState } from 'react';
import { ColumnChart } from '@toast-ui/chart';

const SalesByAgeChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);  // error 상태 추가

  useEffect(() => {
    // 데이터 가져오기
    fetch('/master/salesByAgeData')
      .then(response => {
        if (!response.ok) throw new Error('데이터를 가져오는데 실패했습니다.');
        return response.json();
      })
      .then(data => {
        setSalesData(data);
      })
      .catch(error => {
        console.error('Error fetching sales data:', error);
        setError('데이터를 가져오는 중 오류가 발생했습니다.');  // 에러 상태 업데이트
      });
  }, []);

  useEffect(() => {
    if (salesData.length === 0) return; // 데이터가 없으면 차트를 그리지 않음

    // 차트 업데이트
    const categories = salesData.map(item => item.ageGroup); // 연령대
    const series = [
      {
        name: '매출액',
        data: salesData.map(item => item.totalSales), // 매출액
      },
    ];

    // 차트 생성
    const container = document.getElementById('chart');
    container.innerHTML = '';  // 기존 차트 삭제
    if (container) {
      new ColumnChart({
        el: container,
        data: { categories, series },
        options: {
          chart: { title: '연령대별 매출액', width: 700, height: 400 },
          xAxis: { title: '연령대' },
          yAxis: { title: '매출액 (원)', min: 0 },
          series: { showLabel: true },
        },
      });
    }
  }, [salesData]); // salesData가 변경될 때마다 차트를 갱신

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>연령대별 매출 통계</h1>
      {error && <p>{error}</p>} {/* 에러 메시지 표시 */}
      <div id="chart" style={{ width: '1000px', height: '500px', margin: '0 auto' }}></div>
    </div>
  );
};

export default SalesByAgeChart;
