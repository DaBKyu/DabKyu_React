import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminSidebar from "./AdminSidebar";

const MailDetail = () => {
  const [emailDetail, setEmailDetail] = useState(null);
  const [error, setError] = useState(null);
  const { emailSeqno } = useParams();

  useEffect(() => {
    const fetchEmailDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8082/master/mailDetail/${emailSeqno}`);
        if (!response.ok) {
          throw new Error("네트워크 응답에 문제가 있습니다.");
        }
        const data = await response.json();
        setEmailDetail(data.emailDetail);
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchEmailDetail();
  }, [emailSeqno]);

  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!emailDetail) return <div className="text-center mt-5">로딩 중...</div>;

  const { email, emailFiles } = emailDetail;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">📧 메일 상세 내용</h1>
      <AdminSidebar />
      
      {/* 메일 정보 카드 */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">메일 정보</h2>
        </div>
        <div className="card-body">
          <h4 className="card-title">
            <strong>제목:</strong> {email.emailTitle}
          </h4>
          <p className="card-text">
            <strong>내용:</strong> {email.emailContent}
          </p>
          <p className="card-text text-muted">
            <strong>전송 날짜:</strong> {new Date(email.emailSendDate).toLocaleString()}
          </p>
        </div>
      </div>

      {/* 첨부파일 섹션 */}
      <div className="mb-4">
        <h3 className="mb-3">📎 첨부파일</h3>
        {emailFiles && emailFiles.length > 0 ? (
          <div className="row g-4">
            {emailFiles.map((file) => (
              <div key={file.emailfileSeqno} className="col-md-4 col-sm-6">
                <div className="card shadow-sm">
                  <img
                    src={`http://localhost:8082/mail/images/${file.storedFilename}`}
                    alt={file.orgFilename}
                    className="card-img-top"
                    style={{
                      height: "300px", // 카드 안의 이미지 최대 높이
                      objectFit: "contain", // 이미지 전체를 보여줌
                      backgroundColor: "#f8f9fa", // 배경 색상으로 여백 표시
                    }}
                  />
                  <div className="card-body text-center">
                    <p className="card-text">{file.orgFilename}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted">첨부파일이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default MailDetail;
