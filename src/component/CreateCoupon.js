import React, { useState} from "react";
import "../css/AdminSidebar.css"; // CSS 파일 import
import "bootstrap/dist/css/bootstrap.min.css";
import AdminSidebar from "./AdminSidebar";
import getCookie from '../GetCookie';

const CreateCoupon = () => {
    const [couponData, setCouponData] = useState({
      couponName: "",
      couponType: "A",
      couponInfo: "",
      percentDiscount: "",
      amountDiscount: "",
      minOrder: "",
      couponRole: "Bronze",
      isDupl: "Y",
      couponStartDate: "",
      couponEndDate: "",
    });
  
    const [category3Seqnos, setCategory3Seqnos] = useState([]);
    const [productSeqnos, setProductSeqnos] = useState([]);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
  
      if (name === "couponStartDate" || name === "couponEndDate") {
        // 날짜 입력 처리: 입력된 값을 ISO 8601 형식으로 변환
        const date = new Date(value);
        const formattedDate = date.toISOString(); // 2024-12-19T00:00:00.000Z 형식
        setCouponData({ ...couponData, [name]: formattedDate });
      } else {
        setCouponData({ ...couponData, [name]: value });
      }
    };
  
    const handleProductChange = (e) => {
      setProductSeqnos(e.target.value.split(",").map((val) => parseInt(val.trim(), 10)));
    };
  
    const handleCategoryChange = (e) => {
      setCategory3Seqnos(e.target.value.split(",").map((val) => parseInt(val.trim(), 10)));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const requestBody = {
        ...couponData
      };
  
      // 쿼리 파라미터로 보낼 값들을 URLSearchParams로 생성
      const params = new URLSearchParams();
      params.append("productSeqnos", productSeqnos.join(","));
      params.append("category3Seqnos", category3Seqnos.join(","));
  
      try {
        const response = await fetch(`http://localhost:8082/master/createCoupon?${params.toString()}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
  
        if (response.ok) {
          const result = await response.text();
          alert(result);
        } else {
          alert("쿠폰 생성 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("Error creating coupon:", error);
        alert("쿠폰 생성 중 오류가 발생했습니다.");
      }
    };
  
    return (
      <div className="container mt-5">
        <AdminSidebar />
        <h2>쿠폰 생성</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>쿠폰 이름:</label>
            <input
              type="text"
              className="form-control"
              name="couponName"
              value={couponData.couponName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>쿠폰 타입:</label>
            <select
              name="couponType"
              className="form-control"
              value={couponData.couponType}
              onChange={handleInputChange}
            >
              <option value="A">A</option>
              <option value="T">T</option>
              <option value="C">C</option>
            </select>
          </div>
          <div className="form-group">
            <label>쿠폰 정보:</label>
            <textarea
              name="couponInfo"
              className="form-control"
              value={couponData.couponInfo}
              onChange={handleInputChange}
              required
            />
          </div>
         
         
            <div className="form-group">
              <label>할인율 (%):</label>
              <input
                type="number"
                className="form-control"
                name="percentDiscount"
                value={couponData.percentDiscount}
                onChange={handleInputChange}
                required
              />
            </div>
    
            <div className="form-group">
              <label>할인 금액 (원):</label>
              <input
                type="number"
                className="form-control"
                name="amountDiscount"
                value={couponData.amountDiscount}
                onChange={handleInputChange}
                required
              />
            </div>

  
          <div className="form-group">
            <label>최소 주문 금액:</label>
            <input
              type="number"
              className="form-control"
              name="minOrder"
              value={couponData.minOrder}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>적용 등급:</label>
            <select
              name="couponRole"
              className="form-control"
              value={couponData.couponRole}
              onChange={handleInputChange}
            >
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
          <div className="form-group">
            <label>중복 사용 가능 여부:</label>
            <select
              name="isDupl"
              className="form-control"
              value={couponData.isDupl}
              onChange={handleInputChange}
              required
            >
              <option value="Y">Y (가능)</option>
              <option value="N">N (불가능)</option>
            </select>
          </div>
          <div className="form-group">
            <label>시작 날짜:</label>
            <input
              type="date"
              className="form-control"
              name="couponStartDate"
              value={couponData.couponStartDate ? couponData.couponStartDate.split('T')[0] : ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>종료 날짜:</label>
            <input
              type="date"
              className="form-control"
              name="couponEndDate"
              value={couponData.couponEndDate ? couponData.couponEndDate.split('T')[0] : ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>카테고리 번호 (쉼표로 구분):</label>
            <input
              type="text"
              className="form-control"
              onChange={handleCategoryChange}
              placeholder="예: 101, 102, 103"
            />
          </div>
          <div className="form-group">
            <label>대상 제품 번호 (쉼표로 구분):</label>
            <input
              type="text"
              className="form-control"
              onChange={handleProductChange}
              placeholder="예: 101, 102, 103"
            />
          </div>
  
          <button type="submit" className="btn btn-primary">쿠폰 생성</button>
        </form>
      </div>
    );
  };
  
  export default CreateCoupon;