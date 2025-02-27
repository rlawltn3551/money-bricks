const INDUSTRY_NEWS_TEMPLATES = {
  "IT/반도체": [
    "{회사}가 신규 반도체 공정 개발에 성공했다. 업계는",
    "{회사}의 AI 반도체 점유율이 {수치}% {방향}했다. 전문가들은",
    "{회사}가 차세대 디스플레이 기술 개발을 발표했다. 시장은",
    "{회사}의 클라우드 사업 매출이 {수치}% {방향}했다. 증권가는",
    "{회사}가 {수치}조원 규모의 신규 투자를 결정했다. 관련 업계는",
  ],
  자동차: [
    "{회사}의 전기차 판매가 전년비 {수치}% {방향}했다. 업계는",
    "{회사}가 자율주행 기술 특허를 획득했다. 전문가들은",
    "{회사}의 수소차 시장점유율이 {수치}% {방향}했다. 시장은",
    "{회사}가 신규 플랫폼 개발을 발표했다. 자동차 업계는",
    "{회사}의 해외 공장 가동률이 {수치}% {방향}했다. 관계자들은",
  ],
  건설: [
    "{회사}가 {수치}조원 규모의 해외 수주를 달성했다. 업계는",
    "{회사}의 도급순위가 상승했다. 건설업계는",
    "{회사}가 신규 개발사업을 수주했다. 시장은",
    "{회사}의 수주잔고가 {수치}% {방향}했다. 전문가들은",
    "{회사}가 친환경 건설 기술을 도입했다. 관계자들은",
  ],
  증권: [
    "{회사}의 분기 수수료 수익이 {수치}% {방향}했다. 금융권은",
    "{회사}가 新 금융상품을 출시했다. 시장은",
    "{회사}의 해외 법인 실적이 {수치}% {방향}했다. 전문가들은",
    "{회사}가 디지털 금융 서비스를 확대했다. 업계는",
    "{회사}의 리테일 고객이 {수치}% {방향}했다. 증권가는",
  ],
  제약: [
    "{회사}가 신약 임상 3상을 통과했다. 제약업계는",
    "{회사}의 백신 생산량이 {수치}% {방향}했다. 전문가들은",
    "{회사}가 신규 바이오 시설 투자를 결정했다. 시장은",
    "{회사}의 글로벌 임상이 순항 중이다. 업계는",
    "{회사}가 신약 특허를 획득했다. 관계자들은",
  ],
};

const DOMESTIC_NEWS = [
  "한국은행이 기준금리를 {변동}bp {방향} 조정했다. 시장 전문가들은",
  "국내 GDP 성장률 전망치가 당초 {수치}%에서 {변동}% {방향} 수정됐다. 전문가들은",
  "반도체 수출이 전년 대비 {수치}% {방향}했다. 업계 관계자는",
  "정부가 부동산 시장 안정화를 위한 신규 정책을 발표했다. 주요 내용에 따르면",
  "주요 대기업들의 3분기 실적이 시장 예상치를 {방향}했다. 증권가에서는",
  "고용률이 전월 대비 {수치}%p {방향}한 것으로 나타났다. 고용노동부는",
  "소비자물가지수가 전년 동월 대비 {수치}% {방향}했다. 통계청은",
  "원/달러 환율이 장중 {수치}원대를 {방향}했다. 외환시장 전문가들은",
  "코스피 지수가 {수치}선을 {방향}했다. 시장에서는",
  "정부가 {수치}조원 규모의 추경 예산안을 편성했다. 기획재정부는",
  "국내 제조업 PMI가 {수치}을 기록하며 전월 대비 {방향}했다. 산업계는",
  "수출 의존도가 높은 중소기업들의 실적이 {방향}세를 보였다. 중소기업중앙회는",
  "금융감독원이 새로운 금융규제 정책을 발표했다. 금융권에서는",
  "국내 주요 은행의 BIS 비율이 {수치}%를 기록했다. 금융당국은",
  "신용대출 금리가 전월 대비 {수치}%p {방향}됐다. 시중은행들은",
  "외국인 투자자들의 국내 주식 순매수가 {수치}억원을 기록했다. 전문가들은",
  "정부가 신산업 육성을 위한 {수치}조원 규모 투자계획을 발표했다. 업계는",
  "대기업 채용시장이 전년 대비 {수치}% {방향}될 전망이다. 취업포털은",
  "가계부채 증가율이 {수치}% {방향}했다. 한국은행은",
  "서비스업 생산지수가 {수치}% {방향}했다. 통계청은",
];

const INTERNATIONAL_NEWS = [
  "미 연방준비제도가 기준금리를 {변동}bp {방향} 조정했다. 월가에서는",
  "중국의 GDP 성장률이 {수치}%를 기록했다. 전문가들은",
  "국제 유가가 배럴당 {수치}달러선을 {방향}했다. 시장에서는",
  "달러 인덱스가 {수치}선을 {방향}하며 글로벌 금융시장이 요동쳤다. 투자자들은",
  "미국 증시가 {수치}% {방향}하며 마감했다. 투자은행들은",
  "글로벌 공급망 병목 현상이 {방향}되고 있다. 물류 업계는",
  "미중 무역협상이 {방향}적인 진전을 보였다. 협상단은",
  "글로벌 원자재 가격이 {수치}% {방향}했다. 상품시장 전문가들은",
  "주요 글로벌 기업들의 실적이 예상치를 {방향}했다. 시장에서는",
  "EU가 새로운 경제 정책을 발표했다. 주요 내용에 따르면",
  "일본 중앙은행이 통화정책 {방향} 기조를 발표했다. 시장은",
  "영국 파운드화가 달러 대비 {수치}% {방향}했다. 외환시장은",
  "중국 산업생산이 전년 대비 {수치}% {방향}했다. 전문가들은",
  "인도 중앙은행이 기준금리를 {변동}bp {방향} 조정했다. 시장에서는",
  "유로존 PMI가 {수치}를 기록하며 전월 대비 {방향}했다. 전문가들은",
  "글로벌 반도체 시장 규모가 {수치}% {방향}할 전망이다. 업계는",
  "세계은행이 글로벌 경제성장률 전망치를 {방향} 조정했다. 분석가들은",
  "독일 IFO 경기지수가 {수치}를 기록했다. 유럽 시장은",
  "글로벌 M&A 시장 규모가 {수치}% {방향}했다. 투자은행들은",
  "OPEC+가 원유 생산량을 {방향} 조정하기로 결정했다. 에너지 시장은",
];

const POSITIVE_ENDINGS = ["긍정적으로 전망했다.", "기대감을 표명했다.", "호평을 보냈다.", "성장 가능성에 주목했다.", "경쟁력 강화를 예상했다."];

const NEGATIVE_ENDINGS = ["우려를 표명했다.", "신중한 접근이 필요하다고 분석했다.", "부정적으로 전망했다.", "기대 이하라고 평가했다.", "위험 요인을 지적했다."];

export const NEWS_WEIGHTS = {
  INDUSTRY: 1.5, // 50% 증가
  DOMESTIC: 1.2, // 50% 증가
  INTERNATIONAL: 1.8, // 50% 증가
};

export function generateDailyNews(stocks, day) {
  if (!stocks || stocks.length === 0) {
    console.warn("주식 데이터가 없습니다.");
    return generateDomesticNews(); // 주식 데이터가 없으면 국내 뉴스 생성
  }

  const newsTypes = ["INDUSTRY", "DOMESTIC", "INTERNATIONAL"];
  const selectedType = newsTypes[Math.floor(Math.random() * newsTypes.length)];

  let newsData;
  try {
    switch (selectedType) {
      case "INDUSTRY":
        newsData = generateIndustryNews(stocks);
        break;
      case "DOMESTIC":
        newsData = generateDomesticNews();
        break;
      case "INTERNATIONAL":
        newsData = generateInternationalNews();
        break;
    }

    if (!newsData) {
      console.warn("뉴스 생성 실패, 국내 뉴스로 대체");
      newsData = generateDomesticNews();
    }

    // 뉴스 타입에 따른 영향도 조정
    newsData.priceImpact *= NEWS_WEIGHTS[selectedType];

    return {
      ...newsData,
      type: selectedType,
      day,
    };
  } catch (error) {
    console.error("뉴스 생성 중 오류:", error);
    return generateDomesticNews(); // 오류 발생시 국내 뉴스로 대체
  }
}

function generateIndustryNews(stocks) {
  if (!stocks || stocks.length === 0) {
    throw new Error("주식 데이터가 없습니다.");
  }

  // 디버깅용 로그 추가
  console.log("현재 주식 데이터:", stocks);
  const industries = [...new Set(stocks.map((stock) => stock.industry))];
  console.log("추출된 산업 목록:", industries);

  if (!industries || industries.length === 0) {
    throw new Error("산업 데이터가 없습니다.");
  }

  const selectedIndustry = industries[Math.floor(Math.random() * industries.length)];
  console.log("선택된 산업:", selectedIndustry);
  console.log("사용 가능한 템플릿:", INDUSTRY_NEWS_TEMPLATES[selectedIndustry]);

  const companiesInIndustry = stocks.filter((stock) => stock.industry === selectedIndustry);
  const selectedCompany = companiesInIndustry[Math.floor(Math.random() * companiesInIndustry.length)];

  // 템플릿이 없는 경우 국내 뉴스로 대체
  if (!INDUSTRY_NEWS_TEMPLATES[selectedIndustry]) {
    console.log("해당 산업의 템플릿이 없어 국내 뉴스로 대체합니다.");
    return generateDomesticNews();
  }

  return generateNews(
    INDUSTRY_NEWS_TEMPLATES[selectedIndustry],
    true,
    selectedCompany,
    selectedIndustry,
    companiesInIndustry.map((stock) => stock.code)
  );
}

function generateDomesticNews() {
  return generateNews(DOMESTIC_NEWS, false);
}

function generateInternationalNews() {
  return generateNews(INTERNATIONAL_NEWS, false);
}

function generateNews(templates, includeCompany, company = null, industry = null, affectedStocks = []) {
  if (!templates || templates.length === 0) {
    throw new Error("뉴스 템플릿이 없습니다.");
  }

  const isPositive = Math.random() > 0.5;
  const template = templates[Math.floor(Math.random() * templates.length)];
  const endings = isPositive ? POSITIVE_ENDINGS : NEGATIVE_ENDINGS;
  const ending = endings[Math.floor(Math.random() * endings.length)];

  let newsContent = template
    .replace("{수치}", (2 + Math.random() * 8).toFixed(1))
    .replace("{변동}", Math.floor(25 + Math.random() * 50))
    .replace("{방향}", isPositive ? "상승" : "하락");

  if (includeCompany && company) {
    newsContent = newsContent.replace("{회사}", company.name);
  }

  const baseImpact = Math.random() * 0.08 - 0.04; // -4% ~ 4%
  const finalImpact = isPositive ? Math.abs(baseImpact) : -Math.abs(baseImpact);
  const reliability = 60 + Math.floor(Math.random() * 41); // 60 ~ 100

  return {
    title: includeCompany ? `${industry} 산업 뉴스` : newsContent.split(".")[0],
    content: `${newsContent} ${ending}`,
    relatedStocks: includeCompany ? `${company.name} 외 ${industry} 기업` : "전체 시장",
    marketImpact: `${calculateSentiment(finalImpact)} (${(finalImpact * 100).toFixed(2)}%)`,
    priceImpact: finalImpact,
    reliability,
    affectedStocks: affectedStocks || [],
    industry: industry || "전체",
    isPositive,
  };
}

function calculateSentiment(impact) {
  if (impact > 0.06) return "매우 긍정적";
  if (impact > 0.03) return "긍정적";
  if (impact >= -0.03) return "중립적";
  if (impact >= -0.06) return "부정적";
  return "매우 부정적";
}

export function applyNewsImpact(stocks, news) {
  if (!stocks || !news || !news.affectedStocks) {
    return;
  }

  stocks.forEach((stock) => {
    if (news.affectedStocks.includes(stock.code)) {
      const newPrice = stock.price * (1 + news.priceImpact);
      stock.price = Math.max(1, Math.round(newPrice)); // 최소 1원, 정수로 반올림
    }
  });
}
