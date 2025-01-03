import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from "./AdminSidebar"; // AdminSidebar 컴포넌트 import
import "../../css/AdminSidebar.css"; // CSS 파일 import
import 'bootstrap/dist/css/bootstrap.min.css';  // 부트스트랩 CSS 추가

const MemberDetail = () => {
    const { email } = useParams(); // URL에서 email 추출
    const navigate = useNavigate();  // 페이지 리디렉션을 위한 navigate 훅
    const [memberData, setMemberData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newGrade, setNewGrade] = useState("");  // 새로운 등급 상태 추가
    const [gradeUpdated, setGradeUpdated] = useState(false);  // 등급 수정 완료 상태 추가
    const [isUpdating, setIsUpdating] = useState(false);  // 등급 수정 요청 중 상태
    const [newActive, setNewActive] = useState("");  // 새로운 등급 상태 추가
    const [activeUpdated, setActiveUpdated] = useState(false);  // 등급 수정 완료 상태 추가

    // API 호출을 위한 useEffect 훅
    useEffect(() => {
        const fetchMemberData = async () => {
            try {
                const response = await fetch(`http://localhost:8082/master/memberDetail/${email}`);
                const data = await response.json();
                setMemberData(data.member.member);
                setNewGrade(data.member.member.memberGrade);  // 기존 등급 설정
                setNewActive(data.member.member.isActive);  // 기존 활성화 상태 설정
            } catch (error) {
                console.error("회원 정보를 가져오는 데 실패했습니다:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMemberData();
    }, [email]);

    // 회원 등급 수정 함수
    const updateMemberGrade = async () => {
        setIsUpdating(true);  // 수정 요청 시작
        try {
            const response = await fetch(`http://localhost:8082/master/updateGrade/${email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ memberGrade: newGrade }),  // 수정할 등급
            });
    
            if (response.ok) {
                const data = await response.text();  // 응답을 JSON이 아닌 텍스트로 받기
                alert(data);  // 응답 메시지를 그대로 알림으로 표시
                setGradeUpdated(true);
            } else {
                const errorData = await response.text();  // 오류 메시지를 텍스트로 처리
                alert(errorData);
            }
        } catch (error) {
            console.error("등급 수정에 실패했습니다:", error);
            alert("등급 수정 중 오류가 발생했습니다.");
        } finally {
            setIsUpdating(false);  // 수정 요청 종료
        }
    };
    
    // 회원 활성화 여부 수정 함수
    const updateMemberActive = async () => {
        setIsUpdating(true);  // 수정 요청 시작
        try {
            const response = await fetch(`http://localhost:8082/master/changeMemberActive/${email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive: newActive }),  // 수정할 활성화 여부
            });
    
            if (response.ok) {
                const data = await response.text();  // 응답을 텍스트로 받기
                alert(data);  // 응답 메시지를 그대로 알림으로 표시
                setActiveUpdated(true);
            } else {
                const errorData = await response.text();  // 오류 메시지를 텍스트로 처리
                alert(errorData);
            }
        } catch (error) {
            console.error("활성화 여부 수정에 실패했습니다:", error);
            alert("활성화 여부 수정 중 오류가 발생했습니다.");
        } finally {
            setIsUpdating(false);  // 수정 요청 종료
        }
    };
    
    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!memberData) {
        return <div>회원 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="container mt-4">
            <AdminSidebar />
            <h1 className="mb-4">회원 상세 페이지</h1>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <td><strong>이메일</strong></td>
                            <td>{memberData.email}</td>
                        </tr>
                        <tr>
                            <td><strong>전화번호</strong></td>
                            <td>{memberData.telno}</td>
                        </tr>
                        <tr>
                            <td><strong>이름</strong></td>
                            <td>{memberData.username}</td>
                        </tr>
                        <tr>
                            <td><strong>성별</strong></td>
                            <td>{memberData.gender}</td>
                        </tr>
                        <tr>
                            <td><strong>생년월일</strong></td>
                            <td>{memberData.birthDate}</td>
                        </tr>
                        <tr>
                            <td><strong>회원 등급</strong></td>
                            <td>
                                <select 
                                    className="form-select" 
                                    value={newGrade} 
                                    onChange={(e) => setNewGrade(e.target.value)}
                                >
                                    <option value="BRONZE">BRONZE</option>
                                    <option value="SILVER">SILVER</option>
                                    <option value="GOLD">GOLD</option>
                                    <option value="PLATINUM">PLATINUM</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>결제 정보</strong></td>
                            <td>{memberData.pay ? memberData.pay : "없음"}</td>
                        </tr>
                        <tr>
                            <td><strong>가입일</strong></td>
                            <td>{new Date(memberData.regdate).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td><strong>최근 로그인</strong></td>
                            <td>{new Date(memberData.lastloginDate).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td><strong>활성화 상태</strong></td>
                            <td>
                                <select 
                                    className="form-select" 
                                    value={newActive} 
                                    onChange={(e) => setNewActive(e.target.value)}
                                >
                                    <option value="Y">활성화</option>
                                    <option value="N">비활성화</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>알림 수신 여부</strong></td>
                            <td>{memberData.notificationYn === "Y" ? "예" : "아니오"}</td>
                        </tr>
                        <tr>
                            <td><strong>이메일 수신 여부</strong></td>
                            <td>{memberData.emailRecept === "Y" ? "예" : "아니오"}</td>
                        </tr>
                        <tr>
                            <td><strong>포인트</strong></td>
                            <td>{memberData.point}</td>
                        </tr>
                        <tr>
                            <td><strong>총 구매 금액</strong></td>
                            <td>{memberData.totalPvalue}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-between">
                <button 
                    className="btn btn-primary" 
                    onClick={updateMemberGrade} 
                    disabled={isUpdating}
                >
                    {isUpdating ? "수정 중..." : "회원 등급 수정"}
                </button>
                {gradeUpdated && <p className="text-success">등급 수정이 완료되었습니다.</p>}
                <button 
                    className="btn btn-warning" 
                    onClick={updateMemberActive} 
                    disabled={isUpdating}
                >
                    {isUpdating ? "수정 중..." : "회원 활성화 여부 수정"}
                </button>
                {activeUpdated && <p className="text-success">활성화 여부 수정이 완료되었습니다.</p>}
            </div>
        </div>
    );
};

export default MemberDetail;