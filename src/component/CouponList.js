import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from "./AdminSidebar"; // AdminSidebar 컴포넌트 import
import "../css/AdminSidebar.css"; // CSS 파일 import

function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [couponType, setCouponType] = useState(''); // 쿠폰 타입을 선택할 변수 추가
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    // 쿠폰 목록을 가져오는 API 호출
    fetch('http://localhost:8082/master/couponList')
      .then(response => response.json())
      .then(data => {
        setCoupons(data.coupons);
      })
      .catch(error => {
        console.error('쿠폰 데이터를 가져오는 데 실패했습니다:', error);
      });
  }, []);

  // 검색어와 쿠폰 타입에 따라 필터링된 쿠폰 데이터
  const filteredCoupons = coupons.filter(coupon => {
    const matchesName = coupon.couponName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = couponType ? coupon.couponType === couponType : true; // 쿠폰 타입에 따라 필터링
    return matchesName && matchesType;
  });

  // 현재 페이지에 표시될 쿠폰 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCoupons.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 핸들러
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 페이지 번호 계산
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="container mt-5">
        <AdminSidebar />
      <h1 className="text-center mb-4">쿠폰 목록</h1>

     {/* 쿠폰 생성 버튼 */}
      <div className="mb-4 d-flex justify-content-end">
        <button
          className="btn btn-primary"
          onClick={() => navigate('/master/createCoupon')} // 쿠폰 생성 페이지로 이동
        >
          쿠폰 생성
        </button>
        {/* 쿠폰 배포 버튼 */}
        <button
          className="btn btn-success"
          onClick={() => navigate('/master/couponDistribution')} // 쿠폰 배포 페이지로 이동
        >
          쿠폰 배포
        </button>
      </div>


      {/* 검색 및 드롭다운 필터 */}
      <div className="mb-4 d-flex">
        <input
          type="text"
          className="form-control mr-2"
          placeholder="쿠폰명을 검색하세요"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // 검색 시 첫 페이지로 이동
          }}
        />
        
       
        <select
          className="form-control"
          style={{
            fontSize: '0.85rem',   // 폰트 크기 조정
            padding: '0.25rem 0.5rem',  // 패딩 조정
             // 높이 조정
            width: '140px'         // 가로 크기 조정
          }}
          value={couponType}
          onChange={(e) => {
            setCouponType(e.target.value);
            setCurrentPage(1); // 드롭다운 변경 시 첫 페이지로 이동
          }}
        >
          <option value="">쿠폰 타입 선택</option>
          <option value="C">C 타입</option>
          <option value="A">A 타입</option>
          <option value="T">T 타입</option>
        </select>
      </div>
      {filteredCoupons.length === 0 ? (
        <div className="alert alert-warning text-center">
          검색 조건에 맞는 쿠폰이 없습니다.
        </div>
      ) : (
        <>
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>쿠폰 코드</th>
                <th>쿠폰명</th>
                <th style={{ width: '10%' }}>쿠폰 타입</th>
                <th style={{ width: '10%' }}>쿠폰 사용 등급</th>
                <th>쿠폰정보</th>
                <th style={{ width: '10%' }}>최소 주문 금액</th>
                <th style={{ width: '10%' }}>금액 할인</th>
                <th style={{ width: '10%' }}>퍼센트 할인</th>
                <th style={{ width: '10%' }}>중복 할인 여부</th>
                <th>유효 기간</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((coupon) => (
                <tr key={coupon.couponSeqno}>
                  <td>{coupon.couponCode}</td>
                  <td onClick={() => navigate(`/master/couponDetail/${coupon.couponSeqno}`)} style={{ cursor: 'pointer' }}>{coupon.couponName}</td>
                  <td>{coupon.couponType}</td>
                  <td>{coupon.couponRole}</td>
                  <td>{coupon.couponInfo}</td>
                  <td>{coupon.minOrder}원</td>
                  <td>{coupon.amountDiscount}원</td>
                  <td>{coupon.percentDiscount}%</td>
                  <td>{coupon.isDupl === 'Y' ? '가능' : '불가능'}</td>
                  <td style={{ width: '10%' }}>
                    {new Date(coupon.couponStartDate).toLocaleDateString()} ~{' '}
                    {new Date(coupon.couponEndDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav>
            <ul className="pagination justify-content-center">
              {pageNumbers.map((number) => (
                <li
                  key={number}
                  className={`page-item ${number === currentPage ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}

export default CouponList;
