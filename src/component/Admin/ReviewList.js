import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:8082/master/reviewList');
        if (!response.ok) {
          throw new Error('리뷰 데이터를 가져오는 중 문제가 발생했습니다.');
        }
        const data = await response.json();

        // 최신순으로 정렬
        const sortedReviews = data.reviews.sort(
          (a, b) => b.reviewSeqno - a.reviewSeqno
        );

        setReviews(sortedReviews); // 정렬된 데이터 설정
        setFilteredReviews(sortedReviews); // 검색 및 필터링용 데이터 초기화
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // 평점을 별로 변환하는 함수
  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // 상품명 검색 필터링
  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    const filtered = reviews.filter((review) =>
      review.productSeqno.productName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredReviews(filtered);
    setCurrentPage(1); // 검색 시 페이지를 첫 페이지로 초기화
  };

  // 페이징 처리
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="text-center my-5">로딩 중...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">리뷰 관리</h1>
      <AdminSidebar />
      {/* 검색창 */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="상품명을 입력하세요..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>리뷰 번호</th>
              <th>회원 이메일</th>
              <th>상품명</th>
              <th>리뷰 내용</th>
              <th>별점</th>
              <th>좋아요</th>
              <th>등록 날짜</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.map((review) => (
              <tr key={review.reviewSeqno}
              onClick={() => navigate(`/master/reviewDetail/${review.reviewSeqno}`)}
            style={{ cursor: 'pointer' }}>
                <td>{review.reviewSeqno}</td>
                <td>{review.email.email}</td>
                <td>{review.productSeqno.productName}</td>
                <td>{review.revContent}</td>
                <td style={{ color: 'gold', fontSize: '1.2em' }}>
                  {renderStars(review.rate)}
                </td>
                <td>
                <td style={{ fontSize: '1.2em'}}>
                  👍 {review.likecnt}
              </td>
                </td>
                <td>{new Date(review.revDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이징 버튼 */}
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from(
            { length: Math.ceil(filteredReviews.length / reviewsPerPage) },
            (_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            )
          )}
        </ul>
      </nav>
    </div>
  );
};

export default ReviewList;
