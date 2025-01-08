import React, { useState, useEffect, useRef } from 'react';
import { PieChart } from '@toast-ui/chart';

const GenderSignupStatistics = () => {
    const [chartData, setChartData] = useState(null);
    const chartRef = useRef(null); // 차트 요소를 참조하기 위한 useRef

    // 서버에서 성별 기준 가입 통계 데이터 가져오는 함수
    const fetchGenderStatData = async () => {
        try {
            const response = await fetch('/master/signupGenderStatData');
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
        const data = await fetchGenderStatData();

        if (data.length === 0) {
            document.getElementById('chart').innerText = '표시할 데이터가 없습니다.';
            return;
        }

        // Toast UI Chart용 데이터 형식으로 변환
        const series = data.map(item => ({
            name: item.gender,
            data: item.genderCount
        }));

        setChartData({ categories: ['Gender'], series });
    };

    // 페이지 로드 시 차트 렌더링
    useEffect(() => {
        updateChart();
    }, []);

    useEffect(() => {
        if (chartData && chartRef.current) {
            // 차트 요소의 내용을 지우기
            chartRef.current.innerHTML = '';
            new PieChart({
                el: chartRef.current,
                data: chartData,
                options: {
                    chart: {
                        width: 600,
                        height: 400,
                        title: '성별 기준 가입 통계'
                    },
                    series: {
                        radiusRange: ['40%', '100%'], // 차트 크기 조정
                        showLegend: true,
                        label: {
                            normal: {
                                show: true,
                                formatter: '{name}: {value} ({percentage}%)'
                            }
                        }
                    }
                }
            });
        }
    }, [chartData]);

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>성별기준 가입통계</h1>
            <div ref={chartRef} style={{ width: '1000px', height: '500px', margin: '0 auto' }}></div>
        </div>
    );
};

export default GenderSignupStatistics;
