package com.moneybricks.community.controller;

import com.moneybricks.community.dto.CommentDTO;
import com.moneybricks.community.service.CommentService;
import com.moneybricks.member.dto.MemberDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/api/community/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/{id}")
    public ResponseEntity<CommentDTO> getComment(@PathVariable Long id) {
        CommentDTO dto = commentService.getComment(id);  //  댓글 조회 로직 호출
        return ResponseEntity.ok(dto);

    }

    @PreAuthorize("permitAll()")  // 인증 없이도 댓글 조회 가능하도록 설정
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByPost(@PathVariable Long postId) {
        log.info("📡 [DEBUG] 댓글 목록 조회 요청: postId={}", postId);
        List<CommentDTO> comments = commentService.getCommentsByPost(postId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody @Valid CommentDTO dto, @AuthenticationPrincipal MemberDTO member) {
        if (member == null || member.getNickname() == null || member.getId() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        dto.setMemberId(member.getId());

        commentService.addComment(dto, member.getNickname());
        return ResponseEntity.ok("댓글이 등록되었습니다.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateComment(@PathVariable Long id, @RequestBody CommentDTO dto, @AuthenticationPrincipal MemberDTO member) {
        commentService.updateComment(id, dto, member.getNickname());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<List<CommentDTO>> deleteComment(@PathVariable Long id, @AuthenticationPrincipal MemberDTO member) {
        return ResponseEntity.ok(commentService.deleteComment(id, member.getNickname()));
}}


