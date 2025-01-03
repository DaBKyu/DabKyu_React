import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("title");
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [itemsPerPage] = useState(10); // 페이지당 항목 수
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:8082/master/questionList");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data.questions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter((question) => {
    if (filterBy === "title") {
      return question.queTitle.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filterBy === "content") {
      return question.queContent.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filterBy === "email") {
      return question.email?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filterBy === "productName") {
      return question.productSeqno?.productName?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // 페이징 처리
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQuestions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">문의 관리</h1>
      <AdminSidebar />

      {/* 검색 필터 */}
      <div className="d-flex mb-3">
        <select
          className="form-select me-2"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
        >
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="productName">제품 이름</option>
          <option value="email">회원 이메일</option>
        </select>
        <input
          type="text"
          className="form-control"
          placeholder="검색어 입력"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>내용</th>
            <th>제품 이름</th>
            <th>회원 이메일</th>
            <th>문의 날짜</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((question) => (
            <tr
              key={question.queSeqno}
              onClick={() => navigate(`/master/questionDetail/${question.queSeqno}`)}
              style={{ cursor: "pointer" }}
            >
              <td>{question.queSeqno}</td>
              <td>{question.queTitle}</td>
              <td>{question.queContent}</td>
              <td>{question.productSeqno?.productName || "N/A"}</td>
              <td>{question.email?.email || "N/A"}</td>
              <td>{new Date(question.queDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index + 1}
              className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
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

export default QuestionList;
