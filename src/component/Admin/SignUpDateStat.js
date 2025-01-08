import React, { useState, useEffect, useRef } from 'react';
import { LineChart } from '@toast-ui/chart';

const SignupStatistics = () => {
    const [startDate, setStartDate] = useState('2024-11-01');
    const [endDate, setEndDate] = useState('2024-11-30');
    const [chartData, setChartData] = useState(null);
    const chartRef = useRef(null); // 차트 요소를 참조하기 위한 useRef

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

    // 차트 업데이트 함수
    const updateChart = async () => {
        const startDateTime = startDate + "T00:00:00";
        const endDateTime = endDate + "T23:59:59";

        if (!startDate || !endDate) {
            alert('시작 날짜와 종료 날짜를 입력해주세요.');
            return;
        }

        try {
            // 서버 API 호출
            const response = await fetch(`/master/signupDateStatData?startDateTime=${startDateTime}&endDateTime=${endDateTime}`);
            if (!response.ok) {
                throw new Error('통계 데이터를 가져오는 데 실패했습니다.');
            }

            const data = await response.json();
            console.log('API 응답 데이터:', data);

            // 날짜 범위 내의 모든 날짜 생성
            const allDates = getAllDatesInRange(startDate, endDate);

            // 모든 날짜를 기준으로 데이터 매핑
            const seriesData = allDates.map(date => {
                const entry = data.find(d => d.regDate === date);
                return entry ? entry.signupCount || 0 : 0;
            });

            // 차트 데이터 정의
            setChartData({
                categories: allDates,
                series: [
                    {
                        name: '가입 수',
                        data: seriesData,
                    },
                ],
            });
        } catch (error) {
            console.error('차트를 업데이트하는 동안 오류 발생:', error);
            alert('데이터를 가져오는 데 실패했습니다.');
        }
    };

    // 페이지 로드 시 기본 차트 렌더링
    useEffect(() => {
        updateChart();
    }, []);

    useEffect(() => {
        if (chartData && chartRef.current) {
            // 차트 요소의 내용을 지우기
            chartRef.current.innerHTML = '';
            new LineChart({
                el: chartRef.current,
                data: chartData,
                options: {
                    chart: {
                        title: '가입일 기준 가입 통계',
                        width: 900,
                        height: 400,
                    },
                    xAxis: {
                        title: '가입일',
                        label: { interval: 1 },
                    },
                    yAxis: {
                        title: '가입 수',
                    },
                    series: {
                        showLabel: true,
                    },
                },
            });
        }
    }, [chartData]);

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>가입일 기준 가입 통계</h1>
            <div style={{ textAlign: 'center' }}>
                <label htmlFor="startDateTime">시작 날짜:</label>
                <input
                    type="date"
                    id="startDateTime"
                    name="startDateTime"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label htmlFor="endDateTime">종료 날짜:</label>
                <input
                    type="date"
                    id="endDateTime"
                    name="endDateTime"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button onClick={updateChart}>조회</button>
            </div>
            <div ref={chartRef} style={{ width: '1000px', height: '500px', margin: '0 auto' }}></div>
        </div>
    );
};

export default SignupStatistics;
