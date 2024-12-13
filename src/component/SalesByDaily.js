import React, { useState, useEffect } from 'react';
import { LineChart } from '@toast-ui/chart'; 
import '@toast-ui/chart/dist/toastui-chart.min.css';

const SalesByDaily = () => {

    const today = new Date().toISOString().split("T")[0]; // 오늘 날짜를 "YYYY-MM-DD" 형식으로 변환

    const [startDate, setStartDate] = useState("2024-11-01");
    const [endDate, setEndDate] = useState(today);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);

    // 날짜 범위 사이의 모든 날짜를 가져오는 함수
    const getAllDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dates = [];

        while (start <= end) {
            const dateStr = start.toISOString().split('T')[0];  // "YYYY-MM-DD" 형식
            dates.push(dateStr);
            start.setDate(start.getDate() + 1); // 하루씩 증가
        }

        return dates;
    };

    // API로부터 일별 매출 데이터를 가져오는 함수
    const fetchDailySales = async (startDateTime, endDateTime) => {
        try {
            const response = await fetch(`http://localhost:8082/master/salesByDailyData?startDateTime=${startDateTime}&endDateTime=${endDateTime}`);

            if (!response.ok) {
                console.error('API 호출 실패:', response.status);
                const errorText = await response.text();  // 오류 메시지 또는 HTML 페이지 내용
                console.error(errorText);
                return [];
            }

            const data = await response.json();
            console.log('서버 응답 데이터:', data);
            return data;

        } catch (error) {
            console.error('API 요청 중 오류 발생:', error);
            return [];
        }
    };

    // 차트 업데이트 함수
    const updateChart = async () => {
        if (!startDate || !endDate) {
            alert('시작 날짜와 끝 날짜를 입력해주세요.');
            return;
        }

        const startDateTimeFormatted = `${startDate}T00:00:00`;
        const endDateTimeFormatted = `${endDate}T23:59:59`;

        setLoading(true);

        const data = await fetchDailySales(startDateTimeFormatted, endDateTimeFormatted);

        if (!data || !Array.isArray(data)) {
            console.error('데이터가 올바르지 않음:', data);
            setLoading(false);
            return;
        }

        const allDates = getAllDatesInRange(startDate, endDate);
        console.log('생성된 날짜 범위:', allDates);

        const seriesData = allDates.map(date => {
            const entry = data.find(d => d.date === date);
            return entry ? entry.totalSales || 0 : 0;
        });

        console.log('매핑된 데이터:', seriesData);

        setChartData({
            categories: allDates,
            series: [
                {
                    name: '매출액',
                    data: seriesData
                }
            ]
        });

        setLoading(false);
    };

    useEffect(() => {
        // 페이지 로드시 기본 데이터 표시
        updateChart();
    }, []);

    useEffect(() => {
        // 차트 그리기
        if (chartData && chartData.categories) {
            const chartContainer = document.getElementById('chart');
            chartContainer.innerHTML = '';  // 기존 차트 삭제

            const options = {
                chart: { width: 750, height: 400, title: '일별 매출액' },
                xAxis: { title: '일', label: { interval: 1 } },
                yAxis: { title: '매출 (₩)' },
                series: { showDot: true, lineWidth: 2 }
            };

            // LineChart 인스턴스 생성
            new LineChart({ el: chartContainer, data: chartData, options: options });
        }
    }, [chartData]);

    return (
        <div>
            <h6 style={{ textAlign: 'center' }}>일별 매출액 통계</h6>

            {/* 날짜 입력 필드 추가 */}
            <div style={{ textAlign: 'center' }}>
                <label htmlFor="startDate">시작 날짜: </label>
                <input 
                    type="date" 
                    id="startDate" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label htmlFor="endDate">끝 날짜: </label>
                <input 
                    type="date" 
                    id="endDate" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button onClick={updateChart}>조회</button>
            </div>

            {loading && <div>Loading...</div>}

            <div id="chart" style={{ width: '1000px', height: '500px', margin: '0 auto' }}></div>
        </div>
    );
};

export default SalesByDaily;
