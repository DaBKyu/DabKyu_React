import React, { useState } from 'react';
import SignUpDateStat from './SignUpDateStat';
import SignUpGenderStat from './SignUpGenderStat';
import SignUpAgeStat from './SignUpAgeStat';
import AdminSidebar from './AdminSidebar';

const SignUpDashBoard = () => {
  const [activeTab, setActiveTab] = useState('signup');
  const [activeStat, setActiveStat] = useState('signupDateStat');

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
          <h1 className="my-4">통계 페이지</h1>

          {/* 가입 통계 버튼들 */}
          {activeTab === 'signup' && (
            <div className="btn-group mb-3" role="group">
              <button
                onClick={() => handleStatClick('signupDateStat')}
                className={`btn btn-outline-primary ${activeStat === 'signupDateStat' ? 'active' : ''}`}
              >
                가입일 통계
              </button>
              <button
                onClick={() => handleStatClick('signupGenderStat')}
                className={`btn btn-outline-primary ${activeStat === 'signupGenderStat' ? 'active' : ''}`}
              >
                성별 통계
              </button>
              <button
                onClick={() => handleStatClick('signupAgeStat')}
                className={`btn btn-outline-primary ${activeStat === 'signupAgeStat' ? 'active' : ''}`}
              >
                연령대별 통계
              </button>
            </div>
          )}

          {/* 차트 컴포넌트 */}
          <div className="mt-4">
            {activeStat === 'signupDateStat' && <SignUpDateStat />}
            {activeStat === 'signupGenderStat' && <SignUpGenderStat />}
            {activeStat === 'signupAgeStat' && <SignUpAgeStat />}
          </div>

          {/* iframe */}
          <iframe
            id="statsFrame"
            src={`/master/${activeStat}`}
            width="100%"
            height="600px"
            frameBorder="0"
            style={{ marginTop: '20px' }}
            title="통계"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpDashBoard;
