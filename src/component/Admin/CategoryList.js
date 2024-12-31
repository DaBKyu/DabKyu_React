import React, { useState, useEffect, useRef } from 'react';
import getCookie from '../../GetCookie';  
import "../../css/AdminSidebar.css"; 
import AdminSidebar from './AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
const CategoryList = () => {

  const accessTokenCookie = getCookie('accessToken');
  const [allCategory1, setAllCategory1] = useState([]);
  const [allCategory2, setAllCategory2] = useState([]);
  const [allCategory3, setAllCategory3] = useState([]);
  const [category1Name, setCategory1Name] = useState(""); 
  const [category2Name, setCategory2Name] = useState("");
  const [category3Name, setCategory3Name] = useState("");

  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedMiddleCategory, setSelectedMiddleCategory] = useState("");
  const [selectedCategory3, setSelectedCategory3] = useState("");
  const [newCategoryName, setNewCategoryName] = useState(""); // 수정할 카테고리 이름
  const [editingCategory, setEditingCategory] = useState(null); // 수정 중인 카테고리 저장

  // 메인 카테고리 데이터 가져오기
  useEffect(() => {
    fetch("http://localhost:8082/master/getMainCategories")
      .then((response) => response.json())
      .then((data) => setAllCategory1(data))
      .catch((error) => console.error("Error fetching main categories:", error));
  }, []);

  // 중간 카테고리 데이터 가져오기 (메인 카테고리 선택 시)
  useEffect(() => {
    if (selectedMainCategory) {
      fetch(`http://localhost:8082/master/getMiddleCategories?category1Seqno=${selectedMainCategory}`)
        .then((response) => response.json())
        .then((data) => setAllCategory2(data))
        .catch((error) => console.error("Error fetching middle categories:", error));
    } else {
      setAllCategory2([]); // 메인 카테고리 선택 해제 시, 중간 카테고리 초기화
      setSelectedMiddleCategory(""); // 중간 카테고리 선택 초기화
      setAllCategory3([]); // 세부 카테고리 초기화
      setSelectedCategory3(""); // 세부 카테고리 선택 초기화
    }
  }, [selectedMainCategory]);

  // 세부 카테고리 데이터 가져오기 (중간 카테고리 선택 시)
  useEffect(() => {
    if (selectedMiddleCategory) {
      fetch(`http://localhost:8082/master/getSubCategories?category2Seqno=${selectedMiddleCategory}`)
        .then((response) => response.json())
        .then((data) => setAllCategory3(data))
        .catch((error) => console.error("Error fetching subcategories:", error));
    } else {
      setAllCategory3([]); // 중간 카테고리 선택 해제 시, 세부 카테고리 초기화
      setSelectedCategory3(""); // 세부 카테고리 선택 초기화
    }
  }, [selectedMiddleCategory]);

  // 카테고리 수정 함수
 const updateCategory = async (categoryId, categoryType) => {
  if (!newCategoryName) {
    alert('수정할 카테고리 이름을 입력해주세요.');
    return;
  }

  try {
    const level = categoryType === "category1" ? 1 : categoryType === "category2" ? 2 : 3;
    const response = await fetch(`http://localhost:8082/master/category/${level}/${categoryId}?categoryName=${encodeURIComponent(newCategoryName)}`, {
      method: 'PUT',
      headers: {
        "Authorization": "Bearer " + accessTokenCookie,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert('카테고리가 수정되었습니다.');
      setCategory1Name(''); // 초기화
      setNewCategoryName(''); // 초기화
      setSelectedMainCategory(null); // 선택 초기화
      setEditingCategory(null); // 수정 카테고리 초기화
      // 카테고리 목록 갱신
      fetchCategories();
    } else {
      const errorData = await response.json();
      alert('에러: ' + errorData.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('카테고리 수정 중 오류가 발생했습니다.');
  }
};

  const fetchCategories = () => {
    fetch("http://localhost:8082/master/getMainCategories")
      .then((response) => response.json())
      .then((data) => setAllCategory1(data))
      .catch((error) => console.error("Error fetching main categories:", error));
  };

  // 카테고리 수정 입력창을 수정된 카테고리 하단에만 보이게 설정
  const handleEditCategory = (categoryId, categoryType, categoryName) => {
    setEditingCategory({ id: categoryId, type: categoryType });
    setNewCategoryName(categoryName);
  };

  // 카테고리 순서 변경
  const updateCategoryOrder = async (categoryId, categoryType, direction) => {
    try {
      const level = categoryType === "category1" ? 1 : categoryType === "category2" ? 2 : 3;
  
      const response = await fetch(
        `http://localhost:8082/master/category/order/${level}/${categoryId}?direction=${direction}`,
        {
          method: 'PUT',
          headers: {
            "Authorization": "Bearer " + accessTokenCookie,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.ok) {
        alert("카테고리 순서가 변경되었습니다.");
        fetchCategories(); // 변경된 순서 반영을 위해 목록 갱신
      } else {
        const errorData = await response.json();
        alert("에러: " + errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("카테고리 순서 변경 중 오류가 발생했습니다.");
    }
  };

  // 카테고리 순서 변경
  const handleOrderChange = (categoryId, categoryType, direction) => {
    updateCategoryOrder(categoryId, categoryType, direction);
  };
  
   // 카테고리 삭제 함수
   const deleteCategory = async (categoryId, categoryType, e) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        const level = categoryType === "category1" ? 1 : categoryType === "category2" ? 2 : 3;

        const response = await fetch(`http://localhost:8082/master/category/${level}/${categoryId}`, {
          method: 'DELETE',
          headers: { "Authorization": "Bearer " + accessTokenCookie },
        });

        if (response.ok) {
          alert("카테고리가 삭제되었습니다.");
          if (categoryType === "category1") {
            setAllCategory1((prev) => prev.filter((category) => category.category1Seqno !== categoryId));
          } else if (categoryType === "category2") {
            setAllCategory2((prev) => prev.filter((category) => category.category2Seqno !== categoryId));
          } else if (categoryType === "category3") {
            setAllCategory3((prev) => prev.filter((category) => category.category3Seqno !== categoryId));
          }
        } else {
          const errorData = await response.json();
          alert('에러: ' + errorData.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('카테고리 삭제 중 오류가 발생했습니다.');
      }
    }
  };
    // 카테고리 추가 함수
    const addMainCategory = async () => {
        // 입력 값이 비어있는지 확인
        if (!category1Name) {
          alert('카테고리 이름을 입력해주세요.');
          return;
        }
    
        try {
          // 서버에 카테고리 추가 요청
          const response = await fetch('http://localhost:8082/master/category1', {
            method: 'POST',
            headers : {"Authorization" : "Bearer " + accessTokenCookie},
            body: new URLSearchParams({
              category1Name: category1Name,
            }),
          });
    
          if (response.ok) {
            // 서버 응답이 성공적일 때
            const data = await response.json();
            alert(data.message); // 성공 메시지 표시
            // 새로 추가된 메인 카테고리를 기존 카테고리 목록에 반영
            setAllCategory1((prev) => [
                ...prev,
                { category1Seqno: data.newCategorySeqno, category1Name }
            ]);
            setCategory1Name(''); // 입력창 초기화
          } else {
            // 서버 응답이 실패일 때
            const errorData = await response.json();
            alert('에러: ' + errorData.message);
          }
        } catch (error) {
          // 네트워크 오류 등 예외 처리
          console.error('Error:', error);
          alert('카테고리 추가 중 오류가 발생했습니다.');
        }
      };

      const addMiddleCategory = async () => {
        if (!category2Name) {
          alert('중간 카테고리 이름을 입력해주세요.');
          return;
        }
        if (!selectedMainCategory) {
          alert('메인 카테고리를 먼저 선택해주세요.');
          return;
        }
        try {
            // 요청 데이터 구성
            const requestBody = {
              category1Seqno: selectedMainCategory,
              category2Name: category2Name,
            };
        
            const response = await fetch('http://localhost:8082/master/category2', {
              method: 'POST',
              headers: {
                "Authorization": "Bearer " + accessTokenCookie,
                "Content-Type": "application/json",  // JSON 데이터 전송
              },
              body: JSON.stringify(requestBody),  // JSON.stringify로 body에 전달
            });
        
          if (response.ok) {
            const data = await response.json();
            alert(data.message);
            setCategory2Name('');
            // 새로 추가된 중간 카테고리를 리스트에 반영
            setAllCategory2((prev) => [...prev, { category2Seqno: data.newCategorySeqno, category2Name }]);
          } else {
            const errorData = await response.json();
            alert('에러: ' + errorData.message);
          }
        } catch (error) {
          console.error('Error:', error);
          alert('중간 카테고리 추가 중 오류가 발생했습니다.');
        }
      };

      const addSubCategory = async () => {
        if (!category3Name) {
          alert('세부 카테고리 이름을 입력해주세요.');
          return;
        }
        if (!selectedMiddleCategory) {
          alert('중간 카테고리를 먼저 선택해주세요.');
          return;
        }
        try {
            // 요청 데이터 구성
            const requestBody = {
              category2Seqno: selectedMiddleCategory,
              category3Name: category3Name,
            };
        
            const response = await fetch('http://localhost:8082/master/category3', {
              method: 'POST',
              headers: {
                "Authorization": "Bearer " + accessTokenCookie,
                "Content-Type": "application/json",  // JSON 데이터 전송
              },
              body: JSON.stringify(requestBody),  // JSON.stringify로 body에 전달
            });
        
          if (response.ok) {
            const data = await response.json();
            alert(data.message);
            setCategory3Name('');
            // 새로 추가된 세부 카테고리를 리스트에 반영
            setAllCategory3((prev) => [...prev, { category3Seqno: data.newCategorySeqno, category3Name }]);
          } else {
            const errorData = await response.json();
            alert('에러: ' + errorData.message);
          }
        } catch (error) {
          console.error('Error:', error);
          alert('세부 카테고리 추가 중 오류가 발생했습니다.');
        }
      };

      return (
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-3">
              <AdminSidebar />
            </div>
    
            <div className="col-md-9" style={{ marginLeft: '100px', marginTop: '100px' }}>
              <div>
                <h4>카테고리 관리</h4>
    
                {/* 카테고리 그룹을 수평으로 배치 */}
                <div className="d-flex justify-content-start mb-4">
                  {/* 메인 카테고리 */}
                  <div className="category-box me-4">
                  <label className="form-label">메인 카테고리:</label>
                  <ul className="list-group">
                    {allCategory1.map((category) => (
                      <li
                        key={category.category1Seqno}
                        onClick={() => setSelectedMainCategory(category.category1Seqno)}
                        className={`list-group-item ${selectedMainCategory === category.category1Seqno ? 'bg-secondary text-white' : ''}`}
                      >
                        {category.category1Name}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();  // 클릭 이벤트 전파 방지
                            deleteCategory(category.category1Seqno, "category1", e); // categoryId와 categoryType을 명시적으로 전달
                          }}
                          className="btn btn-danger btn-sm float-end ms-2"
                        >
                          삭제
                        </button>
                          <button
                            onClick={() => handleEditCategory(category.category1Seqno, "category1", category.category1Name)}
                            className="btn btn-warning btn-sm float-end ms-2"
                          >수정</button>
                        <button
                          onClick={() => handleOrderChange(category.category1Seqno, "category1", "down")}
                          className="btn btn-info btn-sm float-end ms-2"
                        >
                          <FontAwesomeIcon icon={faArrowDown} /> 
                        </button>
                        <button
                          onClick={() => handleOrderChange(category.category1Seqno, "category1", "up")}
                          className="btn btn-info btn-sm float-end ms-2"
                        >
                          <FontAwesomeIcon icon={faArrowUp} /> 
                        </button>
                        {/* 수정 입력창 */}
                        {editingCategory?.id === category.category1Seqno && editingCategory?.type === "category1" && (
                          <div className="mt-3">
                            <input
                              type="text"
                              className="form-control"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              placeholder="수정할 카테고리 이름"
                            />
                            <button
                              onClick={() => updateCategory(category.category1Seqno, "category1")}
                              className="btn btn-primary mt-2 w-100"
                            >
                              카테고리 수정
                            </button>
                            </div>
                          )}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3">
                          <input
                            type="text"
                            className="form-control"
                            value={category1Name}
                            onChange={(e) => setCategory1Name(e.target.value)}
                            placeholder="새로운 메인 카테고리 이름"
                          />
                          <button onClick={addMainCategory} className="btn btn-primary mt-2 w-100">카테고리 추가</button>
                        </div>
                      </div>
    
                  {/* 중간 카테고리 */}
                  {selectedMainCategory && (
                    <div className="category-box me-4">
                      <label className="form-label">중간 카테고리:</label>
                      <ul className="list-group">
                        {allCategory2.map((category) => (
                          <li
                            key={category.category2Seqno}
                            onClick={() => setSelectedMiddleCategory(category.category2Seqno)}
                            className={`list-group-item ${selectedMiddleCategory === category.category2Seqno ? 'bg-secondary text-white' : ''}`}
                          >
                            {category.category2Name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();  // 클릭 이벤트 전파 방지
                               deleteCategory(category.category2Seqno, "category2", e)}}
                              className="btn btn-danger btn-sm float-end ms-2"
                            >삭제</button>
                            <button
                              onClick={() => handleEditCategory(category.category2Seqno, "category2", category.category2Name)}
                              className="btn btn-warning btn-sm float-end ms-2"
                            >수정</button>
                             <button
                              onClick={() => handleOrderChange(category.category1Seqno, "category1", "down")}
                              className="btn btn-info btn-sm float-end ms-2"
                            >
                              <FontAwesomeIcon icon={faArrowDown} /> 
                            </button>
                            <button
                              onClick={() => handleOrderChange(category.category1Seqno, "category1", "up")}
                              className="btn btn-info btn-sm float-end ms-2"
                            >
                              <FontAwesomeIcon icon={faArrowUp} /> 
                            </button>  
                          {/* 수정 입력창 */}
                          {editingCategory?.id === category.category2Seqno && editingCategory?.type === "category2" && (
                            <div className="mt-3">
                              <input
                                type="text"
                                className="form-control"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="수정할 카테고리 이름"
                              />
                              <button
                                onClick={() => updateCategory(category.category2Seqno, "category2")}
                                className="btn btn-primary mt-2 w-100"
                              >
                                카테고리 수정
                              </button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                          <div className="mt-3">
                            <input
                              type="text"
                              className="form-control"
                              value={category2Name}
                              onChange={(e) => setCategory2Name(e.target.value)}
                              placeholder="새로운 중간 카테고리 이름"
                            />
                            <button onClick={addMiddleCategory} className="btn btn-primary mt-2 w-100">중간 카테고리 추가</button>
                          </div>
                        </div>
                      )}
        
                  {/* 세부 카테고리 */}
                  {selectedMiddleCategory && (
                    <div className="category-box">
                      <label className="form-label">세부 카테고리:</label>
                      <ul className="list-group">
                        {allCategory3.map((category) => (
                          <li
                            key={category.category3Seqno}
                            onClick={() => setSelectedCategory3(category.category3Seqno)}
                            className={`list-group-item ${selectedCategory3 === category.category3Seqno ? 'bg-secondary text-white' : ''}`}
                          >
                            {category.category3Name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();  // 클릭 이벤트 전파 방지
                                 deleteCategory(category.category3Seqno, "category3",e)}}
                              className="btn btn-danger btn-sm float-end ms-2"
                            >
                              삭제
                            </button>
                            <button
                        onClick={() => handleEditCategory(category.category3Seqno, "category3", category.category3Name)}
                        className="btn btn-warning btn-sm float-end ms-2"
                      >
                        수정
                      </button>
                      <button
                          onClick={() => handleOrderChange(category.category1Seqno, "category1", "down")}
                          className="btn btn-info btn-sm float-end ms-2"
                        >
                          <FontAwesomeIcon icon={faArrowDown} />
                        </button>
                        <button
                          onClick={() => handleOrderChange(category.category1Seqno, "category1", "up")}
                          className="btn btn-info btn-sm float-end ms-2"
                        >
                          <FontAwesomeIcon icon={faArrowUp} /> 
                        </button>
                      {/* 수정 입력창 */}
                      {editingCategory?.id === category.category3Seqno && editingCategory?.type === "category3" && (
                        <div className="mt-3">
                          <input
                            type="text"
                            className="form-control"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="수정할 카테고리 이름"
                          />
                          <button
                            onClick={() => updateCategory(category.category3Seqno, "category3")}
                            className="btn btn-primary mt-2 w-100"
                          >
                            카테고리 수정
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                      <div className="mt-3">
                        <input
                          type="text"
                          className="form-control"
                          value={category3Name}
                          onChange={(e) => setCategory3Name(e.target.value)}
                          placeholder="새로운 세부 카테고리 이름"
                        />
                        <button onClick={addSubCategory} className="btn btn-primary mt-2 w-100">세부 카테고리 추가</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    

export default CategoryList;
