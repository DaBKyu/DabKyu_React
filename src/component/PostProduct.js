import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminSidebar.css"; // CSS 파일 import
import AdminSidebar from "./AdminSidebar";
import getCookie from '../GetCookie';  
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS import

const PostProduct = () => {

  const accessTokenCookie = getCookie('accessToken');

  const [allCategory1, setAllCategory1] = useState([]);
  const [allCategory2, setAllCategory2] = useState([]);
  const [allCategory3, setAllCategory3] = useState([]);

  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedMiddleCategory, setSelectedMiddleCategory] = useState('');
  const [selectedCategory3, setSelectedCategory3] = useState("");
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [productInfo, setProductInfo] = useState('');
  const [stockAmount, setStockAmount] = useState('');
  const [deliveryisFree, setDeliveryisFree] = useState('');
  const [secretYn, setSecretYn] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [productDetailImages, setProductDetailImages] = useState([]);
   // 옵션과 추가 상품 상태
   const [options, setOptions] = useState([]);
   const [relatedProducts, setRelatedProducts] = useState([]);
  const productNameRef = useRef();
  const priceRef = useRef();
  const productInfoRef = useRef();
  const stockAmountRef = useRef();
  const deliveryisFreeRef = useRef();
  const secretYnRef = useRef();
  const category3SeqnoRef = useRef();

  const navigate = useNavigate();

  
  // Fetch categories data
  useEffect(() => {
    fetch("http://localhost:8082/master/getMainCategories")
      .then(response => response.json())
      .then(data => setAllCategory1(data))
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    if (selectedMainCategory) {
      fetch(`http://localhost:8082/master/getMiddleCategories?category1Seqno=${selectedMainCategory}`)
        .then(response => response.json())
        .then(data => setAllCategory2(data))
        .catch(error => console.error("Error fetching middle categories:", error));
    } else {
      setAllCategory2([]);
    }
  }, [selectedMainCategory]);

  useEffect(() => {
    if (selectedMiddleCategory) {
      fetch(`http://localhost:8082/master/getSubCategories?category2Seqno=${selectedMiddleCategory}`)
        .then(response => response.json())
        .then(data => setAllCategory3(data))
        .catch(error => console.error("Error fetching subcategories:", error));
    } else {
      setAllCategory3([]);
    }
  }, [selectedMiddleCategory]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    console.log(files);
    if (name === 'productImages') {
        setProductImages(files);
    } else if (name === 'productDetailImages') {
        setProductDetailImages(files);
    }
};

// 옵션 추가
const handleAddOption = () => {
  setOptions([...options, { optCategory: '', optName: '', optPrice: '' }]);
};

const handleOptionChange = (index, field, value) => {
  const updatedOptions = [...options];
  updatedOptions[index][field] = value;
  setOptions(updatedOptions);
};

// 추가 상품 추가
const handleAddRelatedProduct = () => {
  setRelatedProducts([...relatedProducts, { relatedProductCategory: '', relatedProductName: '', relatedProductPrice: '' }]);
};

const handleRelatedProductChange = (index, field, value) => {
  const updatedRelatedProducts = [...relatedProducts];
  updatedRelatedProducts[index][field] = value;
  setRelatedProducts(updatedRelatedProducts);
};
  const handleRegister = async () => {
      if(productNameRef.current.value === '') { alert("제목을 입력하세요!!!"); productNameRef.current.focus(); return false;  }
      if(productInfoRef.current.value === '') { alert("내용을 입력하세요!!!"); productInfoRef.current.focus(); return false;  }
    
      let formData = new FormData();
      formData.append("productName", productNameRef.current.value);
      formData.append("price", priceRef.current.value);
      formData.append("productInfo", productInfoRef.current.value);
      formData.append("stockAmount", stockAmountRef.current.value);
      formData.append("deliveryisFree", deliveryisFreeRef.current.value);
      formData.append("secretYn", secretYnRef.current.value);
      formData.append("category3Seqno", category3SeqnoRef.current.value); 

    for (let i = 0; i < productImages.length; i++) {
        formData.append('productImages', productImages[i]);
    }
    for (let i = 0; i < productDetailImages.length; i++) {
        formData.append('productDetailImages', productDetailImages[i]);
    }

     // 옵션 추가 (각 옵션을 JSON 형식으로 변환하여 추가)
    formData.append('optionMap', JSON.stringify(options));

    // 추가 상품 추가 (각 추가 상품을 JSON 형식으로 변환하여 추가)
    formData.append('relatedProductMap', JSON.stringify(relatedProducts));

  
      await fetch("http://localhost:8082/master/postProduct", {
          method: "POST",
          headers : {"Authorization" : "Bearer " + accessTokenCookie},
          body: formData
      }).then((data)=>{
            alert('상품이 등록되었습니다.');
            navigate('/master/productList');	        	
      }).catch((error)=> { 
          alert("시스템 장애로 상품 등록이 실패했습니다.");
          console.log((error)=> console.log("error = " + error))
      });
    }
    
    const goBack = () => {
      navigate(-1);
    }

    return (
      <div className="container">
        <AdminSidebar />
        <div className="row mt-4">
          <div className="col-md-8 offset-md-2">
            <h1 className="text-center mb-4">상품 등록</h1>
  
            {/* 상품 기본 정보 */}
            <div className="mb-3">
              <label className="form-label">상품 이름:</label>
              <input type="text" className="form-control" value={productName} ref={productNameRef} onChange={(e) => setProductName(e.target.value)}  />
            </div>
            <div className="mb-3">
              <label className="form-label">가격:</label>
              <input type="number" className="form-control" value={price} ref={priceRef} onChange={(e) => setPrice(e.target.value)}  />
            </div>
            <div className="mb-3">
              <label className="form-label">상품 설명:</label>
              <input type="text" className="form-control" value={productInfo} ref={productInfoRef} onChange={(e) => setProductInfo(e.target.value)}  />
            </div>
            <div className="mb-3">
              <label className="form-label">재고수량:</label>
              <input type="number" className="form-control" value={stockAmount} ref={stockAmountRef} onChange={(e) => setStockAmount(e.target.value)}  />
            </div>
            <div className="mb-3">
              <label className="form-label">무료배송 여부:</label>
              <select className="form-select" ref={deliveryisFreeRef} value={deliveryisFree} onChange={(e) => setDeliveryisFree(e.target.value)}>
                <option value="Y">무료배송</option>
                <option value="N">유료배송</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">숨김 여부:</label>
              <select className="form-select" ref={secretYnRef} value={secretYn} onChange={(e) => setSecretYn(e.target.value)}>
                <option value="Y">숨김처리</option>
                <option value="N">표시</option>
              </select>
            </div>
  
            {/* 카테고리 선택 */}
            <div className="mb-3">
              <label className="form-label">메인 카테고리:</label>
              <select className="form-select" value={selectedMainCategory} onChange={(e) => setSelectedMainCategory(e.target.value)}>
                <option value="">선택하세요</option>
                {allCategory1.map((category) => (
                  <option key={category.category1Seqno} value={category.category1Seqno}>
                    {category.category1Name}
                  </option>
                ))}
              </select>
            </div>
  
            <div className="mb-3">
              <label className="form-label">중간 카테고리:</label>
              <select className="form-select" value={selectedMiddleCategory} onChange={(e) => setSelectedMiddleCategory(e.target.value)}>
                <option value="">선택하세요</option>
                {allCategory2.map((category) => (
                  <option key={category.category2Seqno} value={category.category2Seqno}>
                    {category.category2Name}
                  </option>
                ))}
              </select>
            </div>
  
            <div className="mb-3">
              <label className="form-label">세부 카테고리:</label>
              <select className="form-select" value={selectedCategory3} ref={category3SeqnoRef} onChange={(e) => setSelectedCategory3(e.target.value)}>
                <option value="">선택하세요</option>
                {allCategory3.map((category) => (
                  <option key={category.category3Seqno} value={category.category3Seqno}>
                    {category.category3Name}
                  </option>
                ))}
              </select>
            </div>
  
            {/* 이미지 업로드 */}
            <div className="mb-3">
              <label className="form-label">상품 이미지:</label>
              <input type="file" className="form-control" name="productImages" onChange={handleFileChange} multiple />
            </div>
            <div className="mb-3">
              <label className="form-label">상품 상세 이미지:</label>
              <input type="file" className="form-control" name="productDetailImages" onChange={handleFileChange} multiple />
            </div>
  
            {/* 옵션 추가 */}
            <div className="mb-3">
              <h3>옵션 추가</h3>
              {options.map((option, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="옵션 카테고리"
                    value={option.optCategory}
                    onChange={(e) => handleOptionChange(index, 'optCategory', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="옵션 이름"
                    value={option.optName}
                    onChange={(e) => handleOptionChange(index, 'optName', e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="옵션 가격"
                    value={option.optPrice}
                    onChange={(e) => handleOptionChange(index, 'optPrice', e.target.value)}
                  />
                </div>
              ))}
              <button className="btn btn-primary" onClick={handleAddOption}>옵션 추가</button>
            </div>
  
            {/* 추가 상품 관리 */}
            <div className="mb-3">
              <h3>추가 상품 추가</h3>
              {relatedProducts.map((product, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="추가 상품 카테고리"
                    value={product.relatedProductCategory}
                    onChange={(e) => handleRelatedProductChange(index, 'relatedProductCategory', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="추가 상품 이름"
                    value={product.relatedProductName}
                    onChange={(e) => handleRelatedProductChange(index, 'relatedProductName', e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="추가 상품 가격"
                    value={product.relatedProductPrice}
                    onChange={(e) => handleRelatedProductChange(index, 'relatedProductPrice', e.target.value)}
                  />
                </div>
              ))}
              <button className="btn btn-primary" onClick={handleAddRelatedProduct}>추가 상품 추가</button>
            </div>
  
            {/* 등록 및 취소 버튼 */}
            <div className="mt-4">
              <button className="btn btn-success me-2" onClick={handleRegister}>등록</button>
              <button className="btn btn-secondary" onClick={goBack}>취소</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default PostProduct;