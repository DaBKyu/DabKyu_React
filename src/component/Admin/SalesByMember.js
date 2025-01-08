import React, { useEffect, useState } from 'react';
import { ColumnChart } from '@toast-ui/chart';

const SalesByMemberChart = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 데이터 가져오기
        fetch('/master/salesByMemberData')
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch data");
                return response.json();
            })
            .then(data => {
                setData(data);
            })
            .catch(error => {
                console.error('Error fetching sales data:', error);
                setError('Failed to load sales data.');
            });
    }, []);

    useEffect(() => {
        if (data && Array.isArray(data) && data.length > 0) {
            // 회원 이름 및 누적 구매 금액 데이터 추출
            const categories = data.map(item => item.username);
            const totalPvalues = data.map(item => item.totalPvalue);

            // 차트 데이터 구성
            const dataForChart = {
                categories: categories,
                series: [
                    {
                        name: '누적 구매 금액',
                        data: totalPvalues,
                    },
                ],
            };

            // 차트 옵션 구성
            const options = {
                chart: {
                    title: '회원별 누적 구매 금액',
                    width: 1500,
                    height: 500,
                },
                xAxis: {
                    title: '회원 이름',
                    label: {
                        rotation: -45, // xAxis 레이블 회전 각도 설정
                    },
                },
                yAxis: {
                    title: '누적 구매 금액',
                    min: 0,
                },
                series: {
                    showLabel: true, // 데이터 라벨 표시
                },
                tooltip: {
                    suffix: '원', // 툴팁에 원 단위 추가
                },
            };

             // ColumnChart 컴포넌트를 사용하여 차트를 렌더링
            const container = document.getElementById('chart');
            container.innerHTML = '';  // 기존 차트 삭제
            new ColumnChart({ el: container, data: dataForChart, options: options });
        }

    }, [data]);

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>회원별 누적 구매 금액 통계</h1>
            <div id="chart" style={{ width: '1000px', height: '500px', margin: '0 auto' }}>
                {error && <p>{error}</p>}
            </div>
        </div>
    );
};

export default SalesByMemberChart;
