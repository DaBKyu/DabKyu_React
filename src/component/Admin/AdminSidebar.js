import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/shopHeader.css"; 
import "../../css/AdminSidebar.css"; 
import {Link} from 'react-router-dom';
import { FaUser, FaHome, FaBox, FaClipboardList, FaUsers, FaEnvelope, FaChartLine } from 'react-icons/fa'; // 아이콘 사용

const Sidebar = () => {
  return (
    <div className="sidebar d-flex flex-column">
       <br/> <br/>
       <div className="d-flex align-items-center justify-content-center mb-4">
       <FaUser className="mr-2" />
       <Link to="/master/main">
        <h5 className="text-white">관리자 페이지</h5>
        </Link>
      </div>
      <br /> 
      <Link to="/master/productList" className="d-flex align-items-center indent">
        <FaHome className="mr-2" />
        쇼핑페이지 돌아가기
      </Link>
      <Link to="/master/productList" className="d-flex align-items-center indent">
        <FaBox className="mr-2" />
        상품 관리
      </Link>
      <Link to="/master/categoryList" className="d-flex align-items-center indent">
        <FaClipboardList className="mr-2" />
        카테고리 관리
      </Link>
      <Link to="/master/couponList" className="d-flex align-items-center indent space">
        <FaClipboardList className="mr-2" />
        쿠폰 관리
      </Link>
      <Link to="/master/memberList" className="d-flex align-items-center indent">
        <FaUsers className="mr-2" />
        회원 관리
        </Link>
      <Link to="/master/mailList" className="d-flex align-items-center indent">
        <FaEnvelope className="mr-2" />
        메일 관리
      </Link>
      <br /> 
      <Link to="/master/orderList" className="d-flex align-items-center indent">
        <FaClipboardList className="mr-2" />
        주문 관리
      </Link>
      <Link to="/master/questionList" className="d-flex align-items-center indent">
        <FaClipboardList className="mr-2" />
        문의 관리
      </Link>
      <Link to="/master/reviewList" className="d-flex align-items-center indent">
        <FaClipboardList className="mr-2" />
        리뷰 관리
      </Link>
      <Link to="/master/reviewReportList" className="d-flex align-items-center indent space">
        <FaClipboardList className="mr-2" />
        리뷰 신고 관리
      </Link>
      <br /> 
      <Link to="#" className="d-flex align-items-center indent">
        <FaChartLine className="mr-2" />
        매출 통계
      </Link>
      <Link to="#" className="d-flex align-items-center indent">
        <FaChartLine className="mr-2" />
        가입 통계
      </Link>
      <Link to="#" className="d-flex align-items-center indent">
        <FaChartLine className="mr-2" />
        방문 통계
      </Link>
    </div>
  );
};


const AdminSidebar = () => {
  return (
    <div className="d-flex">
      {/* 사이드바 */}
      <Sidebar />

     </div>
  );
};

export default AdminSidebar;
