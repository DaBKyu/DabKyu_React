import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";

const SendMailPage = () => {
    const [category3SeqnoList, setCategory3SeqnoList] = useState([]);
    const [productSeqnoList, setProductSeqnoList] = useState([]);
    const [mailFileList, setMailFileList] = useState([]);
    const [kind, setKind] = useState("c"); 
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [couponSeqnoList, setCouponSeqnoList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);  // 로딩 상태 추가

    const handleFileChange = (e) => {
        setMailFileList(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsLoading(true);  // 메일 발송 시작 시 로딩 상태 true로 설정
    
        const formData = new FormData();
        formData.append("kind", kind);
        formData.append("title", title);
        formData.append("content", content);
        
        // 배열을 바로 append할 때는 JSON.stringify 없이도 처리할 수 있습니다.
        if (category3SeqnoList.length > 0) {
            category3SeqnoList.forEach(item => formData.append("category3SeqnoList[]", item));
        }
        if (productSeqnoList.length > 0) {
            productSeqnoList.forEach(item => formData.append("productSeqnoList[]", item));
        }
        if (couponSeqnoList.length > 0) {
            couponSeqnoList.forEach(item => formData.append("couponSeqnoList[]", item));
        }
        for (let file of mailFileList) {
            formData.append("mailFileList", file);
        }
    
        try {
            const response = await fetch("http://localhost:8082/master/sendMail", {
                method: "POST",
                body: formData,
            });
    
            if (response.ok) {
                const result = await response.text(); // 서버에서 텍스트 응답 받기
                alert(result); // 서버에서 받은 메시지를 알림으로 표시
            } else {
                console.error("메일 발송 실패", response);
                alert("메일 발송에 실패했습니다.");
            }
        } catch (error) {
            console.error("메일 발송 중 오류 발생", error);
            alert("메일 발송에 실패했습니다.");
        } finally {
            setIsLoading(false); // 로딩 완료 후 로딩 상태 false로 설정
        }
    };

    const handleSeqnoInputChange = (e, setter) => {
        const value = e.target.value.split(',').map(item => item.trim()); // 쉼표로 구분된 문자열을 배열로 변환
        setter(value); 
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">메일 발송</h1>
            <AdminSidebar />
            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="mb-3">
                    <label htmlFor="kind" className="form-label">메일 대상</label>
                    <select
                        id="kind"
                        className="form-select"
                        value={kind}
                        onChange={(e) => setKind(e.target.value)}
                        required
                    >
                        <option value="c">카테고리 관심 멤버</option>
                        <option value="t">찜 상품 멤버</option>
                        <option value="r">구매 후 2년 경과 멤버</option>
                        <option value="o">최근 1년 구매 이력 없는 멤버</option>
                        <option value="all">전체 멤버</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="title" className="form-label">제목</label>
                    <input
                        id="title"
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="content" className="form-label">내용</label>
                    <textarea
                        id="content"
                        className="form-control"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>

                {/* 조건에 따라 카테고리, 상품 번호, 쿠폰 번호 입력 필드 동적으로 표시 */}
                {kind === "c" && (
                    <div className="mb-3">
                        <label htmlFor="category3SeqnoList" className="form-label">카테고리 번호</label>
                        <input
                            id="category3SeqnoList"
                            type="text"
                            className="form-control"
                            //value={category3SeqnoList.join(", ")}
                            onChange={(e) =>
                                handleSeqnoInputChange(e, setCategory3SeqnoList)
                            }
                            placeholder="쉼표로 구분하여 번호 입력"
                        />
                    </div>
                )}

                {kind === "t" && (
                    <div className="mb-3">
                        <label htmlFor="productSeqnoList" className="form-label">상품 번호</label>
                        <input
                            id="productSeqnoList"
                            type="text"
                            className="form-control"
                            //value={productSeqnoList.join(", ")}
                            onChange={(e) =>
                                handleSeqnoInputChange(e, setProductSeqnoList)
                            }
                            placeholder="쉼표로 구분하여 번호 입력"
                        />
                    </div>
                )}

                {kind === "o" && (
                    <div className="mb-3">
                        <label htmlFor="couponSeqnoList" className="form-label">쿠폰 번호</label>
                        <input
                            id="couponSeqnoList"
                            type="text"
                            className="form-control"
                            //value={couponSeqnoList.join(", ")}
                            onChange={(e) =>
                                handleSeqnoInputChange(e, setCouponSeqnoList)
                            }
                            placeholder="쉼표로 구분하여 번호 입력"
                        />
                    </div>
                )}

                <div className="mb-3">
                    <label htmlFor="mailFileList" className="form-label">첨부파일</label>
                    <input
                        id="mailFileList"
                        type="file"
                        className="form-control"
                        multiple
                        onChange={handleFileChange}
                    />
                </div>
                <div className="d-grid gap-2">
                    {isLoading ? (
                        <button type="button" className="btn btn-primary" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            메일 발송 중...
                        </button>
                    ) : (
                        <button type="submit" className="btn btn-primary">메일 발송</button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SendMailPage;
