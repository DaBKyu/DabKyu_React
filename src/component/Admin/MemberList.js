import React, { useEffect, useState } from 'react';
import { Table, Pagination, Container, Row, Col, Form } from 'react-bootstrap';
import AdminSidebar from "./AdminSidebar"; // AdminSidebar 컴포넌트 import
import "../../css/AdminSidebar.css"; // CSS 파일 import
import { useNavigate } from 'react-router-dom';

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [emailSearch, setEmailSearch] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // 서버에서 회원 목록을 가져오는 API 호출
        fetch('http://localhost:8082/master/memberList')
            .then(response => response.json())
            .then(data => {
                setMembers(data.members);  // 받아온 회원 데이터 저장
                setFilteredMembers(data.members);  // 필터링된 회원 목록 초기화
                setTotalPages(Math.ceil(data.members.length / 10));  // 페이지 수 계산
                setLoading(false);  // 데이터 로딩 완료
            })
            .catch(error => {
                console.error('회원 데이터를 가져오는 중 오류가 발생했습니다:', error);
                setLoading(false);  // 오류 발생시에도 로딩 종료 처리
            });
    }, []);  // 컴포넌트가 처음 렌더링될 때만 호출

    useEffect(() => {
        // 이메일 검색 또는 회원 등급이 변경될 때마다 필터링
        let filtered = members;

        if (emailSearch) {
            filtered = filtered.filter(member =>
                member.email.toLowerCase().includes(emailSearch.toLowerCase())
            );
        }

        if (selectedGrade) {
            filtered = filtered.filter(member =>
                member.memberGrade === selectedGrade
            );
        }

        setFilteredMembers(filtered);
        setTotalPages(Math.ceil(filtered.length / 10));  // 필터링 후 페이지 수 업데이트
        setCurrentPage(1);  // 필터링 후 첫 페이지로 이동
    }, [emailSearch, selectedGrade, members]);  // emailSearch, selectedGrade 또는 members가 변경될 때마다 실행

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearchChange = (e) => {
        setEmailSearch(e.target.value);
    };

    const handleGradeChange = (e) => {
        setSelectedGrade(e.target.value);
    };

    if (loading) {
        return <div>로딩 중...</div>;  // 로딩 중일 때 표시할 내용
    }

    // 현재 페이지에 맞는 회원 목록을 슬라이싱
    const membersToShow = filteredMembers.slice((currentPage - 1) * 10, currentPage * 10);

    return (
        <Container>
            <AdminSidebar />
            <h1 className="my-4">회원 목록</h1>

            {/* 검색창 및 드롭다운 */}
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Control
                        type="text"
                        placeholder="이메일로 검색"
                        value={emailSearch}
                        onChange={handleSearchChange}
                    />
                </Col>
                <Col md={4}>
                    <Form.Control as="select" value={selectedGrade} onChange={handleGradeChange}>
                        <option value="">모든 회원 등급</option>
                        <option value="Platinum">Platinum</option>
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                        <option value="Bronze">Bronze</option>
                    </Form.Control>
                </Col>
            </Row>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>이메일</th>
                        <th>이름</th>
                        <th>전화번호</th>
                        <th>성별</th>
                        <th>생년월일</th>
                        <th>회원 등급</th>
                        <th>포인트</th>
                        <th>가입일</th>
                    </tr>
                </thead>
                <tbody>
                    {membersToShow.map((member, index) => (
                        <tr key={index}>
                            <td onClick={() => navigate(`/master/memberDetail/${member.email}`)} style={{ cursor: 'pointer' }}>{member.email}</td>
                            <td>{member.username}</td>
                            <td>{member.telno}</td>
                            <td>{member.gender}</td>
                            <td>{new Date(member.birthDate).toLocaleDateString()}</td>
                            <td>{member.memberGrade}</td>
                            <td>{member.point}</td>
                            <td>{new Date(member.regdate).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* 페이징 */}
            <Row className="justify-content-center">
                <Col xs="auto">
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        />
                    </Pagination>
                </Col>
            </Row>
        </Container>
    );
};

export default MemberList;
