import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from "./AdminSidebar";
import "../../css/AdminSidebar.css";

function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [couponType, setCouponType] = useState('');
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [sortOrder, setSortOrder] = useState(''); // 정렬 기준 상태
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

  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
    if (sortOrder === 'ascending') {
      return new Date(a.couponEndDate) - new Date(b.couponEndDate);
    } else if (sortOrder === 'descending') {
      return new Date(b.couponEndDate) - new Date(a.couponEndDate);
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCoupons.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(sortedCoupons.length / itemsPerPage);
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
          alert('선택한 쿠폰이 만료 처리되었습니다.');
          setSelectedCoupons([]);
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
      <h1 className="text-center mb-4">쿠폰 관리</h1>

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
          className="form-control mr-2"
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

        <select
          className="form-control"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">정렬 기준</option>
          <option value="ascending">종료일 임박순</option>
          <option value="descending">종료일 먼 순</option>
        </select>
      </div>

      {sortedCoupons.length === 0 ? (
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
                        setSelectedCoupons(sortedCoupons.map(coupon => coupon.couponSeqno));
                      } else {
                        setSelectedCoupons([]);
                      }
                    }}
                    checked={selectedCoupons.length === sortedCoupons.length}
                  />
                </th>
                <th>쿠폰 코드</th>
                <th>쿠폰명</th>
                <th>쿠폰 타입</th>
                <th>쿠폰 사용 등급</th>
                <th>쿠폰정보</th>
                <th>최소 주문 금액</th>
                <th>금액 할인</th>
                <th>퍼센트 할인</th>
                <th>중복 할인 여부</th>
                <th>유효 기간</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((coupon) => (
                <tr
                  key={coupon.couponSeqno}
                  onClick={() => navigate(`/master/couponDetail/${coupon.couponSeqno}`)}
                  style={{ cursor: 'pointer' }}
                  className="table-row-hover"
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedCoupons.includes(coupon.couponSeqno)}
                      onChange={() => handleCheckboxChange(coupon.couponSeqno)}
                    />
                  </td>
                  <td>{coupon.couponCode}</td>
                  <td>{coupon.couponName}</td>
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
