import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/AdminSidebar.css"; // CSS 파일 import
import React, { useState, useEffect } from 'react';
import AdminSidebar from "./AdminSidebar"; // AdminSidebar 컴포넌트 import
import { Spinner, Alert, Card, Col, Row, Button } from 'react-bootstrap'; // Pagination과 Form 추가
import { useParams, useNavigate } from 'react-router-dom'; 

function ProductList() {
  const { productSeqno } = useParams(); // URL 파라미터에서 productSeqno를 추출
  const [productview, setProductview] = useState([]);
  const [productfileview, setProductfileview] = useState([]);
  const [productinfofileview, setProductinfofileview] = useState([]);
  const [optionview, setOptionview] = useState([]);
  const [relatedproductview, setRelatedproductview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // productSeqno가 존재할 때만 API 호출
  useEffect(() => {
    if (productSeqno) {
      // 숫자 형식으로 변환
      const productSeqnoNum = Number(productSeqno);
      
      // productSeqno가 숫자 형식으로 변환된 값이 유효한 경우에만 API 호출
      if (!isNaN(productSeqnoNum)) {
        fetch(`http://localhost:8082/master/productDetail/${productSeqnoNum}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('네트워크 응답이 좋지 않습니다.');
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);  // 응답 데이터 확인
            if (data) {
              setProductview(data.productview || {});
              setProductfileview(data.productfileview || []);
              setProductinfofileview(data.productinfofileview || []);
              setOptionview(data.optionview || []);
              setRelatedproductview(data.relatedproductview || []);
            } else {
              throw new Error('잘못된 데이터 형식입니다.');
            }
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
      } else {
        setError('잘못된 productSeqno 값입니다.');
        setLoading(false);
      }
    }
  }, [productSeqno]); // productSeqno가 변경될 때마다 실행

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center">
        <Alert variant="danger">{`에러 발생: ${error}`}</Alert>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <AdminSidebar />
      

      <Row className="mt-4">
      <h1 className="mb-4 text-center">상품 상세 정보</h1>
        {/* 상품 정보 */}
        <button 
                        onClick={() => navigate(`/master/updateProduct/${productview.productSeqno}`)} 
                        className="btn btn-warning mt-3 float-end">
                        상품 수정</button>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>{productview.productName}</Card.Title>
              <Card.Text>{productview.productInfo}</Card.Text>
              <p>가격: {productview.price?.toLocaleString()} 원</p>
              <p>재고 수량: {productview.stockAmount}</p>
              <p>{productview.deliveryisFree === 'Y' ? '무료 배송' : '배송비 부과'}</p>
              <p>찜 개수: {productview.likecnt}</p>
              <p>{productview.secretYn === 'Y' ? '판매 중지' : '판매 중'}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        {/* 카테고리 정보 */}
        <Col md={12}>
          <Card>
            <Card.Body>
              <h5>카테고리</h5>
              <p>메인 카테고리: {productview.category3Seqno?.category2Seqno?.category1Seqno?.category1Name || '카테고리1 정보 없음'}</p>
              <p>중간 카테고리: {productview.category3Seqno?.category2Seqno?.category2Name || '카테고리2 정보 없음'}</p>
              <p>세부 카테고리: {productview.category3Seqno?.category3Name || '카테고리3 정보 없음'}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        {/* 상품 이미지 */}
        <Col md={12}>
          <h5>상품 이미지</h5>
          {productfileview.length > 0 ? (
            productfileview.map((file) => (
              <Card key={file.productFileSeqno} className="mb-4">
                <Card.Body>
                  <img 
                    src={`http://localhost:8082/product/thumbnails/${file.storedFilename}`} 
                    alt={file.orgFilename} 
                    style={{ maxWidth: '100%' }} 
                  />
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>상품 이미지가 없습니다.</p>
          )}
        </Col>
      </Row>

      <Row className="mt-4">
        {/* 상품 설명 이미지 */}
        <h5>상품 설명 이미지</h5>
        <Col md={12}>
          <Card>
            <Card.Body>
             
              {productinfofileview.length > 0 ? (
                productinfofileview.map((file) => (
                  <div key={file.productInfoFileSeqno}>
                    
                    <img 
                      src={`http://localhost:8082/product/images/${file.storedFilename}`} 
                      alt={file.orgFilename} 
                      style={{ maxWidth: '100%' }} 
                    />
                  </div>
                ))
              ) : (
                <p>상품 설명 이미지가 없습니다.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        {/* 옵션 정보 */}
        <Col md={12}>
          <h5>옵션 정보</h5>
          {optionview.length > 0 ? (
            optionview.map((option, index) => (
              <Card key={index} className="mb-4">
                <Card.Body>
                  <p>옵션 카테고리: {option.optCategory || '없습니다'}</p>
                  <p>옵션 이름: {option.optName || '없습니다'}</p>
                  <p>옵션 가격: {option.optPrice ? `${option.optPrice}원` : '없습니다'}</p>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>옵션 정보가 없습니다.</p>
          )}
        </Col>
      </Row>

      <Row className="mt-4">
        {/* 추가 상품 정보 */}
        <Col md={12}>
          <h5>추가 상품</h5>
          {relatedproductview.length > 0 ? (
            relatedproductview.map((relatedProduct, index) => (
              <Card key={index} className="mb-4">
                <Card.Body>
                  <p>추가 상품 카테고리: {relatedProduct.relatedproductCategory || '없습니다'}</p>
                  <p>추가 상품 이름: {relatedProduct.relatedproductName || '없습니다'}</p>
                  <p>추가 상품 가격: {relatedProduct.relatedproductPrice ? `${relatedProduct.relatedproductPrice}원` : '없습니다'}</p>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>추가 상품 정보가 없습니다.</p>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default ProductList;
