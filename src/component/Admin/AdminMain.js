import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import "../../css/AdminMain.css"; // CSS 파일 import
import "../../css/AdminSidebar.css"; // CSS 파일 import
import AdminSidebar from "./AdminSidebar"; // AdminSidebar 컴포넌트 import
import SalesByDaily from "./SalesByDaily";
import VisitorsByDaily from "./VisitorsByDaily";

const AdminMain = () => {
  const [data, setData] = useState({
    visitorCount: null,
    reviewCount: null,
    error: null,
  });

  useEffect(() => {
    const fetchData = async (url, key) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData((prevState) => ({ ...prevState, [key]: result }));
      } catch (err) {
        console.error(`Error fetching ${key}:`, err);
        setData((prevState) => ({
          ...prevState,
          error: `Failed to fetch ${key}`,
        }));
      }
    };

    fetchData("http://localhost:8082/master/visitorCount", "visitorCount");
    fetchData("http://localhost:8082/master/reviewCount", "reviewCount");
    fetchData("http://localhost:8082/master/questionCount", "questionCount");
    fetchData("http://localhost:8082/master/pendingQuestions", "pendingQuestions");
  }, []);


  const Card = ({ title, value }) => (
    <div className="col-md-3 mb-4">
      <div className="card">
        <div className="card-body text-center">
          <h6>{title}</h6>
          <p>{value !== null ? value : "Loading..."}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="d-flex"  style={{ marginLeft: '150px' }}>
      <AdminSidebar />
      {/* 메인 콘텐츠 */}
      <div className="main-content w-100 p-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5>안녕하세요, 관리자님!</h5>
          <button className="btn btn-outline-primary">로그아웃</button>
        </div>
        <div className="mt-4">
          {/* 카드 섹션 */}
            <div className="row">
              <Card title="오늘의 방문자 수" value={data.visitorCount} />
              <Card title="오늘의 리뷰 수" value={data.reviewCount}/> 
              <Card title="오늘의 문의 수" value={data.questionCount} />
              <Card title="답변 대기 문의 수" value={data.pendingQuestions} />
              <Card title="주문 접수 건수" value="5" />
              <Card title="주문 취소 요청 건수" value="2" />
              <Card title="주문 환불 요청 건수" value="2" />
              <Card title="배송 완료 건수" value="2" />
            </div>
          {/* 통계 섹션 */}
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <div className="chart">
                    <VisitorsByDaily />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <div className="chart">
                  <SalesByDaily />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
