import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import getCookie from "../../GetCookie";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/AdminSidebar.css";

const UpdateProduct = () => {
  const { productSeqno } = useParams(); // URL에서 productSeqno 가져오기
  const navigate = useNavigate();
  const accessTokenCookie = getCookie("accessToken");

  const [allCategory1, setAllCategory1] = useState([]);
  const [allCategory2, setAllCategory2] = useState([]);
  const [allCategory3, setAllCategory3] = useState([]);

  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedMiddleCategory, setSelectedMiddleCategory] = useState("");
  const [selectedCategory3, setSelectedCategory3] = useState("");

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [productInfo, setProductInfo] = useState("");
  const [stockAmount, setStockAmount] = useState("");
  const [deliveryisFree, setDeliveryisFree] = useState("");
  const [secretYn, setSecretYn] = useState("");

  const [productImages, setProductImages] = useState([]);
  const [newProductImages, setNewProductImages] = useState([]);
  const [productDetailImages, setProductDetailImages] = useState([]);
  const [newProductDetailImages, setNewProductDetailImages] = useState([]);

  const [options, setOptions] = useState([]);
  const [deleteOptionSeqnos, setDeleteOptionSeqnos] = useState([]); // 삭제할 옵션 Seqno 저장
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [deleteRelatedProductSeqnos, setDeleteRelatedProductSeqnos] = useState([]); // 삭제할 관련 상품 Seqno 저장

  useEffect(() => {
    fetch(`http://localhost:8082/master/productDetail/${productSeqno}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // 이 부분을 추가하여 데이터 구조 확인
        setProductName(data.productview.productName);
        setPrice(data.productview.price);
        setProductInfo(data.productview.productInfo);
        setStockAmount(data.productview.stockAmount);
        setDeliveryisFree(data.productview.deliveryisFree);
        setSecretYn(data.productview.secretYn);
  
        // 카테고리 처리
        setSelectedMainCategory(data.productview.category3Seqno.category2Seqno.category1Seqno.category1Name);
        setSelectedMiddleCategory(data.productview.category3Seqno.category2Seqno.category2Name);
        setSelectedCategory3(data.productview.category3Seqno.category3Name);
  
        // 이미지 처리
        setProductImages(data.productfileview.map((file) => file.storedFilename));
        setProductDetailImages(data.productinfofileview.map((file) => file.storedFilename));  
  
        // 옵션 및 관련 상품 처리
        setOptions(data.optionview.map((option) => ({
          optSeqno: option.optionSeqno,
          optCategory: option.optCategory,
          optName: option.optName,
          optPrice: option.optPrice
        })));
  
        setRelatedProducts(data.relatedproductview.map((relatedProduct) => ({
          relatedProductSeqno: relatedProduct.relatedProductSeqno,
          relatedProductCategory: relatedProduct.relatedproductCategory,
          relatedProductName: relatedProduct.relatedproductName,
          relatedProductPrice: relatedProduct.relatedproductPrice
        })));
      })
      .catch((error) => console.error("Error fetching product details:", error));
  }, [productSeqno]);
  

  useEffect(() => {
    // Fetch categories
    fetch("http://localhost:8082/master/getMainCategories")
      .then((response) => response.json())
      .then((data) => {
        console.log("Main Categories: ", data); // 카테고리 데이터 출력 확인
        setAllCategory1(data); 
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    if (selectedMainCategory) {
      fetch(`http://localhost:8082/master/getMiddleCategories?category1Seqno=${selectedMainCategory}`)
        .then((response) => response.json())
        .then((data) => setAllCategory2(data))
        .catch((error) => console.error("Error fetching middle categories:", error));
    } else {
      setAllCategory2([]);
    }
  }, [selectedMainCategory]);

  useEffect(() => {
    if (selectedMiddleCategory) {
      fetch(`http://localhost:8082/master/getSubCategories?category2Seqno=${selectedMiddleCategory}`)
        .then((response) => response.json())
        .then((data) => setAllCategory3(data))
        .catch((error) => console.error("Error fetching subcategories:", error));
    } else {
      setAllCategory3([]);
    }
  }, [selectedMiddleCategory]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "newProductImages") {
      setNewProductImages([...files]);
    } else if (name === "newProductDetailImages") {
      setNewProductDetailImages([...files]);
    }
  };

  const handleRemoveImage = (index, type) => {
    if (type === "product") {
      setProductImages(productImages.filter((_, i) => i !== index));
    } else if (type === "detail") {
      setProductDetailImages(productDetailImages.filter((_, i) => i !== index));
    }
  };

  const handleAddOption = () => {
    setOptions([...options, { optCategory: "", optName: "", optPrice: "" }]);
  };


  
  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = value;
    setOptions(updatedOptions);
  };

  const handleAddRelatedProduct = () => {
    setRelatedProducts([...relatedProducts, { relatedProductCategory: "", relatedProductName: "", relatedProductPrice: "" }]);
  };

  const handleRelatedProductChange = (index, field, value) => {
    const updatedRelatedProducts = [...relatedProducts];
    updatedRelatedProducts[index][field] = value;
    setRelatedProducts(updatedRelatedProducts);
  };
    // 옵션 삭제 핸들러
    const handleRemoveOption = (optionSeqno) => {
        setOptions(options.filter(option => option.optSeqno !== optionSeqno)); // 화면에서 삭제
        setDeleteOptionSeqnos([...deleteOptionSeqnos, optionSeqno]); // 삭제할 옵션 Seqno 추가
    };

    // 관련 상품 삭제 핸들러
    const handleRemoveRelatedProduct = (relatedProductSeqno) => {
        setRelatedProducts(relatedProducts.filter(product => product.relatedProductSeqno !== relatedProductSeqno)); // 화면에서 삭제
        setDeleteRelatedProductSeqnos([...deleteRelatedProductSeqnos, relatedProductSeqno]); // 삭제할 관련 상품 Seqno 추가
    };

  const handleUpdate = async () => {
    let formData = new FormData();
    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("productInfo", productInfo);
    formData.append("stockAmount", stockAmount);
    formData.append("deliveryisFree", deliveryisFree);
    formData.append("secretYn", secretYn);
    formData.append("category3Seqno", selectedCategory3);

    productImages.forEach((image, i) => {
      formData.append(`existingProductImages[${i}]`, image);
    });

    newProductImages.forEach((image) => {
      formData.append("newProductImages", image);
    });

    productDetailImages.forEach((image, i) => {
      formData.append(`existingProductDetailImages[${i}]`, image);
    });

    newProductDetailImages.forEach((image) => {
      formData.append("newProductDetailImages", image);
    });

    // 삭제할 옵션 Seqno 추가
    formData.append('deleteOptionSeqnos', JSON.stringify(deleteOptionSeqnos));
        
    // 삭제할 관련 상품 Seqno 추가
    formData.append('deleteRelatedProductSeqnos', JSON.stringify(deleteRelatedProductSeqnos));

    formData.append("optionMap", JSON.stringify(options));
    formData.append("relatedProductMap", JSON.stringify(relatedProducts));

    await fetch(`http://localhost:8082/master/updateProduct/${productSeqno}`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + accessTokenCookie },
      body: formData,
    })
      .then(() => {
        alert("상품이 수정되었습니다.");
        navigate("/master/productList");
      })
      .catch((error) => {
        alert("시스템 장애로 상품 수정이 실패했습니다.");
        console.error("Error updating product:", error);
      });
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <AdminSidebar />
      <div className="row mt-4">
        <div className="col-md-8 offset-md-2">
          <h1 className="text-center mb-4">상품 수정</h1>

          <div className="mb-3">
            <label className="form-label">상품 이름:</label>
            <input
              type="text"
              className="form-control"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">가격:</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">상품 설명:</label>
            <textarea
              className="form-control"
              value={productInfo}
              onChange={(e) => setProductInfo(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">재고 수량:</label>
            <input
              type="number"
              className="form-control"
              value={stockAmount}
              onChange={(e) => setStockAmount(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">배송비 무료 여부:</label>
            <select
              className="form-control"
              value={deliveryisFree}
              onChange={(e) => setDeliveryisFree(e.target.value)}
            >
              <option value="">선택</option>
              <option value="Y">무료</option>
              <option value="N">유료</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">비공개 여부:</label>
            <select
              className="form-control"
              value={secretYn}
              onChange={(e) => setSecretYn(e.target.value)}
            >
              <option value="">선택</option>
              <option value="Y">비공개</option>
              <option value="N">공개</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">카테고리:</label>
            <select
            className="form-control"
            value={selectedMainCategory}
            onChange={(e) => setSelectedMainCategory(e.target.value)}
            >
            <option value="">{selectedMainCategory}</option> {/* 기본 선택 값 */}
            {allCategory1
                .filter(category => !category.category1Name.includes(selectedMainCategory)) // selectedMainCategory를 포함하지 않는 카테고리만 필터링
                .map((category) => (
                <option key={category.category1Seqno} value={category.category1Seqno}>
                    {category.category1Name}
                </option>
                ))}
            </select>
            <select
              className="form-control mt-2"
              value={selectedMiddleCategory}
              onChange={(e) => setSelectedMiddleCategory(e.target.value)}
            >
              <option value="">{selectedMiddleCategory}</option>
              {allCategory2
              .filter(category => !category.category2Name.includes(selectedMiddleCategory)) // selectedMainCategory를 포함하지 않는 카테고리만 필터링
              .map((category) => (
                <option key={category.category2Seqno} value={category.category2Seqno}>
                  {category.category2Name}
                </option>
              ))}
            </select>
            <select
              className="form-control mt-2"
              value={selectedCategory3}
              onChange={(e) => setSelectedCategory3(e.target.value)}
            >
              <option value="">{selectedCategory3}</option>
              {allCategory3
              .filter(category => !category.category3Name.includes(selectedCategory3)) // selectedMainCategory를 포함하지 않는 카테고리만 필터링
              .map((category) => (
                <option key={category.category3Seqno} value={category.category3Seqno}>
                  {category.category3Name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">기존 상품 이미지 </label>
            <div className="d-flex flex-wrap">
                {productImages.length > 0 ? (
                productImages.map((image, index) => (
                    <div key={index} className="position-relative me-3 mb-3">
                    <img
                        src={`http://localhost:8082/product/thumbnails/${image}`}  // 이미지 파일 경로 설정
                        alt={`product-image-${index}`}
                        className="img-thumbnail"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <button
                        type="button"
                        className="btn btn-danger position-absolute top-0 end-0"
                        style={{ zIndex: 10 }}
                        onClick={() => handleRemoveImage(index, 'product')}
                    >
                        X
                    </button>
                    </div>
                ))
                ) : (
                <p>기존 상품 이미지가 없습니다.</p>
                )}
            </div>

            
            <label className="form-label">상품 이미지 추가</label>
            <input
              type="file"
              className="form-control"
              name="newProductImages"
              onChange={handleFileChange}
              multiple
            />
          </div>

          <div className="mb-3">
          <label className="form-label">기존 상품 상세 이미지 </label>
          <div className="d-flex flex-wrap">
                {productDetailImages.length > 0 ? (
                productDetailImages.map((image, index) => (
                    <div key={index} className="position-relative me-3 mb-3">
                    <img
                        src={`http://localhost:8082/product/images/${image}`}  // 이미지 파일 경로 설정
                        alt={`product-image-${index}`}
                        className="img-thumbnail"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <button
                        type="button"
                        className="btn btn-danger position-absolute top-0 end-0"
                        style={{ zIndex: 10 }}
                        onClick={() => handleRemoveImage(index, 'product')}
                    >
                        X
                    </button>
                    </div>
                ))
                ) : (
                <p>기존 상품 상세 이미지가 없습니다.</p>
                )}
            </div>
            <label className="form-label">상품 상세 이미지 추가</label>
            <input
              type="file"
              className="form-control"
              name="newProductDetailImages"
              onChange={handleFileChange}
              multiple
            />
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
                  <button
                  className="btn btn-danger mt-2"
                  onClick={() => handleRemoveOption(option.optionSeqno)}
                >
                  삭제
                </button>
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
                   <button
                  className="btn btn-danger mt-2"
                  onClick={() =>  handleRemoveRelatedProduct(product.relatedProductSeqno)}
                >
                  삭제
                </button>
                </div>
              ))}
              <button className="btn btn-primary" onClick={handleAddRelatedProduct}>추가 상품 추가</button>
            </div>

          <div className="mb-3">
            <button className="btn btn-secondary me-2" onClick={goBack}>
              돌아가기
            </button>
            <button className="btn btn-primary" onClick={handleUpdate}>
              수정하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
