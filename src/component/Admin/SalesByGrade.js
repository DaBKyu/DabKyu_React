import React, { useEffect, useState } from 'react';
import { ColumnChart } from '@toast-ui/chart';

const SalesByGradeChart = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    // 데이터 가져오기
    const fetchSalesData = async () => {
        try {
            const response = await fetch('/master/salesByGradeData');
            if (!response.ok) {
                throw new Error('데이터를 가져오는데 실패했습니다.');
            }
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error(error);
            setError('데이터를 가져오는 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        // 컴포넌트가 마운트될 때 데이터 가져오기
        fetchSalesData();
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            // Toast UI Chart용 데이터 형식으로 변환
            const categories = data.map(item => item.memberGrade); // 회원 등급
            const series = [
                {
                    name: '누적 구매 금액',
                    data: data.map(item => item.totalPvalue) // 누적 구매 금액
                }
            ];

            // 차트 옵션 설정
            const options = {
                chart: { title: '등급별 누적 구매 금액', width: 1000, height: 500 },
                xAxis: { title: '등급' },
                yAxis: { title: '누적 구매 금액', min: 0 },
                series: { showLabel: true }
            };

            // 차트 렌더링
            const container = document.getElementById('chart');
            container.innerHTML = '';  // 기존 차트 삭제
            new ColumnChart({ el: container, data: { categories, series }, options });
        }
    }, [data]);

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>등급별 누적 구매 금액 통계</h1>
            <div id="chart" style={{ width: '1000px', height: '500px', margin: '0 auto' }}>
                {error && <p>{error}</p>}
            </div>
        </div>
    );
};

export default SalesByGradeChart;
