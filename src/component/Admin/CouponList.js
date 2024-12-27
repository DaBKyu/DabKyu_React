import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from "./AdminSidebar"; // AdminSidebar 컴포넌트 import
import "../../css/AdminSidebar.css"; // CSS 파일 import

function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [couponType, setCouponType] = useState('');
  const [selectedCoupons, setSelectedCoupons] = useState([]); // 선택된 쿠폰을 저장할 상태
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    fetch('http://localhost:8082/master/couponList')
      .then(response => response.json())
      .then(data => {
        setCoupons(data.coupons);
      })
      .catch(error => {
        console.error('쿠폰 데이터를 가져오는 데 실패했습니다:', error);
      });
  }, []);

  const filteredCoupons = coupons.filter(coupon => {
    const matchesName = coupon.couponName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = couponType ? coupon.couponType === couponType : true;
    return matchesName && matchesType;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCoupons.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleCheckboxChange = (couponSeqno) => {
    setSelectedCoupons(prevSelectedCoupons =>
      prevSelectedCoupons.includes(couponSeqno)
        ? prevSelectedCoupons.filter(seqno => seqno !== couponSeqno)
        : [...prevSelectedCoupons, couponSeqno]
    );
  };

  const handleDeactivateCoupons = () => {
    if (selectedCoupons.length === 0) {
      alert('만료 처리할 쿠폰을 선택하세요.');
      return;
    }

    // 확인 창 추가
    const confirmed = window.confirm('선택한 쿠폰을 만료처리 하시겠습니까?');
  if (confirmed) {
    fetch('http://localhost:8082/master/deactivateCoupons', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedCoupons),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('네트워크 응답이 실패했습니다.');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);  // 응답 데이터 로그 추가
        // 성공 메시지 표시
        alert('선택한 쿠폰이 만료 처리되었습니다.');
        setSelectedCoupons([]); // 선택된 쿠폰 초기화
        // 쿠폰 목록을 다시 불러오기 (새로고침)
        fetch('http://localhost:8082/master/couponList')
          .then(response => response.json())
          .then(data => setCoupons(data.coupons));
      })
      .catch(error => {
        console.error('쿠폰 만료 처리 실패:', error);
        alert('쿠폰 만료 처리에 실패했습니다. 다시 시도해 주세요.');
      });
  }
};

  return (
    <div className="container mt-5">
        <AdminSidebar />
      <h1 className="text-center mb-4">쿠폰 목록</h1>

      {/* 쿠폰 생성, 배포 버튼과 만료 처리 버튼을 같은 라인에 배치 */}
      <div className="mb-4 d-flex justify-content-between">
      <div>
          <button
            className="btn btn-danger"
            onClick={handleDeactivateCoupons}
          >
            쿠폰 만료 처리
          </button>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/master/createCoupon')}
          >
            쿠폰 생성
          </button>
          <button
            className="btn btn-success"
            onClick={() => navigate('/master/couponDistribution')}
          >
            쿠폰 배포
          </button>
        </div>
        
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
            setCurrentPage(1);
          }}
        />

        <select
          className="form-control"
          value={couponType}
          onChange={(e) => {
            setCouponType(e.target.value);
            setCurrentPage(1);
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
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCoupons(filteredCoupons.map(coupon => coupon.couponSeqno));
                      } else {
                        setSelectedCoupons([]);
                      }
                    }}
                    checked={selectedCoupons.length === filteredCoupons.length}
                  />
                </th>
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
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedCoupons.includes(coupon.couponSeqno)}
                      onChange={() => handleCheckboxChange(coupon.couponSeqno)}
                    />
                  </td>
                  <td>{coupon.couponCode}</td>
                  <td onClick={() => navigate(`/master/couponDetail/${coupon.couponSeqno}`)} style={{ cursor: 'pointer' }}>{coupon.couponName}</td>
                  <td>{coupon.couponType}</td>
                  <td>{coupon.couponRole}</td>
                  <td>{coupon.couponInfo}</td>
                  <td>{coupon.minOrder}원</td>
                  <td>{coupon.amountDiscount}원</td>
                  <td>{coupon.percentDiscount}%</td>
                  <td>{coupon.isDupl === 'Y' ? '가능' : '불가능'}</td>
                  <td>
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
                <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => paginate(number)}>
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
