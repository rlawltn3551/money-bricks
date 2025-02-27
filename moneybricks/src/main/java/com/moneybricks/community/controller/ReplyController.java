package com.moneybricks.community.controller;

import com.moneybricks.community.dto.ReplyDTO;
import com.moneybricks.community.service.ReplyService;
import com.moneybricks.member.dto.MemberDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/replies")
@RequiredArgsConstructor
@Log4j2
public class ReplyController {

    private final ReplyService replyService;

    //  대댓글 등록 (로그인한 사용자 정보 포함)
    @PostMapping
    public ResponseEntity<Long> addReply(@RequestBody ReplyDTO replyDTO, @AuthenticationPrincipal MemberDTO member) {
        if (member == null || member.getNickname() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Long replyId = replyService.addReply(replyDTO, member.getNickname());
        return ResponseEntity.ok(replyId);
    }

    //  특정 댓글의 대댓글 목록 조회
    @GetMapping("/comment/{commentId}")
    public ResponseEntity<List<ReplyDTO>> getRepliesByComment(@PathVariable Long commentId) {
        List<ReplyDTO> replies = replyService.getRepliesByComment(commentId);
        log.info("📡 [DEBUG] 대댓글 응답 데이터: {}", replies);
        return ResponseEntity.ok(replies);
    }

    //  특정 댓글의 대댓글 개수 조회
    @GetMapping("/comment/{commentId}/count")
    public ResponseEntity<Long> countRepliesByComment(@PathVariable Long commentId) {
        return ResponseEntity.ok(replyService.countRepliesByComment(commentId));
    }

    //  대댓글 수정 (본인만 가능)
    @PutMapping("/{replyId}")
    public ResponseEntity<Void> updateReply(@PathVariable Long replyId, @RequestBody ReplyDTO replyDTO, @AuthenticationPrincipal MemberDTO member) {
        if (member == null || member.getNickname() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        replyService.updateReply(replyId, replyDTO.getReplyContent(), member.getNickname());
        return ResponseEntity.ok().build();
    }

    //  대댓글 삭제 (삭제 후 최신 목록 반환)
    @DeleteMapping("/{replyId}")
    public ResponseEntity<List<ReplyDTO>> deleteReply(@PathVariable Long replyId, @AuthenticationPrincipal MemberDTO member) {
        if (member == null || member.getNickname() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ReplyDTO> updatedReplies = replyService.deleteReply(replyId, member.getNickname());
        return ResponseEntity.ok(updatedReplies); // ✅ 삭제 후 최신 대댓글 목록 반환
    }

}


