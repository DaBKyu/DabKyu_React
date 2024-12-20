import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminSidebar from "./AdminSidebar"; // AdminSidebar 컴포넌트 import
import "../css/AdminSidebar.css"; // CSS 파일 import

function CouponDetail() {
    const { couponSeqno } = useParams(); // URL 파라미터에서 productSeqno를 추출
    const [couponDetail, setCouponDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (couponSeqno) {
            const couponSeqnoNum = Number(couponSeqno);

            if (!isNaN(couponSeqnoNum)) {
                fetch(`http://localhost:8082/master/couponDetail/${couponSeqnoNum}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('네트워크 응답이 좋지 않습니다.');
                        }
                        return response.json();
                    })
                    .then((data) => {
                        if (data) {
                            setCouponDetail(data.coupons);
                        } else {
                            throw new Error('잘못된 데이터 형식입니다.');
                        }
                        setLoading(false);
                    })
                    .catch((err) => {
                        setError(err.message);
                        setLoading(false);
                    });
            } else {
                setError('잘못된 couponSeqno 값입니다.');
                setLoading(false);
            }
        }
    }, [couponSeqno]);

    if (loading) {
        return <div className="text-center my-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center my-5 text-danger">Error: {error}</div>;
    }

    const { coupon, categories, targets } = couponDetail;

    return (
        <div className="container my-5">
            <AdminSidebar />
            <h1 className="mb-4 text-center">쿠폰 상세 정보</h1>

            <div className="card mb-4">
                <div className="card-header bg-primary text-white">쿠폰 정보</div>
                <div className="card-body">
                    <p><strong>쿠폰 번호:</strong> {coupon.couponSeqno}</p>
                    <p><strong>쿠폰 이름:</strong> {coupon.couponName}</p>
                    <p><strong>쿠폰 타입:</strong> {coupon.couponType}</p>
                    <p><strong>쿠폰 정보:</strong> {coupon.couponInfo}</p>
                    <p><strong>할인 금액:</strong> {coupon.amountDiscount}원</p>
                    <p><strong>최소 주문 금액:</strong> {coupon.minOrder}원</p>
                    <p><strong>적용 등급:</strong> {coupon.couponRole}</p>
                    <p><strong>중복 사용 가능 여부:</strong> {coupon.isDupl}</p>
                    <p><strong>쿠폰 코드:</strong> {coupon.couponCode}</p>
                    <p><strong>시작 날짜:</strong> {new Date(coupon.couponStartDate).toLocaleDateString()}</p>
                    <p><strong>종료 날짜:</strong> {new Date(coupon.couponEndDate).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header bg-secondary text-white">카테고리 정보</div>
                <div className="card-body">
                    {categories.length > 0 ? (
                        categories.map((category, index) => (
                            <div key={index} className="mb-3 border-bottom pb-2">
                                <p><strong>카테고리 이름:</strong> {category.category3Seqno.category3Name}</p>
                                <p><strong>상위 카테고리 이름:</strong> {category.category3Seqno.category2Seqno.category2Name}</p>
                                <p><strong>최상위 카테고리 이름:</strong> {category.category3Seqno.category2Seqno.category1Seqno.category1Name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted">카테고리 정보가 없습니다.</p>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="card-header bg-success text-white">대상 제품 정보</div>
                <div className="card-body">
                  {targets.length > 0 ? (
                    targets.map((target, index) => (
                        <div key={index} className="mb-3 border-bottom pb-2">
                            <p><strong>제품 이름:</strong> {target.productSeqno.productName}</p>
                            <p><strong>제품 설명:</strong> {target.productSeqno.productInfo}</p>
                            <p><strong>가격:</strong> {target.productSeqno.price}원</p>
                            <p><strong>재고:</strong> {target.productSeqno.stockAmount}</p>
                            <p><strong>무료 배송 여부:</strong> {target.productSeqno.deliveryisFree === 'Y' ? '무료배송' : '유료배송'}</p>
                        </div>
                    ))
                   ) : (
                    <p className="text-muted">제품 정보가 없습니다.</p>
                    )}

                </div>
            </div>
        </div>
    );
}

export default CouponDetail;
