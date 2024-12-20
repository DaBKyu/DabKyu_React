import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // 부트스트랩 스타일 가져오기
import AdminSidebar from "./AdminSidebar"; // AdminSidebar 컴포넌트 import
import "../css/AdminSidebar.css"; // CSS 파일 import

const CouponDistributionPage = () => {
  const [formData, setFormData] = useState({
    couponSeqno: "",
    isAllMembers: false,
    memberGrade: "",
    isBirthday: false,
    isNewMember: false,
    isFirstOrderMember: false,
    isNoOrdersLastYearMember: false,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 쿠폰 번호를 숫자로 변환
    const couponSeqno = Number(formData.couponSeqno);
    if (isNaN(couponSeqno)) {
      setMessage("쿠폰 번호는 유효한 숫자여야 합니다.");
      return;
    }

    // formData 객체를 x-www-form-urlencoded 형식으로 변환
    const formBody = new URLSearchParams({
      couponSeqno: couponSeqno.toString(),
      isAllMembers: formData.isAllMembers ? 'true' : 'false',
      memberGrade: formData.memberGrade,
      isBirthday: formData.isBirthday ? 'true' : 'false',
      isNewMember: formData.isNewMember ? 'true' : 'false',
      isFirstOrderMember: formData.isFirstOrderMember ? 'true' : 'false',
      isNoOrdersLastYearMember: formData.isNoOrdersLastYearMember ? 'true' : 'false',
    });

    try {
      const response = await fetch("http://localhost:8082/master/distributionCoupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody, // x-www-form-urlencoded 형식으로 전송
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data); // 성공 메시지 처리
        alert("쿠폰 배포에 성공했습니다."); // 성공 시 알림
      } else {
        throw new Error("쿠폰 배포 중 오류가 발생했습니다.");
      }
    } catch (error) {
      setMessage(error.message || "쿠폰 배포 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container mt-5" >
      <AdminSidebar />
      <h1 className="text-center mb-4">쿠폰 배포 페이지</h1>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
        <div className="mb-3">
          <label className="form-label">쿠폰 번호:</label>
          <input
            type="number"
            name="couponSeqno"
            className="form-control"
            value={formData.couponSeqno}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            name="isAllMembers"
            className="form-check-input"
            checked={formData.isAllMembers}
            onChange={handleChange}
          />
          <label className="form-check-label">모든 회원</label>
        </div>

        <div className="mb-3">
          <label className="form-label">회원 등급:</label>
          <select
            name="memberGrade"
            className="form-select"
            value={formData.memberGrade}
            onChange={handleChange}
            required
          >
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            name="isBirthday"
            className="form-check-input"
            checked={formData.isBirthday}
            onChange={handleChange}
          />
          <label className="form-check-label">생일인 회원</label>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            name="isNewMember"
            className="form-check-input"
            checked={formData.isNewMember}
            onChange={handleChange}
          />
          <label className="form-check-label">신규 회원</label>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            name="isFirstOrderMember"
            className="form-check-input"
            checked={formData.isFirstOrderMember}
            onChange={handleChange}
          />
          <label className="form-check-label">첫 주문 회원</label>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            name="isNoOrdersLastYearMember"
            className="form-check-input"
            checked={formData.isNoOrdersLastYearMember}
            onChange={handleChange}
          />
          <label className="form-check-label">1년간 주문 없는 회원</label>
        </div>

        <button type="submit" className="btn btn-primary w-100">쿠폰 배포</button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default CouponDistributionPage;
