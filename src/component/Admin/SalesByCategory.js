import React, { useEffect, useState } from 'react';
import { ColumnChart } from '@toast-ui/chart';

const SalesByCategoryChart = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 데이터 가져오기
        fetch('/master/salesByCategoryData')
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
        if (data && data.length > 0) {
            // 카테고리 이름 및 매출 데이터 추출
            const categories = data.map(item => item.category3Name);
            const sales = data.map(item => item.salesAmount);

            // 차트 데이터 구성
            const dataForChart = {
                categories: categories,
                series: [
                    {
                        name: '매출액',
                        data: sales,
                    },
                ],
            };

            // 차트 옵션 구성
            const options = {
                chart: {
                    title: '카테고리별 매출액',
                    width: 1000,
                    height: 500,
                },
                xAxis: {
                    title: '카테고리',
                },
                yAxis: {
                    title: '매출액',
                    min: 0,
                },
                series: {
                    showLabel: true, // 데이터 라벨 표시
                },
            };

            // DOM 요소가 존재하는지 확인 후 차트 렌더링
            const container = document.getElementById('category-chart');
            container.innerHTML = '';  // 기존 차트 삭제

            if (container) {
                new ColumnChart({ el: container, data: dataForChart, options: options });
            }
        }
    }, [data]);

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>카테고리별 매출 통계</h1>
            <div id="category-chart" style={{ width: '1000px', height: '500px', margin: '0 auto' }}>
                {error && <p>{error}</p>}
            </div>
        </div>
    );
};

export default SalesByCategoryChart;
