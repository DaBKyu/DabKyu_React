import React, { useState, useEffect } from "react";
import ShopHeader from "./ShopHeader";
import ShopFooter from "./ShopFooter";
import '../css/main.css';

const Main = () => {
    const [product, setProduct] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await fetch('http://localhost:8082/shop/main');
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProduct(data.product);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchProducts();
      }, []);

  return (
    <div style={{paddingLeft:"200px", paddingRight:"180px", margin:"0"}}>
      <ShopHeader />
        <h2 style={{ textAlign: "center", margin: "30px 0", position: "relative" }}>
          <i className="fas fa-crown" style={{ color: "gold" }}></i> 이달의 베스트셀러 TOP 8 <i className="fas fa-crown" style={{ color: "gold" }}></i>
        </h2>
      <div style={{ display: "flex", position: "relative", width: "1525px", margin: "0 auto" }}>
        <div className="slider-container">
          <div className="movie-slider">
            {product.map(item => (
                <div key={item.productSeqno} className="movie-card">
                <a href={`/shop/view?productSeqno=${item.productSeqno}&page=1}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src={`http://localhost:8082/product/thumbnails/${item.thumbnail}`} alt={item.productName} style={{ width: '200px', height: '150px', borderRadius: '10px' }} />
                    <span style={{ fontSize: '16px' }}>{item.productName}</span><br />
                    <span style={{ lineHeight: '2', fontSize: '19px', fontWeight: 'bold', color: 'rgb(40, 123, 248)' }}>
                    {new Intl.NumberFormat().format(item.price)}원
                    </span><br />
                    <span style={{ fontSize: '14px', padding: '2px 5px', border: '1px solid #d8a10b', borderRadius: '50px' }}>
                    {new Intl.NumberFormat().format(Math.round(item.price * 0.02))} 포인트 적립
                    </span>
                </a>
                </div>
            ))}
          </div>
        </div>
        <div className="ad-banner">
          <h1>상품을 구매하여</h1>
          <p>등급을 높이고 <br /> 포인트를 적립 받아보세요!</p>
          <a href="/mypage/myGrade" className="cta-button">지금 확인하기</a>
          <img src="https://via.placeholder.com/230x400" alt="광고 이미지" />
        </div>
      </div>
      <ShopFooter />
    </div>
  );
};

export default Main;
