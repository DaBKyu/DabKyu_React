import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminSidebar from "./AdminSidebar"; // AdminSidebar 컴포넌트 import
import "../../css/AdminSidebar.css"; // CSS 파일 import
import { useNavigate } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchStatus, setSearchStatus] = useState(''); // 주문 상태 필터링을 위한 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 주문 데이터 호출
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8082/master/orderList');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 이메일 및 상태 검색 핸들러 (실시간 검색)
  useEffect(() => {
    let filtered = orders;

    if (searchEmail) {
      filtered = filtered.filter(order => order.email.email.includes(searchEmail));
    }

    if (searchStatus) {
      filtered = filtered.filter(order => order.orderStatus === searchStatus);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // 검색 후 첫 페이지로 이동
  }, [searchEmail, searchStatus, orders]);

  // 페이지 변경 핸들러
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 현재 페이지의 데이터 계산
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  if (loading) return <div className="text-center my-4">로딩 중...</div>;
  if (error) return <div className="text-danger text-center my-4">오류 발생: {error}</div>;

  return (
    <div className="container my-4">
      <AdminSidebar />
      <h1 className="text-center mb-4">주문 관리</h1>

      <div className="mb-3 d-flex">
        <input
          type="text"
          className="form-control"
          placeholder="이메일로 검색"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <select
          className="form-control ms-3"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        >
          <option value="">주문 상태 선택</option>
          <option value="배송중">배송중</option>
          <option value="배송준비중">배송준비중</option>
          <option value="배송완료">배송완료</option>
          <option value="취소신청">취소신청</option>
          <option value="환불신청">환불신청</option>
          <option value="취소완료">취소완료</option>
          <option value="환불완료">환불완료</option>
        </select>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th scope="col">주문번호</th>
            <th scope="col">이메일</th>
            <th scope="col">회원명</th>
            <th scope="col">주문상태</th>
            <th scope="col">주문일</th>
            <th scope="col">예상 배송일</th>
            <th scope="col">결제수단</th>
            <th scope="col">총 가격</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr
            key={order.orderSeqno}
            onClick={() => navigate(`/master/orderDetail/${order.orderSeqno}`)}
            style={{ cursor: 'pointer' }}
            className="table-row-hover"
          >
              <td>{order.orderSeqno}</td>
              <td>{order.email.email}</td>
              <td>{order.email.username}</td>
              <td>{order.orderStatus}</td>
              <td>{new Date(order.orderDate).toLocaleString()}</td>
              <td>{new Date(order.exptDate).toLocaleString()}</td>
              <td>{order.pay}</td>
              <td>{order.totalPrice.toLocaleString()}원</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }, (_, i) => i + 1).map(number => (
            <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default OrderList;
