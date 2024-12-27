import React, { useState, useEffect } from 'react';
import { LineChart } from '@toast-ui/chart';
import '@toast-ui/chart/dist/toastui-chart.min.css';

const VisitorsByDaily = () => {
    
    const today = new Date().toISOString().split("T")[0]; // 오늘 날짜를 "YYYY-MM-DD" 형식으로 변환
    
    const [startDate, setStartDate] = useState("2024-12-01");
    const [endDate, setEndDate] = useState(today);
    const [loading, setLoading] = useState(false);
    const chartContainerRef = React.useRef(null);

    // 날짜 범위 사이의 모든 날짜를 가져오는 함수
    const getAllDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dates = [];

        while (start <= end) {
            const dateStr = start.toISOString().split('T')[0]; // "YYYY-MM-DD" 형식
            dates.push(dateStr);
            start.setDate(start.getDate() + 1); // 하루씩 증가
        }

        return dates;
    };

    // API로부터 일별 방문자 데이터를 가져오는 함수
    const fetchDailyVisitors = async (startDateTime, endDateTime) => {
        try {
            const response = await fetch(`http://localhost:8082/master/visitorsByDailyData?startDateTime=${startDateTime}&endDateTime=${endDateTime}`);

            if (!response.ok) {
                console.error('API 호출 실패:', response.status);
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
            alert('시작 날짜와 끝 날짜를 모두 입력해주세요.');
            return;
        }

        const startDateTimeFormatted = `${startDate}T00:00:00`;
        const endDateTimeFormatted = `${endDate}T23:59:59`;

        setLoading(true);
        const data = await fetchDailyVisitors(startDateTimeFormatted, endDateTimeFormatted);
        setLoading(false);

        if (!data || data.length === 0) {
            console.error('데이터가 비어 있습니다.');
            return;
        }

        const allDates = getAllDatesInRange(startDate, endDate);

        const categories = allDates;
        const seriesData = allDates.map(date => {
            const entry = data.find(d => d.visitDate === date);
            return entry ? entry.visitorCount || 0 : 0;
        });

        const chartData = {
            categories: categories,
            series: [
                {
                    name: '방문자수',
                    data: seriesData,
                },
            ],
        };

        const options = {
            chart: { width: 750, height: 400, title: '일별 방문자수' },
            xAxis: { title: '일', label: { interval: 1 } },
            yAxis: { title: '방문자 수' },
            series: { showDot: true, lineWidth: 2 },
        };

        const chartContainer = chartContainerRef.current;
        if (chartContainer) {
            chartContainer.innerHTML = '';
            new LineChart({ el: chartContainer, data: chartData, options: options });
        }
    };

    useEffect(() => {
        updateChart(); // 초기 로드 시 차트 데이터 표시
    }, []);

    return (
        <div>
            <h6 style={{ textAlign: 'center' }}>일별 방문자 통계</h6>

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

            <div ref={chartContainerRef} style={{ width: '1000px', height: '500px', margin: '0 auto' }}></div>
        </div>
    );
};

export default VisitorsByDaily;
