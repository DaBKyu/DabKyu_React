import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminSidebar from "./AdminSidebar"; // AdminSidebar 컴포넌트 import
import "../../css/AdminSidebar.css"; // CSS 파일 import
import 'bootstrap/dist/css/bootstrap.min.css';  // 부트스트랩 CSS 추가

const OrderDetail = () => {
  const { orderSeqno } = useParams(); // URL에서 orderSeqno 추출
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);  
  const [newOrderStatus, setNewOrderStatus] = useState(null);
  const [orderStatusUpdated, setOrderStatusUpdated] = useState(false); 

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8082/master/orderDetail/${orderSeqno}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const orderInfoDetail = data.orderInfoDetail;

        setOrderDetails(orderInfoDetail.orderDetails);
        setOrderInfo(orderInfoDetail.orderInfo);
        setOrderProducts(orderInfoDetail.orderProducts);
        setNewOrderStatus(orderInfoDetail.orderInfo.orderStatus);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderSeqno]);

    // 주문 상태 변경 함수
    const updateOrderStatus = async () => {
      setIsUpdating(true);  // 수정 요청 시작
      try {
          const response = await fetch(`http://localhost:8082/master/changeOrderStatus/${orderSeqno}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ orderStatus : newOrderStatus }),  // 수정할 등급
          });
  
          if (response.ok) {
              const data = await response.text();  // 응답을 JSON이 아닌 텍스트로 받기
              alert(data);  // 응답 메시지를 그대로 알림으로 표시
              setOrderStatusUpdated(true);
          } else {
              const errorData = await response.text();  // 오류 메시지를 텍스트로 처리
              alert(errorData);
          }
      } catch (error) {
          console.error("주문 상태 변경에 실패했습니다:", error);
          alert("주문 상태 변경 중 오류가 발생했습니다.");
      } finally {
          setIsUpdating(false);  // 변경 요청 종료
      }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5">Error: {error.message}</div>;

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="container mt-4">
        <h1 className="mb-4">주문 상세 정보</h1>
        
        {orderInfo && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">주문 정보</h5>
              <div className="d-flex justify-content-end">
                <button className="btn btn-warning me-2">주문 취소 처리</button>
                <button className="btn btn-warning">주문 환불 처리</button>
              </div>
              <p className="card-text mt-3">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>주문번호</th>
                    <th>주문상태</th>
                    <th>총금액</th>
                    <th>배송비</th>
                    <th>수령인</th>
                    <th>수령주소</th>
                    <th>주문일</th>
                    <th>도착일</th>
                  </tr>
                </thead>
                <tbody>
                <tr>
                <td>{orderInfo.orderSeqno}</td>
                <td><select 
                  className="form-select d-inline-block w-auto ms-2" 
                  value={newOrderStatus} 
                  onChange={(e) => setNewOrderStatus(e.target.value)}>
                  <option value="배송중">배송중</option>
                  <option value="배송완료">배송완료</option>
                  <option value="배송준비중">배송준비중</option>
                  <option value="취소신청">취소신청</option>
                  <option value="환불신청">환불신청</option>
                  <option value="취소완료">취소완료</option>
                  <option value="환불완료">환불완료</option>
                </select></td>
                      <td>{orderInfo.totalPrice}</td>
                      <td>{orderInfo.deliveryPrice}</td>
                      <td>{orderInfo.resName}</td>
                      <td>{orderInfo.resAddress}</td>
                      <td>{new Date(orderInfo.orderDate).toLocaleString()}</td>
                      <td>{new Date(orderInfo.exptDate).toLocaleString()}</td>
                    </tr>
          
                </tbody>
              </table>
              
              </p>
            </div>
          </div>
        )}

        {orderDetails && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">주문 상세</h5>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>취소여부</th>
                    <th>환불여부</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.map((detail, index) => (
                    <tr key={index}>
                      <td>{detail.cancelYn}</td>
                      <td>{detail.refundYn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {orderProducts.length > 0 && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">주문 상품 정보</h5>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>상품명</th>
                    <th>카테고리</th>
                    <th>가격</th>
                    <th>수량</th>
                    <th>리뷰 여부</th>
                  </tr>
                </thead>
                <tbody>
                  {orderProducts.map((product, index) => (
                    <tr key={index}>
                      <td>{product.product.productName}</td>
                      <td>{product.product.category3Seqno.category3Name}</td>
                      <td>{product.product.price}원</td>
                      <td>{product.amount}</td>
                      <td>{product.reviewYn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div >
                <button 
                    className="btn btn-primary" 
                    onClick={updateOrderStatus} 
                    disabled={isUpdating}
                >
                    {isUpdating ? "변경 중..." : "주문 상태 변경"}
                </button>
                {orderStatusUpdated && <p className="text-success">주문 상태 변경이 완료되었습니다.</p>}
            </div>
      </div>
      
    </div>
  );
};

export default OrderDetail;
