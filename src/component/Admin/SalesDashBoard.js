import React, { useState } from 'react';
import SalesByDaily from './SalesByDaily';
import SalesByCategoryChart from './SalesByCategory';
import SalesByMemberChart from './SalesByMember';
import SalesByAgeChart from './SalesByAge';
import SalesByGradeChart from './SalesByGrade';
import SalesByProductChart from './SalesByProduct';
import SalesByYearChart from './SalesByYear';
import AdminSidebar from './AdminSidebar';

const SalesDashBoard = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [activeStat, setActiveStat] = useState('salesByDaily');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleStatClick = (statType) => {
    setActiveStat(statType);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <AdminSidebar />
        </div>
        <div className="col-md-9">
          <h1 className="my-4">매출 통계</h1>

    

          {/* 매출 통계 버튼들 */}
          {activeTab === 'sales' && (
            <div className="btn-group mt-3" role="group">
              <button
                onClick={() => handleStatClick('salesByDaily')}
                className={`btn btn-outline-primary ${activeStat === 'salesByDaily' ? 'active' : ''}`}
              >
                일별 매출
              </button>
              <button
                onClick={() => handleStatClick('salesByYear')}
                className={`btn btn-outline-primary ${activeStat === 'salesByYear' ? 'active' : ''}`}
              >
                월별 매출
              </button>
              <button
                onClick={() => handleStatClick('salesByCategory')}
                className={`btn btn-outline-primary ${activeStat === 'salesByCategory' ? 'active' : ''}`}
              >
                카테고리별 매출
              </button>
              <button
                onClick={() => handleStatClick('salesByMember')}
                className={`btn btn-outline-primary ${activeStat === 'salesByMember' ? 'active' : ''}`}
              >
                회원별 매출
              </button>
              <button
                onClick={() => handleStatClick('salesByAge')}
                className={`btn btn-outline-primary ${activeStat === 'salesByAge' ? 'active' : ''}`}
              >
                연령대별 매출
              </button>
              <button
                onClick={() => handleStatClick('salesByGrade')}
                className={`btn btn-outline-primary ${activeStat === 'salesByGrade' ? 'active' : ''}`}
              >
                등급별 매출
              </button>
              <button
                onClick={() => handleStatClick('salesByProduct')}
                className={`btn btn-outline-primary ${activeStat === 'salesByProduct' ? 'active' : ''}`}
              >
                상품별 매출
              </button>
            </div>
          )}

          {/* 차트 컴포넌트 렌더링 */}
          <div className="mt-4" style={{ marginLeft: -700 }}>
            {activeStat === 'salesByDaily' && <SalesByDaily />}
            {activeStat === 'salesByYear' && <SalesByYearChart />}
            {activeStat === 'salesByCategory' && <SalesByCategoryChart />}
            {activeStat === 'salesByMember' && <SalesByMemberChart />}
            {activeStat === 'salesByAge' && <SalesByAgeChart />}
            {activeStat === 'salesByGrade' && <SalesByGradeChart />}
            {activeStat === 'salesByProduct' && <SalesByProductChart />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashBoard;
