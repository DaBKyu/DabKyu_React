import React, { useState, useEffect, useRef } from 'react';
import { ColumnChart } from '@toast-ui/chart';

const AgeGroupSignupStatistics = () => {
    const [chartData, setChartData] = useState(null);
    const chartRef = useRef(null); // 차트 요소를 참조하기 위한 useRef

    // API로부터 데이터를 가져오는 함수
    const fetchAgeStatData = async () => {
        try {
            const response = await fetch('/master/signupAgeStatData');
            if (!response.ok) {
                throw new Error('데이터를 가져오는데 실패했습니다.');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            alert('데이터를 가져오는 중 오류가 발생했습니다.');
            return [];
        }
    };

    // 차트를 렌더링하는 함수
    const updateChart = async () => {
        const data = await fetchAgeStatData();

        if (data.length === 0) {
            document.getElementById('chart').innerText = '표시할 데이터가 없습니다.';
            return;
        }

        // Toast UI Chart용 데이터 형식으로 변환
        const categories = data.map(item => item.ageGroup); // 연령대
        const series = [
            {
                name: '가입 수',
                data: data.map(item => item.ageGroupCount) // 가입 수
            }
        ];

        setChartData({ categories, series });
    };

    // 페이지 로드 시 차트 렌더링
    useEffect(() => {
        updateChart();
    }, []);

    useEffect(() => {
        if (chartData && chartRef.current) {
            // 차트 요소의 내용을 지우기
            chartRef.current.innerHTML = '';
            new ColumnChart({
                el: chartRef.current,
                data: chartData,
                options: {
                    chart: { title: '연령대별 가입 통계', width: 700, height: 400 },
                    xAxis: { title: '연령대' },
                    yAxis: { title: '가입 수', min: 0 },
                    series: { showLabel: true }
                }
            });
        }
    }, [chartData]);

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>연령대별 가입 통계</h1>
            <div ref={chartRef} style={{ width: '1000px', height: '500px', margin: '0 auto' }}></div>
        </div>
    );
};

export default AgeGroupSignupStatistics;
