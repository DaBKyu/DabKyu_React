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

  // 이메일 검색 핸들러
  const handleSearch = (e) => {
    const email = e.target.value;
    setSearchEmail(email);
    if (email) {
      const filtered = orders.filter(order => order.email.email.includes(email));
      setFilteredOrders(filtered);
      setCurrentPage(1);
    } else {
      setFilteredOrders(orders);
    }
  };

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
      <h1 className="text-center mb-4">주문 내역</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="이메일로 검색"
          value={searchEmail}
          onChange={handleSearch}
        />
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
            <tr key={order.orderSeqno} >
              <td onClick={() => navigate(`/master/orderDetail/${order.orderSeqno}`)} style={{ cursor: 'pointer' }}>{order.orderSeqno} </td>
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
