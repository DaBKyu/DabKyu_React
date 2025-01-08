import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminSidebar from './AdminSidebar';
import { useNavigate } from 'react-router-dom';

const MailList = () => {
  const [mails, setMails] = useState([]);
  const [filteredMails, setFilteredMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
  const mailsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMails = async () => {
      try {
        const response = await fetch('http://localhost:8082/master/mailList');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // 번호(emailSeqno)를 기준으로 내림차순 정렬
        const sortedMails = data.mails.sort((a, b) => b.emailSeqno - a.emailSeqno);
        setMails(sortedMails);
        setFilteredMails(sortedMails); // 초기 필터링된 메일은 전체 메일로 설정
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, []);

  // 제목으로 이메일 필터링하는 함수
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchTerm(query);

    const filtered = mails.filter(mail =>
      mail.emailTitle.toLowerCase().includes(query.toLowerCase()) // 제목에 검색어가 포함된 이메일만 필터링
    );
    setFilteredMails(filtered);
    setCurrentPage(1); // 검색 후 첫 페이지로 이동
  };

  // 현재 페이지에서 보여줄 이메일 데이터 계산
  const indexOfLastMail = currentPage * mailsPerPage;
  const indexOfFirstMail = indexOfLastMail - mailsPerPage;
  const currentMails = filteredMails.slice(indexOfFirstMail, indexOfLastMail);

  // 페이지 변경 핸들러
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center mt-5">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">이메일 발송 내역</h1>
      <AdminSidebar />

      <div className="mb-4 d-flex justify-content-end">
  <div>
    <button className="btn btn-primary"
   onClick={() => navigate('/master/sendMail')}>
      이메일 발송하기
    </button>
  </div>
</div>

      {/* 제목으로 검색할 수 있는 입력 필드 추가 */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="제목으로 검색"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th scope="col">번호</th>
            <th scope="col">제목</th>
            <th scope="col">내용</th>
            <th scope="col">발송 날짜</th>
          </tr>
        </thead>
        <tbody>
          {currentMails.map((mail) => (
            <tr key={mail.emailSeqno} onClick={() => navigate(`/master/mailDetail/${mail.emailSeqno}`)} style={{ cursor: 'pointer' }}>
              <td>{mail.emailSeqno}</td>
              <td>{mail.emailTitle}</td>
              <td>{mail.emailContent}</td>
              <td>{new Date(mail.emailSendDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이징 */}
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: Math.ceil(filteredMails.length / mailsPerPage) }, (_, index) => (
            <li
              key={index + 1}
              className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
            >
              <button className="page-link" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MailList;
