import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";  // Use navigate for redirection
import AdminSidebar from "./AdminSidebar";

const PostProduct = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const { fields: optionFields, append: addOption, remove: removeOption } = useFieldArray({ control, name: "options" });
  const { fields: relatedProductFields, append: addRelatedProduct, remove: removeRelatedProduct } = useFieldArray({ control, name: "relatedProducts" });

  const [productImages, setProductImages] = useState([]);
  const [productDetailImages, setProductDetailImages] = useState([]);

  const [allCategory1, setAllCategory1] = useState([]);
  const [allCategory2, setAllCategory2] = useState([]);
  const [allCategory3, setAllCategory3] = useState([]);

  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedMiddleCategory, setSelectedMiddleCategory] = useState("");
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

  const onImageUpload = (event, setImages) => {
    const files = Array.from(event.target.files);
    setImages(files);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "options" || key === "relatedProducts") {
        formData.append(key, JSON.stringify(data[key]));
      } else if (key === "productImages" || key === "productDetailImages") {
        data[key].forEach((file) => formData.append(key, file));
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      const response = await fetch("http://localhost:8082/master/postProduct", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("상품 등록 중 오류가 발생했습니다.");
      }

      alert("상품 등록이 완료되었습니다.");
      navigate("/admin/products");  // Redirect after success
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div>
      <AdminSidebar />
      <div style={{ marginLeft: "500px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>상품 등록</h1>

          {/* 상품 기본 정보 */}
          <div>
            <label>상품명:</label>
            <input {...register("productName", { required: true })} />
            {errors.productName && <p>상품명을 입력해주세요.</p>}

            <label>가격:</label>
            <input type="number" {...register("price", { required: true })} />
            {errors.price && <p>가격을 입력해주세요.</p>}

            <label>상품 설명:</label>
            <textarea {...register("description", { required: true })} />
            {errors.description && <p>상품 설명을 입력해주세요.</p>}

            <label>재고수량:</label>
            <input type="number" {...register("stock", { required: true })} />
            {errors.stock && <p>재고수량을 입력해주세요.</p>}

            <label>무료배송 여부:</label>
            <input type="checkbox" {...register("isFreeShipping")} />

            <label>숨김 여부:</label>
            <input type="checkbox" {...register("isHidden")} />
          </div>

          {/* 카테고리 선택 */}
          <div>
            <label>메인 카테고리:</label>
            <select
              {...register("mainCategory", { required: true })}
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
              {...register("middleCategory", { required: true })}
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
            <select {...register("category3Seqno", { required: true })}>
              <option value="">선택하세요</option>
              {allCategory3.map((category) => (
                <option key={category.category3Seqno} value={category.category3Seqno}>
                  {category.category3Name}
                </option>
              ))}
            </select>
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label>상품 이미지:</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => onImageUpload(e, setProductImages)}
            />

            <label>상품 상세 이미지:</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => onImageUpload(e, setProductDetailImages)}
            />
          </div>

          {/* 옵션 추가 */}
          <div>
            <h2>옵션</h2>
            {optionFields.map((field, index) => (
              <div key={field.id}>
                <input
                  placeholder="옵션 카테고리"
                  {...register(`options.${index}.optCategory`, { required: true })}
                />
                <input
                  placeholder="옵션명"
                  {...register(`options.${index}.optName`, { required: true })}
                />
                <input
                  type="number"
                  placeholder="가격"
                  {...register(`options.${index}.optPrice`, { required: true })}
                />
                <button type="button" onClick={() => removeOption(index)}>
                  삭제
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addOption({})}>
              옵션 추가
            </button>
          </div>

          {/* 추가 상품 */}
          <div>
            <h2>추가 상품</h2>
            {relatedProductFields.map((field, index) => (
              <div key={field.id}>
                <input
                  placeholder="추가 상품 카테고리"
                  {...register(`relatedProducts.${index}.relatedproductCategory`, { required: true })}
                />
                <input
                  placeholder="상품명"
                  {...register(`relatedProducts.${index}.relatedproductName`, { required: true })}
                />
                <button type="button" onClick={() => removeRelatedProduct(index)}>
                  삭제
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addRelatedProduct({})}>
              추가 상품 추가
            </button>
          </div>

          <button type="submit">상품 등록</button>
        </form>
      </div>
    </div>
  );
};

export default PostProduct;
