package com.moneybricks.quiz.components;

import com.moneybricks.quiz.domain.Quiz;
import com.moneybricks.quiz.repository.QuizRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;

@Component
public class QuizDataInitializer implements CommandLineRunner {
    private final QuizRepository quizRepository;

    public QuizDataInitializer(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 데이터베이스에 이미 데이터가 있는지 확인
        if (quizRepository.count() == 0) {
            List<Quiz> quizzes = Arrays.asList(
                    // 금융 퀴즈 데이터
                    createQuiz("주식시장에서 '상한가'는 주가가 하루 동안 오를 수 있는 최대 한도를 의미한다.", "O",
                            "상한가는 주식이 하루 동안 상승할 수 있는 최대 폭을 의미하며, 한국 주식시장에서 보통 30%로 제한된다.", "금융"),
                    createQuiz("채권은 주식보다 위험성이 높다.", "X",
                            "채권은 일반적으로 주식보다 변동성이 낮고 원금 상환이 보장되는 경우가 많아 더 안전한 투자로 간주된다.", "금융"),
                    createQuiz("금리가 오르면 일반적으로 채권 가격은 하락한다.", "O",
                            "금리가 상승하면 기존에 낮은 금리로 발행된 채권의 매력도가 떨어져 가격이 하락한다.", "금융"),
                    createQuiz("신용카드를 사용할 때 할부를 선택하면 이자가 부과되지 않는다.", "X",
                            "무이자 할부가 아닌 이상, 할부를 선택하면 일반적으로 이자가 부과된다.", "금융"),
                    createQuiz("예금자 보호 제도는 모든 금융 상품을 보호한다.", "X",
                            "예금자 보호 제도는 일정 금액까지의 예금만 보호하며, 주식, 채권, 펀드 등은 보호 대상이 아니다.", "금융"),
                    createQuiz("PER(주가수익비율)이 낮을수록 해당 기업의 주가가 저평가되었을 가능성이 있다.", "O",
                            "PER이 낮다는 것은 기업의 이익 대비 주가가 낮다는 의미로, 저평가 가능성이 있다.", "금융"),
                    createQuiz("ETF(상장지수펀드)는 개별 주식이 아니라 특정 지수를 따라가는 펀드다.", "O",
                            "ETF는 특정 주가지수를 추종하는 펀드로, 개별 주식보다 분산 투자 효과가 있다.", "금융"),
                    createQuiz("비트코인은 중앙은행이 발행하는 디지털 화폐이다.", "X",
                            "비트코인은 중앙은행이 아닌 분산된 네트워크에서 운영되는 암호화폐이다.", "금융"),
                    createQuiz("환율이 상승하면 해외 여행 비용이 감소한다.", "X",
                            "환율 상승(원화 약세)은 외화 가치가 높아지는 것이므로 해외여행 비용이 증가한다.", "금융"),
                    createQuiz("신용 등급이 낮으면 대출 금리가 높아질 가능성이 크다.", "O",
                            "신용 등급이 낮을수록 대출 상환 위험이 커지므로 금리가 높아진다.", "금융"),
                    createQuiz("대출을 받을 때 연이율이 낮을수록 대출 이자가 줄어든다.", "O",
                            "연이율이 낮을수록 동일한 금액을 대출받았을 때 부담해야 하는 이자 비용이 줄어든다.", "금융"),
                    createQuiz("예금 금리가 낮아지면 일반적으로 소비가 증가할 가능성이 높다.", "O",
                            "예금 금리가 낮아지면 저축의 매력이 감소하여 소비로 이어질 가능성이 크다.", "금융"),
                    createQuiz("금융기관이 제공하는 모든 투자 상품은 예금자 보호 대상이다.", "X",
                            "펀드, 주식, 채권 등은 예금자 보호 대상이 아니다.", "금융"),
                    createQuiz("주가는 기업의 실적과 무관하게 움직인다.", "X",
                            "기업의 실적은 주가에 큰 영향을 미치는 중요한 요소 중 하나이다.", "금융"),
                    createQuiz("모든 주식회사는 배당금을 지급해야 한다.", "X",
                            "배당은 기업의 선택 사항이며, 모든 주식회사가 배당을 지급하는 것은 아니다.", "금융"),

                    // 경제 퀴즈 데이터
                    createQuiz("경제 성장률이 높을수록 물가가 상승할 가능성이 크다.", "O",
                            "경제 성장률이 높으면 소비와 투자가 증가하여 물가 상승 압력이 커질 수 있다.", "경제"),
                    createQuiz("인플레이션은 화폐 가치가 상승하는 현상이다.", "X",
                            "인플레이션은 화폐 가치가 하락하여 물가가 전반적으로 상승하는 현상이다.", "경제"),
                    createQuiz("중앙은행이 기준 금리를 인상하면 시중 금리도 일반적으로 상승한다.", "O",
                            "기준 금리 인상은 시중 대출 및 예금 금리에 영향을 미쳐 금리를 상승시키는 경향이 있다.", "경제"),
                    createQuiz("GDP는 한 나라의 총소득을 나타내는 지표이다.", "O",
                            "GDP(국내총생산)는 일정 기간 동안 한 나라에서 생산된 최종 재화와 서비스의 가치를 나타낸다.", "경제"),
                    createQuiz("경기 침체기에 소비가 증가하는 경향이 있다.", "X",
                            "경기 침체기에는 불확실성이 커지면서 소비가 감소하는 경향이 있다.", "경제"),
                    createQuiz("수요가 증가하면 일반적으로 가격도 상승한다.", "O",
                            "수요가 증가하면 공급이 일정할 경우 가격이 상승하는 경향이 있다.", "경제"),
                    createQuiz("세계화가 진행될수록 국가 간 무역은 감소하는 경향이 있다.", "X",
                            "세계화가 진행될수록 국가 간 교역이 증가하는 경향이 있다.", "경제"),
                    createQuiz("실업률이 증가하면 소비가 줄어들 가능성이 크다.", "O",
                            "실업률이 증가하면 가계 소득이 감소하여 소비 여력이 줄어든다.", "경제"),
                    createQuiz("환율이 상승하면 수출 기업에는 유리하게 작용할 수 있다.", "O",
                            "환율 상승(원화 약세)은 국내 제품의 가격 경쟁력을 높여 수출 기업에 유리할 수 있다.", "경제"),
                    createQuiz("정부가 재정을 확대하면 일반적으로 경제가 위축된다.", "X",
                            "정부가 재정을 확대하면 경기 부양 효과가 나타날 가능성이 크다.", "경제"),
                    createQuiz("경기 과열 시 정부는 금리를 인상할 가능성이 있다.", "O",
                            "경기 과열을 억제하기 위해 중앙은행은 금리를 인상할 수 있다.", "경제"),
                    createQuiz("기업의 생산성이 향상되면 경제 성장률이 증가할 가능성이 있다.", "O",
                            "생산성이 향상되면 동일한 자원으로 더 많은 가치를 창출할 수 있어 경제 성장에 기여한다.", "경제"),
                    createQuiz("외국인이 국내 주식을 많이 사면 원화 가치는 상승할 가능성이 있다.", "O",
                            "외국인 투자 유입이 증가하면 원화 수요가 증가하여 원화 가치가 상승할 수 있다.", "경제"),
                    createQuiz("기축통화는 국제 거래에서 가장 많이 사용되는 통화를 의미한다.", "O",
                            "미국 달러(USD)는 현재 가장 대표적인 기축통화로 사용되고 있다.", "경제")
            );

            quizRepository.saveAll(quizzes);
        }
    }

    private Quiz createQuiz(String question, String answer, String explanation, String category) {
        Quiz quiz = new Quiz();
        quiz.setQuestion(question);
        quiz.setAnswer(answer);
        quiz.setExplanation(explanation);
        quiz.setCategory(category);
        return quiz;
    }
}