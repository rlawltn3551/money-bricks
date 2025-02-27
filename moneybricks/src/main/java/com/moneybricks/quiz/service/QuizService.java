package com.moneybricks.quiz.service;

import com.moneybricks.member.domain.Member;
import com.moneybricks.member.repository.MemberRepository;
import com.moneybricks.point.domain.Points;
import com.moneybricks.point.domain.PointsActionType;
import com.moneybricks.point.domain.PointsHistory;
import com.moneybricks.point.repository.PointsHistoryRepository;
import com.moneybricks.point.repository.PointsRepository;
import com.moneybricks.quiz.domain.Quiz;
import com.moneybricks.quiz.domain.QuizAnswer;
import com.moneybricks.quiz.domain.QuizAttempt;
import com.moneybricks.quiz.dto.*;
import com.moneybricks.quiz.repository.QuizAnswerRepository;
import com.moneybricks.quiz.repository.QuizAttemptRepository;
import com.moneybricks.quiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizAnswerRepository quizAnswerRepository;
    private final MemberRepository memberRepository;
    private final PointsRepository pointsRepository;
    private final PointsHistoryRepository pointsHistoryRepository;


    /**
     * 퀴즈 목록 불러오기 (카테고리별 혹은 전체)
     * @param category 카테고리 (전체, 금융, 경제)
     * @param count 가져올 문제 수
     * @return 퀴즈 목록
     */
    @Transactional
    public List<QuizDTO> getQuizzes(String category, int count){
        List<Quiz> quizzes;
        Pageable limit = PageRequest.of(0, count);

        if (category.equals("전체")) {
            quizzes = quizRepository.findRandomQuizzes(limit);
        } else {
            quizzes = quizRepository.findRandomQuizzesByCategory(category, limit);
        }

        log.info("요청된 퀴즈 개수: {}", count);
        log.info("실제 선택된 퀴즈 개수: {}", quizzes.size());
        log.info("선택된 퀴즈 ID들: {}",
                quizzes.stream()
                        .map(Quiz::getId)
                        .collect(Collectors.toList())
        );



        return quizzes.stream()
                .map(quiz -> QuizDTO.builder()
                        .id(quiz.getId())
                        .question(quiz.getQuestion())
                        .category(quiz.getCategory())
                        .answer(quiz.getAnswer())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 퀴즈 결과 제출 및 포인트 지급
     * @param username 사용자 아이디
     * @param requestDTO 퀴즈 답변 정보
     * @return 퀴즈 결과 및 포인트 정보
     */
    @Transactional
    public QUizAttemptResponseDTO submitQuizResult(String username, QuizAttemptRequestDTO requestDTO) {
        // 회원 정보 조회
        Member member = memberRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        //하루에 한 번만 퀴즈를 풀 수 있음
        if (!canAttemptDaily(username)) {
            throw new IllegalStateException("오늘은 이미 퀴즈를 풀었습니다. 내일 다시 시도해주세요");
        }

        // 퀴즈 시도 기록 생성
        QuizAttempt quizAttempt = QuizAttempt.builder()
                .member(member)
                .quizCategory("종합") // 카테고리 모두 종합으로 처리
                .totalQuestions(requestDTO.getAnswers().size())
                .correctAnswer(0) // 초기값 설정
                .earnedPoints(0) // 초기값 설정, 이후 계산
                .attemptDate(LocalDateTime.now())
                .build();

        QuizAttempt saveAttempt = quizAttemptRepository.save(quizAttempt);

        // 각 답변 저장 및 결과 생성
        List<QuizResultDetailDTO> resultDetails = new ArrayList<>();

        log.info("resultData : {}", resultDetails);

        int correctCount = 0;

        for (QuizAnswerDTO answerDTO : requestDTO.getAnswers()) {
            Quiz quiz = quizRepository.findById(answerDTO.getQuizId())
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 퀴즈입니다."));

            boolean isCorrect = quiz.getAnswer() != null
                    && answerDTO.getSelectedAnswer() != null
                    && quiz.getAnswer().trim().equals(answerDTO.getSelectedAnswer().trim());
            if (isCorrect) correctCount++;

            log.info("Received answerDTO: {}", answerDTO);

            log.info("Quiz ID: {}", quiz.getId());
            log.info("Correct Answer: [{}]", quiz.getAnswer());
            log.info("Selected Answer: [{}]", answerDTO.getSelectedAnswer());
            log.info("Correct Answer Trimmed: [{}]", quiz.getAnswer().trim());
            log.info("Selected Answer Trimmed: [{}]", answerDTO.getSelectedAnswer().trim());
            log.info("Is Correct: {}", isCorrect);
            log.info("correctCount : {}", correctCount);

            // 퀴즈 답변 저장
            QuizAnswer quizAnswer = QuizAnswer.builder()
                    .quizAttempt(saveAttempt)
                    .quiz(quiz)
                    .selectedAnswer(answerDTO.getSelectedAnswer())
                    .isCorrect(isCorrect)
                    .build();

            quizAnswerRepository.save(quizAnswer);

            // 세부 결과 추가

            resultDetails.add(QuizResultDetailDTO.builder()
                    .quizId(quiz.getId())
                    .question(quiz.getQuestion())
                    .correctAnswer(quiz.getAnswer())
                    .selectedAnswer(answerDTO.getSelectedAnswer())
                    .isCorrect(isCorrect)
                    .explanation(quiz.getExplanation())
                    .build());

            log.info("resultDetails : {}", resultDetails);
        }

        // 포인트 계산 (문제당 20점 5문제)
        int earnedPoints = correctCount * 20;

        // 퀴즈 시도 기록 업데이트
        saveAttempt.updateCorrectAnswers(correctCount);
        saveAttempt.updateEarnedPoints(earnedPoints);

        QuizAttempt finalAttempt = quizAttemptRepository.save(saveAttempt);

        // 포인트 업데이트
        updateMemberPoints(member, earnedPoints);

// 응답 생성
        QUizAttemptResponseDTO result = QUizAttemptResponseDTO.builder()
                .attemptId(finalAttempt.getId())
                .category(finalAttempt.getQuizCategory())
                .totalQuestions(finalAttempt.getTotalQuestions())
                .correctAnswers(finalAttempt.getCorrectAnswer())
                .earnedPoints(finalAttempt.getEarnedPoints())
                .details(resultDetails)
                .build();

// 🔍 최종 응답 데이터 로그 추가

        log.info("📝 제출된 답안 개수: {}", requestDTO.getAnswers());
        log.info("🧐 finalAttempt.getTotalQuestions(): {}", finalAttempt.getTotalQuestions());
        log.info("🔍 최종 응답 데이터: {}", result);
        log.info("💰 총 획득 포인트: {}", result.getEarnedPoints());

        log.info("📌 최종 응답된 문제 개수: {}", result.getDetails().size());

        return result;
    }

    /**
     * 포인트 업데이트
     * @param member 회원
     * @param earnedPoints 획득 포인트
     */

    private void updateMemberPoints(Member member, int earnedPoints) {
        if (earnedPoints <= 0) return;

        Points points = pointsRepository.findByMember(member);

        // 포인트 업데이트
        int currentTotalPoints = points.getTotalPoints();
        int currentAvailablePoints = points.getAvailablePoints();

        int newTotalPoints = currentTotalPoints + earnedPoints;
        int newAvailablePoints = currentAvailablePoints + earnedPoints;

        points.changeTotalPoints(newTotalPoints);
        points.changeAvailablePoints(newAvailablePoints);

        pointsRepository.save(points);

        // 포인트 이력 저장
        PointsHistory history = PointsHistory.builder()
                .points(points)
                .finalTotalPoints(newTotalPoints)
                .finalAvailablePoints(newAvailablePoints)
                .totalPointsChanged(earnedPoints)
                .availablePointsChanged(earnedPoints)
                .actionType(PointsActionType.QUIZ)
                .build();

        pointsHistoryRepository.save(history);

        log.info("사용자 {} 에게 퀴즈로 {}점이 지급되었습니다.", member.getUsername(), earnedPoints);
    }

    /**
     * 하루에 한 번만 퀴즈를 풀 수 있는지 확인
     * @param username 사용자 아이디
     * @return 퀴즈 시도 가능 여부
     */
    @Transactional(readOnly = true)
    public boolean canAttemptDaily(String username) {
//        return true;
        Member member = memberRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.now());

        int attemptCount = quizAttemptRepository.countByMemberAndAttemptDateBetween(
                member, startOfDay, endOfDay);

        log.info("오늘의 퀴즈 시도 횟수: {}", attemptCount);

        // 하루에 한번만 퀴즈 가능
        return attemptCount < 1;
    }

    /**
     * 회원별 퀴즈 이력 조회
     * @param username 사용자 아이디
     * @param page 페이지 번호
     * @param size 페이지 크기
     * @return 퀴즈 이력 목록
     */
    @Transactional(readOnly = true)
    public Page<QuizHistoryDTO> getQuizHistory(String username, int page, int size) {
        Member member = memberRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        Pageable pageable = PageRequest.of(page, size);
        Page<QuizAttempt> quizAttempts = quizAttemptRepository.findByMemberOrderByAttemptDateDesc(member, pageable);

        return quizAttempts.map(attempt -> QuizHistoryDTO.builder()
                .attemptId(attempt.getId())
                .category(attempt.getQuizCategory())
                .totalQuestions(attempt.getTotalQuestions())
                .correctAnswers(attempt.getCorrectAnswer())
                .earnedPoints(attempt.getEarnedPoints())
                .attemptDate(attempt.getAttemptDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .build());
    }

    @Transactional(readOnly = true)
    public QUizAttemptResponseDTO getQuizAttemptDetail(String username, Long attemptId) {
        Member member = memberRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 퀴즈 시도입니다."));

        // 본인의 퀴즈 시도인지 확인
        if(!attempt.getMember().getId().equals(member.getId())) {
            throw new IllegalArgumentException("본인의 퀴즈 시도만 조회할 수 있습니다.");
        }

        // 답변 상세 정보 조회
        List<QuizAnswer> answers = quizAnswerRepository.findByQuizAttemptOrderById(attempt);

        List<QuizResultDetailDTO> details = answers.stream()
                .map(answer -> QuizResultDetailDTO.builder()
                        .quizId(answer.getQuiz().getId())
                        .question(answer.getQuiz().getQuestion())
                        .correctAnswer(answer.getQuiz().getAnswer())
                        .selectedAnswer(answer.getSelectedAnswer())
                        .isCorrect(answer.getIsCorrect())
                        .explanation(answer.getQuiz().getExplanation())
                        .build())
                .collect(Collectors.toList());

        return QUizAttemptResponseDTO.builder()
                .attemptId(attempt.getId())
                .category(attempt.getQuizCategory())
                .totalQuestions(attempt.getTotalQuestions())
                .correctAnswers(attempt.getCorrectAnswer())
                .earnedPoints(attempt.getEarnedPoints())
                .details(details)
                .build();



    }


}
