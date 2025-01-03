import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminSidebar from './AdminSidebar';

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

const ReportDetailPage = () => {
  const [report, setReport] = useState(null);
  const [reviewFiles, setReviewFiles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processStatus, setProcessStatus] = useState(null);  // 상태 업데이트를 위한 변수

  const { reportSeqno } = useParams();

  useEffect(() => {
    const fetchReportDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8082/master/reportDetail/${reportSeqno}`);
        if (!response.ok) {
          throw new Error('Failed to fetch report detail');
        }
        const data = await response.json();
        setReport(data.reportDetail.report);
        setReviewFiles(data.reportDetail.reviewFiles);
        setProcessStatus(data.reportDetail.report.processStatus); // 초기 상태 값 설정
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchReportDetail();
  }, [reportSeqno]);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setProcessStatus(newStatus);  // 상태 업데이트

    try {
      const response = await fetch(`http://localhost:8082/master/updateReportProcess/${reportSeqno}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ processStatus: newStatus }),  // 서버에 상태 변경 전달
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">리뷰 신고 상세 페이지</h2>
      <AdminSidebar />
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">신고 정보</h5>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th scope="row">신고 제목</th>
                <td>{report.reportTitle}</td>
              </tr>
              <tr>
                <th scope="row">신고 내용</th>
                <td>{report.reportContent}</td>
              </tr>
              <tr>
                <th scope="row">신고 요약</th>
                <td>{report.reportSummary}</td>
              </tr>
              <tr>
                <th scope="row">신고 날짜</th>
                <td>{new Date(report.reportDate).toLocaleString()}</td>
              </tr>
              <tr>
                <th scope="row">신고 처리 상태</th>
                <td>
                  <select 
                    value={processStatus} 
                    onChange={handleStatusChange} 
                    className="form-select"
                  >
                    <option value="N">미처리</option>
                    <option value="Y">처리 완료</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h3 className="mt-4">리뷰 상세</h3>
      <div className="card mb-4">
        <div className="card-body">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th scope="row">리뷰 내용</th>
                <td>{report.reviewSeqno.revContent}</td>
              </tr>
              <tr>
                <th scope="row">첨부 파일</th>
                <td>
                  {reviewFiles.length > 0 ? (
                    <div>
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
                </td>
              </tr>
              <tr>
                <th scope="row">리뷰 날짜</th>
                <td>{new Date(report.reviewSeqno.revDate).toLocaleString()}</td>
              </tr>
              <tr>
                <th scope="row">평점</th>
                <td><Rating rating={report.reviewSeqno.rate} /> </td>
              </tr>
              <tr>
                <th scope="row">좋아요</th>
                <td>👍 {report.reviewSeqno.likecnt}</td>
              </tr>
              <tr>
                <th scope="row">리뷰 작성자 이메일</th>
                <td>{report.reviewSeqno.email.email}</td>
              </tr>
              <tr>
                <th scope="row">리뷰 작성자 이름</th>
                <td>{report.reviewSeqno.email.username}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h3>신고자 정보</h3>
      <div className="card mb-4">
        <div className="card-body">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th scope="row">이메일</th>
                <td>{report.email.email}</td>
              </tr>
              <tr>
                <th scope="row">이름</th>
                <td>{report.email.username}</td>
              </tr>
              <tr>
                <th scope="row">회원 등급</th>
                <td>{report.email.memberGrade}</td>
              </tr>
              <tr>
                <th scope="row">회원 역할</th>
                <td>{report.email.role}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;
