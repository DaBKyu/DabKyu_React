import React, { useState } from 'react';
import VisitorsByDaily from './VisitorsByDaily';
import AdminSidebar from './AdminSidebar';

const SalesDashBoard = () => {
  const [activeTab, setActiveTab] = useState('visitors');
  const [activeStat, setActiveStat] = useState('visitorsByDaily');

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
          <h1 className="my-4">방문 통계</h1>

          {/* 방문자 통계 버튼들 */}
          {activeTab === 'visitors' && (
            <div className="btn-group mb-3" role="group">
              <button
                onClick={() => handleStatClick('visitorsByDaily')}
                className={`btn btn-outline-primary ${activeStat === 'visitorsByDaily' ? 'active' : ''}`}
              >
                일별 통계
              </button>
            </div>
          )}

          {/* 선택된 통계 컴포넌트 렌더링 */}
          {activeStat === 'visitorsByDaily' && <VisitorsByDaily />}

          {/* iframe */}
          <iframe
            id="statsFrame"
            src={`/master/${activeStat}`}
            width="100%"
            height="600px"
            frameBorder="0"
            style={{ marginTop: '20px' }}
            title="방문 통계"
          />
        </div>
      </div>
    </div>
  );
};

export default SalesDashBoard;
