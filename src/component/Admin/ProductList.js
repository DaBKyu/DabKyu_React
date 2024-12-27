import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from 'react';
import AdminSidebar from "./AdminSidebar"; // AdminSidebar 컴포넌트 import
import { Spinner, Alert, Card, Col, Row, Button, Pagination, Form } from 'react-bootstrap'; // Pagination과 Form 추가
import { useNavigate } from 'react-router-dom';
import "../../css/AdminSidebar.css"; // CSS 파일 import

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');  // 검색어 상태 추가
  const [selectedCategory, setSelectedCategory] = useState('');  // 선택된 카테고리 상태 추가
  const productsPerPage = 20; // 한 페이지에 보여줄 제품 수 20으로 변경
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8082/master/allProducts')
      .then((response) => {
        if (!response.ok) {
          throw new Error('네트워크 응답이 좋지 않습니다.');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);  // 응답 데이터 확인
        if (Array.isArray(data.product)) {
          setProducts(data.product);
        } else {
          throw new Error('잘못된 데이터 형식입니다.');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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

  // 카테고리 목록 추출 (중복을 제거하기 위해 Set 사용)
  const categoryList = [...new Set(products.map(product => product.category3Seqno.category3Name))];

  // 검색어로 필터링된 상품들만 선택
  const filteredProducts = products.filter(product => 
    product.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === '' || product.category3Seqno.category3Name === selectedCategory)  // 선택된 카테고리에 맞는 상품만 필터링
  );

  // 현재 페이지에 해당하는 제품들만 선택
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // 전체 페이지 개수
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // 페이지 번호 범위 계산 (현재 페이지를 기준으로 앞뒤로 5개씩 표시)
  const pageRange = 5; // 한 번에 보여줄 페이지 번호의 개수
  const rangeStart = Math.max(currentPage - pageRange, 1);
  const rangeEnd = Math.min(currentPage + pageRange, totalPages);

  // 페이지 전환 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 검색어 변경 함수
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);  // 검색어 변경 시 첫 페이지로 이동
  };

  // 카테고리 선택 함수
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);  // 카테고리 변경 시 첫 페이지로 이동
  };

  return (
    <div className="container">
      <Row className="g-0" style={{ marginLeft: '-450px' }}>
        <Col md={3} style={{ paddingRight: '0' }}>  {/* 사이드바와의 여백 조정 */}
          <AdminSidebar />
        </Col>
        <Col md={9} style={{ paddingLeft: '0' }}>  {/* 상품 리스트와의 여백 조정 */}
          <h1 className="my-4">상품 관리</h1>
          
          {/* 상품 검색과 카테고리 드롭다운을 나란히 배치 */}
          <Row className="mb-4">
            <Col xs={8} md={10}>
              <Form.Control
                type="text"
                placeholder="상품 이름으로 검색..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Col>
            <Col xs={4} md={2}>
              <Form.Select
                aria-label="카테고리 선택"
                value={selectedCategory}
                onChange={handleCategoryChange}
                size="sm"  // 드롭다운 크기 줄이기
              >
                <option value="">전체 카테고리</option>
                {categoryList.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          {/* 상품 등록 버튼 */}
          <Button variant="success" onClick={() => navigate(`/master/postProduct`)} className="mb-3">
            상품 등록
          </Button>


          {filteredProducts.length === 0 ? (
            <Alert variant="warning">검색된 제품이 없습니다.</Alert>
          ) : (
            <>
              <Row xs={1} sm={2} md={3} lg={4} className="g-4" >
                {currentProducts.map((product) => (
                  <Col key={product.productSeqno}>
                    <Card className="shadow-sm" style={{ height: '380px' }}>
                      <Card.Img
                        variant="top"
                        src={`http://localhost:8082/product/thumbnails/${product.thumbnail}`}
                        alt={product.productName}
                        style={{ height: '150px', objectFit: 'cover' }}
                      />
                      <Card.Body style={{ padding: '10px', overflow: 'hidden' }}>
                      <Card.Title style={{ fontSize: '1rem', width: '100%', height: 'auto', wordWrap: 'break-word' }}>
                        {product.productName}
                      </Card.Title>
                        <Card.Text style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
                          <strong>{product.price.toLocaleString()} 원</strong>
                        </Card.Text>
                        <Card.Text style={{ fontSize: '0.8rem', marginBottom: '5px' }}>
                          카테고리: {product.category3Seqno.category3Name}
                        </Card.Text>
                        <Card.Text style={{ fontSize: '0.8rem', marginBottom: '5px' }}>재고: {product.stockAmount}</Card.Text>
                        <Card.Text style={{ fontSize: '0.8rem', marginBottom: '5px' }}>
                          무료배송: {product.deliveryisFree === 'Y' ? 'Y' : 'N'}
                        </Card.Text>
                        <Card.Text style={{ fontSize: '0.8rem', marginBottom: '5px' }}>
                          숨김여부: {product.secretYn === 'Y' ? 'Y' : 'N'}
                        </Card.Text>
                        <Card.Text style={{ fontSize: '0.8rem', marginBottom: '5px' }}>
                          찜개수: {product.likecnt}
                        </Card.Text>
                        <Button variant="primary" className="w-100" size="sm" onClick={() => navigate(`/master/productDetail/${product.productSeqno}`)}>
                          상세 보기
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* 페이지 네비게이션 */}
              <div className="d-flex justify-content-center my-3">
                <Pagination>
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                  />
                  {[...Array(rangeEnd - rangeStart + 1)].map((_, index) => (
                    <Pagination.Item
                      key={rangeStart + index}
                      active={rangeStart + index === currentPage}
                      onClick={() => handlePageChange(rangeStart + index)}
                    >
                      {rangeStart + index}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default ProductList;
