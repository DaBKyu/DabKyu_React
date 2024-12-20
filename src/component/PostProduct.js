import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminSidebar.css"; // CSS 파일 import
import AdminSidebar from "./AdminSidebar";
import getCookie from '../GetCookie';  

const PostProduct = () => {

  const accessTokenCookie = getCookie('accessToken');
  const [optionMap, setOptionMap] = useState([]);
  const [relatedProductMap, setRelatedProductMap] = useState([]);

  // 옵션 추가
  const addOption = () => {
    setOptionMap([
      ...optionMap,
      { id: Date.now(), optCategory: "", optName: "", optPrice: "" }  // 고유 id 추가
    ]);
  };

  // 옵션 삭제
  const removeOption = (index) => {
    const updatedFields = optionMap.filter((_, idx) => idx !== index);
    setOptionMap(updatedFields);
  };

  // 옵션 필드 업데이트
  const updateOptionField = (index, field, value) => {
    const updatedFields = [...optionMap];
    updatedFields[index][field] = value;
    setOptionMap(updatedFields);
  };

  // 추가 상품 추가
  const addRelatedProduct = () => {
    setRelatedProductMap([
      ...relatedProductMap,
      { id: Date.now(), relatedproductCategory: "", relatedproductName: "", relatedproductPrice: "" }  // 고유 id 추가
    ]);
  };

  // 추가 상품 삭제
  const removeRelatedProduct = (index) => {
    const updatedFields = relatedProductMap.filter((_, idx) => idx !== index);
    setRelatedProductMap(updatedFields);
  };

  // 추가 상품 필드 업데이트
  const updateRelatedProductField = (index, field, value) => {
    const updatedFields = [...relatedProductMap];
    updatedFields[index][field] = value;
    setRelatedProductMap(updatedFields);
  };

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
    <div>
      <AdminSidebar />
      <div style={{ marginLeft: "500px" }}>
          <h1>상품 등록</h1>

          {/* 상품 기본 정보 */}
          <div>
            <label>상품 이름:</label>
            <input type="text" className="productName" value={productName} ref={productNameRef} onChange={(e) => setProductName(e.target.value)}  />
            <label>가격:</label>
            <input type="number" className="price" value={price} ref={priceRef} onChange={(e) => setPrice(e.target.value)}  />
            <label>상품 설명:</label>
            <input type="text" className="productInfo" value={productInfo} ref={productInfoRef} onChange={(e) => setProductInfo(e.target.value)}  />
            <label>재고수량:</label>
            <input type="number" className="stockAmount" value={stockAmount} ref={stockAmountRef} onChange={(e) => setStockAmount(e.target.value)}  />
            <label>무료배송 여부:</label>
            <select ref={deliveryisFreeRef} value={deliveryisFree} onChange={(e) => setDeliveryisFree(e.target.value)} >
              <option value="Y">무료배송</option>
              <option value="N">유료배송</option>
            </select>
            <label>숨김 여부:</label>
            <select ref={secretYnRef} value={secretYn} onChange={(e) => setSecretYn(e.target.value)} >
              <option value="Y">숨김처리</option>
              <option value="N">표시</option>
            </select>
          </div>

          {/* 카테고리 선택 */}
          <div>
            <label>메인 카테고리:</label>
            <select   
              value={selectedMainCategory}
              onChange={(e) => setSelectedMainCategory(e.target.value)}
            >
              <option value="">선택하세요</option>
              {allCategory1.map((category) => (
                <option key={category.category1Seqno} value={category.category1Seqno}>
                  {category.category1Name}
                </option>
              ))}
            </select>

            <label>중간 카테고리:</label>
            <select
              value={selectedMiddleCategory}
              onChange={(e) => setSelectedMiddleCategory(e.target.value)}
            >
              <option value="">선택하세요</option>
              {allCategory2.map((category) => (
                <option key={category.category2Seqno} value={category.category2Seqno}>
                  {category.category2Name}
                </option>
              ))}
            </select>

            <label>세부 카테고리:</label>
            <select 
             value={selectedCategory3}
             ref={category3SeqnoRef}
             onChange={(e) => setSelectedCategory3(e.target.value)}
            >
              <option value="">선택하세요</option>
              {allCategory3.map((category) => (
                <option key={category.category3Seqno} value={category.category3Seqno}>
                  {category.category3Name}
                </option>
              ))}
            </select>
          </div>

          {/* 옵션 추가 */}
          <div>
            <h2>옵션</h2>
            {optionMap.map((field, index) => (
              <div key={field.id}>  {/* 고유 id 사용 */}
                <input
                  placeholder="옵션 카테고리"
                  value={field.optCategory}
                  onChange={(e) => updateOptionField(index, "optCategory", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="가격"
                  value={field.optPrice}
                  onChange={(e) => updateOptionField(index, "optPrice", e.target.value)}
                />
                <button type="button" onClick={() => removeOption(index)}>
                  삭제
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addOption()}>
              옵션 추가
            </button>
          </div>

          {/* 추가 상품 */}
          <h2>추가 상품</h2>
          {relatedProductMap.map((field, index) => (
            <div key={field.id}>  {/* 고유 id 사용 */}
              <input
                placeholder="추가 상품 카테고리"
                value={field.relatedproductCategory}
                onChange={(e) => updateRelatedProductField(index, "relatedproductCategory", e.target.value)}
              />
              <input
                placeholder="상품명"
                value={field.relatedproductName}
                onChange={(e) => updateRelatedProductField(index, "relatedproductName", e.target.value)}
              />
              <button type="button" onClick={() => removeRelatedProduct(index)}>
                삭제
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addRelatedProduct()}>
            추가 상품 추가
          </button>

          <div>
            <label>상품 이미지</label>
            <input
                type="file"
                name="productImages"
                onChange={handleFileChange}
                multiple
            />
          </div>
          <div>
            <label>상품 상세 이미지</label>
            <input
                type="file"
                name="productDetailImages"
                onChange={handleFileChange}
                multiple
            />
          </div>
          <input type="button" className="btn_write" value="등록" onClick={handleRegister} />
          <input type="button" className="btn_cancel" value="취소" onClick={goBack} />
      </div>
    </div>
  );
};

export default PostProduct;
