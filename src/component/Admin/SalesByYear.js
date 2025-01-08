import React, { useState, useEffect } from 'react';
import '@toast-ui/chart/dist/toastui-chart.min.css';
import { LineChart } from '@toast-ui/chart';

const MonthlySalesChart = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchMonthlySales = async (year) => {
        try {
            const response = await fetch(`/master/salesByYearData?year=${year}`);
            const data = await response.json();  // JSON으로 변환
            return data;
        } catch (error) {
            console.error('데이터 로드 실패:', error);
            return [];
        }
    };

    const getAllMonthsInYear = (year) => {
        return Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            return `${year}-${month < 10 ? '0' + month : month}`;
        });
    };

    const updateChart = async () => {
        if (!year) {
            alert('연도를 입력해주세요.');
            return;
        }

        setLoading(true);
        const data = await fetchMonthlySales(year);
        const allMonths = getAllMonthsInYear(year);

        const categories = allMonths;
        const seriesData = allMonths.map((month) => {
            const entry = data.find((d) => d.month.startsWith(month));
            return entry ? entry.totalSales || 0 : 0;
        });

        const chartData = {
            categories,
            series: [
                {
                    name: '월별 매출액',
                    data: seriesData,
                },
            ],
        };

        setChartData(chartData);
        setLoading(false);
    };

    useEffect(() => {
        updateChart();
    }, [year]);

    useEffect(() => {
        if (chartData) {
            const chartContainer = document.getElementById('chart');
            chartContainer.innerHTML = '';  // 기존 차트 삭제

            const options = {
                chart: { width: 900, height: 400, title: '월별 매출액' },
                xAxis: { title: '월', label: { interval: 1 } },
                yAxis: { title: '매출 (₩)' },
                series: { showDot: true, lineWidth: 2 },
            };

            // LineChart 인스턴스 생성
            new LineChart({ el: chartContainer, data: chartData, options: options });
        }
    }, [chartData]);

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>연도별 월별 매출액 통계</h1>

            <div style={{ textAlign: 'center' }}>
                <label htmlFor="year">연도: </label>
                <input
                    type="number"
                    id="year"
                    value={year}
                    min="2000"
                    max="2100"
                    onChange={(e) => setYear(e.target.value)}
                />
                <button onClick={updateChart}>조회</button>
            </div>

            {loading && <div>Loading...</div>}

            <div id="chart" style={{ width: '1000px', height: '500px', margin: '0 auto' }}></div>
        </div>
    );
};

export default MonthlySalesChart;
