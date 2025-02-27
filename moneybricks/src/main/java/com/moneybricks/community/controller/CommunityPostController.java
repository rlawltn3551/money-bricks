//로그인 이후 상태 0221
package com.moneybricks.community.controller;

import com.moneybricks.common.util.JWTUtil;
import com.moneybricks.community.dto.CommunityPostDTO;
import com.moneybricks.community.service.CommunityPostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.moneybricks.member.dto.MemberDTO;

import java.util.List;

@RestController
@RequestMapping("/api/community/posts")
@RequiredArgsConstructor
@Log4j2
public class CommunityPostController {

    private final CommunityPostService postService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<Long> createPost(@RequestBody CommunityPostDTO dto, @AuthenticationPrincipal MemberDTO member) {
        if (member == null || member.getNickname() == null || member.getId() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // 로그인되지 않은 경우
        }
        dto.setMemberId(member.getId());
        dto.setMemberNickname(member.getNickname()); //  로그인한 사용자의 닉네임 설정
        Long pstId = postService.createPost(dto);
        return ResponseEntity.ok(pstId);
    }


    @GetMapping
    public ResponseEntity<List<CommunityPostDTO>> getAllPosts() {
        List<CommunityPostDTO> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }


    @GetMapping("/{id}")
    public ResponseEntity<CommunityPostDTO> getPost(@PathVariable Long id) {
        CommunityPostDTO dto = postService.getPost(id);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ResponseEntity<Void> updatePost(@PathVariable Long id, @RequestBody CommunityPostDTO dto, @AuthenticationPrincipal MemberDTO member) {
        log.info("📡 [DEBUG] 게시글 수정 요청: ID={}, DTO={}", id, dto);

        // ✅ 기존 게시글 정보 가져오기
        CommunityPostDTO existingPost = postService.getPost(id);

        // ✅ 로그인한 사용자가 작성자인지 확인 (닉네임 비교)
        if (!existingPost.getMemberNickname().equals(member.getNickname())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        postService.updatePost(id, dto);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<List<CommunityPostDTO>> deletePost(@PathVariable Long id, @AuthenticationPrincipal MemberDTO member) {
        log.info("📡 [DEBUG] 게시글 삭제 요청: ID={}", id);

        // ✅ 기존 게시글 정보 가져오기
        CommunityPostDTO existingPost = postService.getPost(id);

        // ✅ 로그인한 사용자가 작성자인지 확인 (닉네임 비교)
        if (!existingPost.getMemberNickname().equals(member.getNickname())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        // ✅ 게시글 삭제
        postService.deletePost(id);

        // ✅ 최신 게시글 리스트를 반환하여 문제 방지
        List<CommunityPostDTO> updatedPosts = postService.getAllPosts();
        return ResponseEntity.ok(updatedPosts);
    }



}




