import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminSidebar from './AdminSidebar';
import { useNavigate } from 'react-router-dom';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:8082/master/reportList');
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      setReports(data.reports);
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the reports!", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.reportTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? report.processStatus === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">리뷰 신고 관리</h1>
      <AdminSidebar />

      {/* 검색 및 필터 UI */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="신고 제목 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">처리 상태 필터</option>
            <option value="N">미처리</option>
            <option value="Y">처리 완료</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
      <table className="table table-striped table-hover">
          <thead className="table-dark">
          <tr>
            <th>리뷰 내용</th>
            <th>리뷰 신고 제목</th>
            <th>리뷰 신고 내용</th>
            <th>신고 날짜</th>
            <th>처리 상태</th>
          </tr>
        </thead>
        <tbody>
          {currentReports.map((report) => (
            <tr key={report.reportSeqno}
            onClick={() => navigate(`/master/reportDetail/${report.reportSeqno}`)}
            style={{ cursor: 'pointer' }}>
              <td>{report.reviewSeqno.revContent}</td>
              <td>{report.reportTitle}</td>
              <td>{report.reportContent}</td>
              <td>{new Date(report.reportDate).toLocaleString()}</td>
              <td>
                <span
                  className={`badge ${
                    report.processStatus === 'N' ? 'bg-warning' : 'bg-success'
                  }`}
                >
                  {report.processStatus === 'N' ? '미처리' : '처리 완료'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <Pagination
        reportsPerPage={reportsPerPage}
        totalReports={filteredReports.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

const Pagination = ({ reportsPerPage, totalReports, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalReports / reportsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {pageNumbers.map((number) => (
          <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ReportList;
