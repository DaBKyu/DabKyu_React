import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Form, Button } from 'react-bootstrap';
import "../../css/QuestionDetail.css"; // CSS 파일 import
import AdminSidebar from "./AdminSidebar";

function QuestionDetailPage() {
  const { queSeqno } = useParams();
  const [questionDetail, setQuestionDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState(""); // 답변 입력 상태
  const [replyLoading, setReplyLoading] = useState(false); // 답변 제출 중 상태
  const [editingReply, setEditingReply] = useState(null); // 수정할 답변 상태
  const [editedReplyContent, setEditedReplyContent] = useState(""); // 수정된 답변 내용

  // 질문 상세 데이터 요청
  const fetchQuestionDetail = async () => {
    try {
      const response = await fetch(`http://localhost:8082/master/questionDetail/${queSeqno}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setQuestionDetail(data.questionDetail);
    } catch (error) {
      console.error("Failed to fetch question detail:", error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 질문 상세 데이터 요청
  useEffect(() => {
    fetchQuestionDetail();
  }, [queSeqno]);

  // 답변 입력 상태 업데이트
  const handleReplyChange = (e) => {
    setNewReply(e.target.value);
  };

  // 답변 수정 입력 상태 업데이트
  const handleEditedReplyChange = (e) => {
    setEditedReplyContent(e.target.value);
  };

  // 답변 제출
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (newReply.trim() === "") return; // 빈 답변은 제출하지 않음

    setReplyLoading(true);

    try {
      const response = await fetch("http://localhost:8082/master/registerReply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionSeqno: queSeqno,
          comContent: newReply, // 새 답변 내용
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit reply: ${response.status}`);
      }

      // 답변 제출 후 상태 초기화
      setNewReply(""); // 입력창 비우기
      setReplyLoading(false);

      // 질문과 답변 데이터 다시 받아오기
      fetchQuestionDetail(); // 질문 상세 데이터 다시 요청
    } catch (error) {
      console.error("Failed to submit reply:", error);
      setReplyLoading(false);
    }
  };

  // 답변 수정
  const handleEditReply = (replySeqno, currentContent) => {
    setEditingReply(replySeqno); // 수정할 답변을 상태에 저장
    setEditedReplyContent(currentContent); // 기존 답변 내용을 텍스트 영역에 설정
  };

  // 수정된 답변 저장
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editedReplyContent.trim() === "") return;

    try {
      const response = await fetch(`http://localhost:8082/master/replyUpdate/${editingReply}`, {
        method: "PUT", // PUT 메서드 사용
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comContent: editedReplyContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update reply: ${response.status}`);
      }

      setEditingReply(null); // 수정 상태 초기화
      setEditedReplyContent(""); // 텍스트 영역 비우기

      // 질문과 답변 데이터 다시 받아오기
      fetchQuestionDetail();
    } catch (error) {
      console.error("Failed to update reply:", error);
    }
  };

  // 답변 삭제
  const handleDeleteReply = async (replySeqno) => {
    // 삭제 확인 창
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:8082/master/replyDelete/${replySeqno}`, {
          method: "DELETE", // DELETE 메서드 사용
        });

        if (!response.ok) {
          throw new Error(`Failed to delete reply: ${response.status}`);
        }

        // 질문과 답변 데이터 다시 받아오기
        fetchQuestionDetail();
      } catch (error) {
        console.error("Failed to delete reply:", error);
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </Container>
    );
  }

  if (!questionDetail) {
    return (
      <Container className="my-5">
        <Alert variant="danger">문의 상세 데이터를 불러오는 데 실패했습니다.</Alert>
      </Container>
    );
  }

  const { question, questionFiles, questionComments } = questionDetail;

  // 답변을 최신순으로 정렬
  const sortedComments = questionComments.sort((a, b) => new Date(b.comDate) - new Date(a.comDate));

  return (
    <Container className="my-5">
      <Row>
        <Col md={12}>
          <h1 className="mb-4">문의 상세 페이지</h1>
        </Col>
      </Row>
      <AdminSidebar />
      <Row>
        <Col md={12}>
          <div className="bubble question-bubble">
            <p><strong>제목:</strong> {question.queTitle}</p>
            <p><strong>내용:</strong> {question.queContent}</p>
            <p><strong>작성일:</strong> {new Date(question.queDate).toLocaleString()}</p>
            <p><strong>작성자:</strong> {question.email.username} ({question.email.email})</p>
            <p><strong>상품명:</strong> {question.productSeqno.productName}</p>
            {/* 첨부파일 출력 */}
            {questionFiles.length > 0 ? (
              <div>
                <p><strong>첨부파일:</strong></p>
                {questionFiles.map((file) => (
                  <div key={file.questionFileSeqno}>
                    <img 
                      src={`http://localhost:8082/question/images/${file.storedFilename}`} 
                      alt={file.orgFilename} 
                      style={{ maxWidth: '100%', marginBottom: '10px' }} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>첨부파일이 없습니다.</p>
            )}
          </div>
        </Col>
      </Row>

      {/* 답변 목록 - 최신순으로 정렬된 답변 표시 */}
      <Row>
        <Col md={12}>
          {sortedComments.length > 0 ? (
            sortedComments.map((comment, index) => (
              <div key={comment.questionCommentSeqno} className="mb-4">
                <div className="bubble answer-bubble">
                  <p><strong>답변 {index + 1}:</strong> 
                    {editingReply === comment.questionCommentSeqno ? (
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={editedReplyContent}
                        onChange={handleEditedReplyChange}
                      />
                    ) : (
                      comment.comContent
                    )}
                  </p>
                  <p><strong>작성일:</strong> {new Date(comment.comDate).toLocaleString()}</p>
                  <div>
                    {editingReply === comment.questionCommentSeqno ? (
                      <Button onClick={handleEditSubmit} variant="success">수정 완료</Button>
                    ) : (
                      <Button onClick={() => handleEditReply(comment.questionCommentSeqno, comment.comContent)} variant="warning">수정</Button>
                    )}
                    <Button onClick={() => handleDeleteReply(comment.questionCommentSeqno)} variant="danger" className="ml-2">삭제</Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Alert variant="info">아직 답변이 등록되지 않았습니다.</Alert>
          )}
        </Col>
      </Row>

      {/* 답변 입력 폼 */}
      <Row>
        <Col md={12}>
          <h3 className="mb-4">답변 작성</h3>
          <Form onSubmit={handleReplySubmit}>
            <Form.Group controlId="replyContent">
              <Form.Control
                as="textarea"
                rows={4}
                value={newReply}
                onChange={handleReplyChange}
                placeholder="답변을 작성하세요"
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={replyLoading}>
              {replyLoading ? "답변 제출 중..." : "답변 제출"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default QuestionDetailPage;
