import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useCustomMove from "../../common/hooks/useCustomMove";
import {useEffect, useState} from "react";
import {getList} from "../api/comparisonDepositApi";
import "../style/ComparisonDepositComponent.scss";
import PageComponent from "../../common/components/PageComponent";
import {ProductType} from "./ProductType";

const initState = {
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: null,
    prev: false,
    next: false,
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 0,
};

// 에러 처리
const handleError = (err) => {
    console.error("Error occurred:", err);
    alert("데이터를 불러오는 중 오류가 발생했습니다.");
};

const ComparisonDepositComponent = () => {
    const { page, size , moveToList } = useCustomMove();
    const [serverData, setServerData] = useState(initState);
    const [type, setType] = useState(ProductType.SAVINGS); // 초기값: 적금
    const [isChartVisible, setIsChartVisible] = useState(false); // 차트 표시 여부 상태
    const [sortOption, setSortOption] = useState(""); // 정렬

    useEffect(() => {
        getList({ page, size }, type, sortOption)
            .then((data) => {
                console.log("Fetched Data:", data);
                setServerData(data);
            })
            .catch((err) => handleError(err));
    }, [page, size, type, sortOption]);

    // 예적금 변경
    const handleTypeChange = (newType) => {
        setType(newType);
    };

    // 기본 금리와 최고 금리 비교 차트 데이터 준비
    const chartData = serverData.dtoList.map(product => ({
        productName: product.finPrdtNm,
        basicRate: parseFloat(product.intrRate),
        maxRate: parseFloat(product.intrRate2)
    }));

    // 차트 표시/숨기기 토글
    const toggleChartVisibility = () => {
        setIsChartVisible(!isChartVisible);
    };

    return (
        <div>
            <div className="comparison-deposit">
                {/* 타입 선택 버튼 */}
                <div className="product-button-group">
                    <button
                       className={type === ProductType.SAVINGS ? "active" : ""}
                       onClick={() => handleTypeChange(ProductType.SAVINGS)}
                    >
                        적금 비교
                    </button>
                    <button
                       className={type === ProductType.FIXED ? "active" : ""}
                       onClick={() => handleTypeChange(ProductType.FIXED)}
                    >
                        예금 비교
                    </button>
                </div>

                {/* 필터 셀렉트 박스 */}
                <div className="filter-section">
                    <div className="filter-box">
                        <label htmlFor="sortSelect">정렬 기준: </label>
                        <select
                           id="sortSelect"
                           value={sortOption}
                           onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="">전체</option>
                            <option value="bankName">은행명(가나다순)</option>
                            <option value="basicRate">기본 금리(내림차순)</option>
                            <option value="maxRate">최고 금리(내림차순)</option>
                        </select>
                    </div>
                </div>

                {/* 금리 비교 차트 토글 버튼 */}
                <div className="product-button-group">
                    <button onClick={toggleChartVisibility}>
                        {isChartVisible ? "차트 숨기기" : "현재 페이지의 금리 비교 차트 보기"}
                    </button>
                </div>

                {/* 금리 비교 차트 표시 여부에 따른 렌더링 */}
                {isChartVisible && (
                   <div className="rate-comparison-chart">
                       <ResponsiveContainer width="100%" height={500}>
                           <LineChart data={chartData}
                                      margin={{ top: 20, right: 30, left: 30, bottom: 100 }}> {/* 하단 여백을 추가 */}
                               <CartesianGrid strokeDasharray="3 3" />
                               <XAxis
                                  dataKey="productName"
                                  angle={-45}
                                  textAnchor="end"
                                  interval={0}
                                  height={80}
                                  tick={{ fontSize: 14 }}  // 텍스트 크기 조정
                               />
                               <YAxis />
                               <Tooltip />
                               <Legend
                                  verticalAlign="top"
                                  align="center"  // 중앙 정렬
                                  layout="horizontal"  // 수평 배치
                                  wrapperStyle={{ paddingBottom: 30 }}
                               />
                               <Line type="monotone" dataKey="basicRate" stroke="#007bff" name="기본 금리" />
                               <Line type="monotone" dataKey="maxRate" stroke="#dc3545" name="최고 금리" />
                           </LineChart>
                       </ResponsiveContainer>
                   </div>
                )}

                <div className="product-list">
                    {serverData.dtoList.length > 0 ? (
                       serverData.dtoList.map((product) => (
                          <div className="product-card" key={product.finPrdtCd}>
                              <h3>{product.finPrdtNm}</h3>
                              <hr />
                              <table className="product-table">
                                  <tbody>
                                  <tr>
                                      <td><strong>은행명</strong></td>
                                      <td><span className="kor-co-nm">{product.korCoNm}</span></td>
                                  </tr>
                                  <tr>
                                      <td><strong>기본 금리</strong></td>
                                      <td><span className="basic-rate">{product.intrRate}%</span></td>
                                  </tr>
                                  <tr>
                                      <td><strong>최고 금리</strong></td>
                                      <td><span className="max-rate">{product.intrRate2}%</span></td>
                                  </tr>
                                  <tr>
                                      <td><strong>우대 조건</strong></td>
                                      <td><span className="spcl-cnd">{product.spclCnd || "없음"}</span></td>
                                  </tr>
                                  </tbody>
                              </table>
                          </div>
                       ))
                    ) : (
                       <p>데이터가 없습니다.</p>
                    )}
                </div>
                <PageComponent serverData={serverData} movePage={moveToList} />
            </div>
        </div>
    );
};

export default ComparisonDepositComponent;