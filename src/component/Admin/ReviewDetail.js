import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 스타일 시트 추가
import AdminSidebar from "./AdminSidebar";
import "../../css/ReviewDetail.css"; 

// 별을 표시하는 Rating 컴포넌트
const Rating = ({ rating }) => {
  const fullStars = Math.floor(rating); // 전체 별 개수 (소수점 버림)
  const emptyStars = 5 - fullStars; // 빈 별 개수

  return (
    <div>
      {'⭐'.repeat(fullStars)} {/* 전체 별 */}
      {'☆'.repeat(emptyStars)} {/* 빈 별 */}
    </div>
  );
};

const ReviewDetail = () => {
  const { reviewSeqno } = useParams();
  const [reviewDetail, setReviewDetail] = useState(null);

  useEffect(() => {
    // Fetch review detail data
    const fetchReviewDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8082/master/reviewDetail/${reviewSeqno}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReviewDetail(data.reviewDetail);
      } catch (error) {
        console.error("Error fetching review detail:", error);
      }
    };

    fetchReviewDetail();
  }, [reviewSeqno]);

  const deleteReview = async () => {
    // 삭제 확인 창
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:8082/master/reviewDelete/${reviewSeqno}`, {
          method: 'DELETE', // DELETE 메서드 사용
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        alert(data.message); // 성공 메시지 표시
        // 삭제 후 리뷰 목록 페이지로 리다이렉트하거나 다른 동작을 추가할 수 있음
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("리뷰 삭제 중 오류가 발생했습니다.");
      }
    }
  };
  
  if (!reviewDetail) {
    return <div className="text-center">Loading...</div>;
  }

  const { review, report, reviewFiles } = reviewDetail;

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">리뷰 상세 페이지</h1>
      <AdminSidebar />

      {/* 리뷰 정보 */}
      <div className="row mb-4">
        <div className="col-md-12">
          <h2>리뷰 정보</h2>
          <div className="mb-3 p-4" style={{ backgroundColor: '#f8f9fa !important', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <p><strong>작성자:</strong> {review.email.username}</p>
            <p><strong>제품 이름:</strong> {review.productSeqno.productName}</p>
            <p><strong>리뷰 내용:</strong> {review.revContent}</p>

            {/* 첨부파일 */}
            {reviewFiles.length > 0 ? (
              <div>
                <p><strong>첨부파일:</strong></p>
                <div className="row">
                  {reviewFiles.map((file) => (
                    <div key={file.reviewFileSeqno} className="col-md-3 mb-2">
                      <img 
                        src={`http://localhost:8082/question/images/${file.storedFilename}`} 
                        alt={file.orgFilename} 
                        className="img-fluid" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>첨부파일이 없습니다.</p>
            )}

            <p><strong>작성일:</strong> {new Date(review.revDate).toLocaleString()}</p>
            <p><strong>별점:</strong> <Rating rating={review.rate} /> {/* 평점 별로 표시 */}</p>
            <p><strong>좋아요:</strong> 👍 {review.likecnt}</p>

            {/* 삭제 버튼 */}
            <div>
              <button className="btn btn-danger" onClick={deleteReview}>리뷰 삭제</button>
            </div>
          </div>
        </div>
      </div>

      {/* 신고 정보 */}
      <div className="row">
        <div className="col-md-12">
          <h2>신고 정보</h2>
          <div className="mb-3 p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            {report.length > 0 ? (
              report.map((r) => (
                <div key={r.reportSeqno} className="alert alert-warning">
                  <h5 className="alert-heading">{r.reportTitle}</h5>
                  <p><strong>신고 내용:</strong> {r.reportContent}</p>
                  <p><strong>신고 요약:</strong> {r.reportSummary}</p>
                  <p><strong>신고일:</strong> {new Date(r.reportDate).toLocaleString()}</p>
                  <p><strong>처리 상태:</strong> 
                    <span className={`badge ${r.processStatus === 'N' ? 'bg-danger' : 'bg-success'}`}>
                      {r.processStatus === "N" ? "처리전" : "처리완료"}
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <p>신고 정보가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
