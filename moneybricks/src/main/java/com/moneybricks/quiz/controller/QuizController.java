package com.moneybricks.quiz.controller;


import com.moneybricks.quiz.dto.QUizAttemptResponseDTO;
import com.moneybricks.quiz.dto.QuizAttemptRequestDTO;
import com.moneybricks.quiz.dto.QuizDTO;
import com.moneybricks.quiz.dto.QuizHistoryDTO;
import com.moneybricks.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.View;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/quiz")
@Slf4j
public class QuizController {

    private final QuizService quizService;
    private final View error;

    /**
     * 퀴즈 목록 조회 API (5문제 랜덤)
     * @Param count 가져올 문제 수 (기본값 5)
     * @return 퀴즈 목록
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<QuizDTO>> getQuiz(
            @RequestParam(defaultValue = "5") int count) {

        // 카테고리는 전체로 고정 후 모든 카테코리에서 문제 제공
        List<QuizDTO> quizzes = quizService.getQuizzes("전체", count);

        log.info("🔍 퀴즈 개수 확인: {}", quizzes.size());
        return ResponseEntity.ok(quizzes);
    }

    /**
     * 퀴즈 시도 가능 여부 확인 API (하루에 한번만 가능)
     * @Param userDetails 인증된 사용자 정보
     * @return 시도 가능 여부
     */
    @GetMapping("/check-attempt")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> checkQuizAttempt(
            @AuthenticationPrincipal UserDetails userDetails) {

        String username = userDetails.getUsername();
        boolean canAttempt = quizService.canAttemptDaily(username);

        Map<String, Object> response = new HashMap<>();
        response.put("canAttempt", canAttempt);

        return ResponseEntity.ok(response);
    }

    /**
     * 퀴즈 결과 제출 API
     * @Param requestDTO 결과 제출 정보
     * @Param UserDetails 인증된 사용자 정보
     * @return 퀴즈 결과 및 획득 포인트
     */
    @PostMapping("/submit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> submitQuizResult(
            @RequestBody QuizAttemptRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            String username = userDetails.getUsername();
            QUizAttemptResponseDTO response = quizService.submitQuizResult(username, requestDTO);

            return ResponseEntity.ok(response);
        } catch (IllegalStateException e ) {
            // 이미 오늘 퀴즈를 푼 경우
            Map<String, String > errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (IllegalArgumentException e) {
            // 잘못된 입력값 오류
            Map<String, String > errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            // 기타 서버 오류
            log.error("퀴즈 결과 제출 중 오류 발생" , e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * 퀴즈 이력 조회 API
     * @param page 페이지 번호 (기본값 0)
     * @param size 페이지 크기 (기본값 10)
     * @param userDetails 인증된 사용자 정보
     * @return 퀴즈 이력 목록
     */
    @GetMapping("/history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getQuizHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        try {
            String username = userDetails.getUsername();
            Page<QuizHistoryDTO> history = quizService.getQuizHistory(username, page, size);

            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("퀴즈 이력 조회 중 오류 발생", e );
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * 퀴즈 시도 상세 정보 조회 API
     * @param attemptId 시도 ID
     * @param userDetails 인증된 사용자 정보
     * @return 퀴즈 시도 상세 정보
     */
    @GetMapping("/history/{attemptId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getQuizAttemptDetail(
            @PathVariable Long attemptId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            String username = userDetails.getUsername();
            QUizAttemptResponseDTO detail = quizService.getQuizAttemptDetail(username, attemptId);

            return ResponseEntity.ok(detail);
        } catch (IllegalArgumentException e) {
            // 잘못된 입력값 또는 권한 오류
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("퀴즈 시도 상세 정보 조회 중 오류 발생", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }


}
