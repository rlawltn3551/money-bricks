import React, { useCallback, useState } from "react";
import "../style/IndexPage.scss";
import { Link, useNavigate } from "react-router-dom";
import useCustomLogin from "../../common/hooks/useCustomLogin";
import BasicMenu from "../../common/components/BasicMenu";
import FooterComponent from "../../common/components/FooterComponent";

const IndexPage = () => {
	const [activeQuestion, setActiveQuestion] = useState(null);

	const faqData = [
		{
			question: "금융 용어를 검색하려면 어떻게 해야 하나요?",
			answer: `
            금융 사전에서 다양한 금융 용어를 쉽게 검색할 수 있습니다. 
            
            [금융 용어 검색 방법]
            1. '금융 사전' 메뉴로 이동
            2. 검색창에 원하는 금융 용어 입력
            3. 검색 결과에서 자세한 설명 확인
            
            ※ 금융 사전은 지속적으로 업데이트되며, 추가 요청은 고객센터를 통해 접수할 수 있습니다.
        `,
		},
		{
			question: "적금 상품을 가입하려면 어떻게 해야 하나요?",
			answer: `
            사이트에서 제공하는 적금 상품 비교 기능을 활용하여 나에게 맞는 상품을 찾을 수 있습니다.
            
            [적금 가입 방법]
            1. '적금 상품' 메뉴에서 원하는 상품 선택
            2. 상품 상세 페이지에서 가입 조건 확인
            3. 해당 은행의 공식 웹사이트로 이동하여 가입 진행
            
            ※ 본 사이트는 상품 비교 서비스만 제공하며, 실제 가입은 해당 금융사의 공식 사이트에서 진행됩니다.
        `,
		},
		{
			question: "예적금 비교 기능은 어떻게 이용하나요?",
			answer: `
            다양한 금융사의 예금 및 적금 상품을 한눈에 비교할 수 있습니다.
            
            [예적금 비교 방법]
            1. '예적금 비교' 메뉴로 이동
            2. 검색 필터를 사용하여 원하는 조건(이자율, 기간 등) 설정
            3. 추천 상품 리스트에서 원하는 상품 선택하여 상세 내용 확인
            
            ※ 일부 상품은 실시간 데이터 반영에 따라 변동될 수 있으며, 최신 정보는 각 금융사의 공식 사이트를 참고하세요.
        `,
		},
		{
			question: "포인트몰에서 포인트를 어떻게 사용하나요?",
			answer: `
            포인트몰에서는 적립한 포인트를 다양한 상품으로 교환할 수 있습니다.
            
            [포인트 사용 방법]
            1. '포인트몰' 메뉴로 이동
            2. 교환 가능한 상품 리스트 확인
            3. 보유 포인트 확인 후 원하는 상품 선택하여 교환 신청
            
            ※ 포인트는 특정 조건(모의 주식, 출석체크, 퀴즈 등)에서 적립되며, 소멸 기한이 있으므로 유효 기간 내에 사용하세요.
        `,
		},
		{
			question: "모의 주식 투자는 어떻게 진행되나요?",
			answer: `
            모의 주식 투자 기능을 활용하여 실제 시장과 유사한 환경에서 투자 연습을 할 수 있습니다.
            
            [모의 주식 투자 방법]
            1. '모의 주식' 메뉴로 이동
            2. 가상 투자금 설정 후 원하는 종목 선택
            3. 매수/매도 주문을 통해 투자 진행
            4. 내 투자 내역 및 수익률 확인
            
            ※ 모의 투자는 실제 거래가 아니며, 투자 연습을 위한 기능입니다. 실전 투자 시에는 금융사의 공식 플랫폼을 이용하세요.
        `,
		},
		{
			question: "적금과 예적금 비교는 실시간 정보인가요??",
			answer: `
            사이트에서 제공하는 금융 상품 데이터는 금융감독원 및 각 금융사의 공식 API를 통해 수집됩니다.
            
            [데이터 출처]
            - 금융감독원 제공 공시 데이터
            - 각 금융사의 실시간 제공 API (일부 상품)
            - 금융 시장 트렌드를 반영한 분석 자료
            
            하여, 모든 데이터들은 실시간으로 반영되고 있습니다.
        `,
		},
		{
			question: "포인트는 어떻게 적립되나요?",
			answer: `
            포인트는 사이트 내 다양한 활동을 통해 적립할 수 있습니다.
            
            [포인트 적립 방법]
            - 금융 퀴즈 풀기
            - 금융 강의 수강 완료
            - 특정 이벤트 참여
            - 신규 회원 가입 및 추천인 코드 입력
            
            ※ 포인트 적립 내역은 '마이페이지 > 포인트 내역'에서 확인할 수 있으며, 일부 이벤트 포인트는 제한된 기간 내에 사용해야 합니다.
        `,
		},
	];

	const { isLogin, moveToLogin } = useCustomLogin();

	const toggleQuestion = (index) => {
		setActiveQuestion(activeQuestion === index ? null : index);
	};

	const navigate = useNavigate();

	const handleClickAdd = useCallback(() => {
		if (!isLogin) {
			alert("로그인이 필요합니다.");
			moveToLogin();
			return;
		}
		navigate("/board/add");
	}, [isLogin, moveToLogin, navigate]);

	return (
		<div>
			<BasicMenu />
			<div className="faq-page">
				<h1 className="faq-title">고객님, 무엇을 도와드릴까요?</h1>
				<div className="faq-search-bar"></div>
				<div className="faq-categories">
					<button className="faq-category active">TOP Q&A</button>
				</div>
				<div className="faq-questions">
					{faqData.map((faq, index) => (
						<div key={index} className="faq-item">
							<div className="faq-question" onClick={() => toggleQuestion(index)}>
								<span>Q</span> {faq.question}
								<span className="faq-arrow">
									{activeQuestion === index ? "▲" : "▼"}
								</span>
							</div>
							{activeQuestion === index && (
								<div className="faq-answer">
									{faq.answer.split("\n").map((line, idx) => (
										<p key={idx}>{line}</p>
									))}
								</div>
							)}
						</div>
					))}
				</div>
				<div className="index-list-button-box">
					<Link to="/board/list">
						<button className="index-list-active">문의 목록 보기</button>
					</Link>
					<button className="index-list-active" onClick={handleClickAdd}>
						문의하기
					</button>
				</div>
			</div>
			<FooterComponent />
		</div>
	);
};

export default IndexPage;
