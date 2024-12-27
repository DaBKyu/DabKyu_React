import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "../../css/AdminSidebar.css"; // CSS 파일 import
import "bootstrap/dist/css/bootstrap.min.css";
import AdminSidebar from "./AdminSidebar";
import getCookie from '../../GetCookie';

const UpdateCoupon = () => {
    const { couponSeqno } = useParams(); // URL에서 couponSeqno 추출

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
    couponCode: "",  // couponCode 추가
  });

  const [category3Seqnos, setCategory3Seqnos] = useState([]);
  const [productSeqnos, setProductSeqnos] = useState([]);
  const navigate = useNavigate();

  // 쿠폰 수정 시 기존 값 불러오기
  useEffect(() => {
    const fetchCouponData = async () => {
      try {
        const response = await fetch(`http://localhost:8082/master/couponDetail/${couponSeqno}`);
        const data = await response.json();
        const coupon = data.coupons.coupon; // 쿠폰 데이터
        const categories = data.coupons.categories || []; // 카테고리 데이터
        const targets = data.coupons.targets || []; // 타겟 데이터

        setCouponData({
          couponName: coupon.couponName,
          couponType: coupon.couponType,
          couponInfo: coupon.couponInfo,
          percentDiscount: coupon.percentDiscount,
          amountDiscount: coupon.amountDiscount,
          minOrder: coupon.minOrder,
          couponRole: coupon.couponRole,
          isDupl: coupon.isDupl,
          couponStartDate: coupon.couponStartDate,
          couponEndDate: coupon.couponEndDate,
          couponCode: coupon.couponCode, // 기존 쿠폰 코드 값 설정
        });

        // 카테고리 번호를 배열로 설정
        setCategory3Seqnos(categories.map((category) => category.category3Seqno.category3Seqno));
        // 제품 번호는 빈 배열로 설정 (추후 변경 필요)
        setProductSeqnos(targets.map((target) => target.productSeqno.productSeqno));

      } catch (error) {
        console.error("쿠폰 정보를 불러오는 중 오류 발생:", error);
        alert("쿠폰 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchCouponData();
  }, [couponSeqno]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "couponStartDate" || name === "couponEndDate") {
      const date = new Date(value);
      const formattedDate = date.toISOString();
      setCouponData({ ...couponData, [name]: formattedDate });
    } else {
      setCouponData({ ...couponData, [name]: value });
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value.split(',').map(item => item.trim()); // 쉼표로 구분된 문자열을 배열로 변환
    setCategory3Seqnos(value);  // 배열로 상태 업데이트
  };
  
  const handleProductChange = (e) => {
    const value = e.target.value.split(',').map(item => item.trim()); // 쉼표로 구분된 문자열을 배열로 변환
    setProductSeqnos(value);  // 배열로 상태 업데이트
  };
  

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 쿼리 파라미터로 데이터를 설정
    const queryParams = new URLSearchParams();
    if (category3Seqnos) {
        category3Seqnos.forEach(seqno => queryParams.append("category3Seqnos", seqno));
    }
    if (productSeqnos) {
        productSeqnos.forEach(seqno => queryParams.append("productSeqnos", seqno));
    }

    const requestBody = {
        ...couponData,
        couponSeqno,
    };

    console.log(requestBody); // 요청 본문을 콘솔에 출력해 확인

    try {
      const response = await fetch(`http://localhost:8082/master/updateCoupon?${queryParams.toString()}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.text();
        alert(result);
      // 쿠폰 수정 후 쿠폰 상세 페이지로 이동
      navigate(`/master/couponDetail/${couponSeqno}`);
      } else {
        alert("쿠폰 수정 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
      alert("쿠폰 수정 중 오류가 발생했습니다.");
    }
  };

  const goBack = () => {
    navigate(-1);
  }

  return (
    <div className="container mt-5">
      <AdminSidebar />
      <h2>쿠폰 수정</h2>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>쿠폰 코드:</label>
        <input
            type="text"
            className="form-control"
            name="couponCode"
            value={couponData.couponCode} // 쿠폰 코드 값을 표시
            readOnly // 수정할 수 없도록 설정
        />
        </div>
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
        value={category3Seqnos}  // 상태에서 바로 가져옵니다.
        onChange={handleCategoryChange}  // 입력값을 바로 업데이트
        placeholder="예: 101, 102, 103"
    />
</div>

<div className="form-group">
    <label>대상 제품 번호 (쉼표로 구분):</label>
    <input
        type="text"
        className="form-control"
        value={productSeqnos}  // 상태에서 바로 가져옵니다.
        onChange={handleProductChange}  // 입력값을 바로 업데이트
        placeholder="예: 101, 102, 103"
    />
</div>


        <button type="submit" className="btn btn-primary">쿠폰 수정</button>
        <button className="btn btn-secondary" onClick={goBack}>취소</button>
      </form>
    </div>
  );
};

export default UpdateCoupon;
