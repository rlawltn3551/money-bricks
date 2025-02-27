//0220 정상
package com.moneybricks.community.service;

import com.moneybricks.community.domain.CommunityPost;
import com.moneybricks.community.dto.CommunityPostDTO;
import com.moneybricks.community.repository.CommentRepository;
import com.moneybricks.community.repository.CommunityPostRepository;
import com.moneybricks.member.domain.Member;
import com.moneybricks.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class CommunityPostServiceImpl implements CommunityPostService {


    private final CommunityPostRepository postRepository;
    private final MemberRepository memberRepository;
    private final CommentRepository commentRepository;
    private final CommunityPostRepository communityPostRepository;

    @Override

    public Long createPost(CommunityPostDTO dto) {

        Member member =
                memberRepository.findById(dto.getMemberId())
                        .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        // 2⃣ CommunityPost 생성
        CommunityPost post = CommunityPost.builder()
                .pstTitle(dto.getPstTitle())
                .pstContent(dto.getPstContent())
                .member(member) // 로그인 없이 memberId로 회원 연결
                .build();


        postRepository.save(post);
        return post.getPstId();
    }


    @Override
    public CommunityPostDTO getPost(Long pstId) {
        CommunityPost post = postRepository.findById(pstId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        return CommunityPostDTO.builder()
                .pstId(post.getPstId())
                .pstTitle(post.getPstTitle())
                .pstContent(post.getPstContent())
                .memberNickname(post.getMember().getNickname()) // ✅ 닉네임 포함
                .memberId(post.getMember().getId()) // ✅ 작성자 ID 포함 (필수!!)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    @Override
    public void updatePost(Long pstId, CommunityPostDTO dto) {
        CommunityPost post = postRepository.findById(pstId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        post.change(dto.getPstTitle(), dto.getPstContent());
    }

    @Override
    @Transactional
    public void deletePost(Long pstId) {
        // ✅ 한 번에 대댓글 → 댓글 → 게시글 삭제
        communityPostRepository.deleteRepliesByPostId(pstId);
        communityPostRepository.deleteCommentsByPostId(pstId);
        communityPostRepository.deletePostByPostId(pstId);
    }


    @Override
    public List<CommunityPostDTO> getAllPosts() {
        List<CommunityPost> posts = postRepository.findAll();
        return posts.stream()
                .map(post -> CommunityPostDTO.builder()
                        .pstId(post.getPstId())
                        .pstTitle(post.getPstTitle())
                        .pstContent(post.getPstContent())
                        .memberNickname(
                                Optional.ofNullable(post.getMember())
                                        .map(Member::getNickname)
                                        .orElse("알 수 없음")
                        )
                        .createdAt(post.getCreatedAt())
                        .updatedAt(post.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());
    }


    private CommunityPostDTO convertToDTO(CommunityPost post) {
        return CommunityPostDTO.builder()
                .pstId(post.getPstId())
                .pstTitle(post.getPstTitle())
                .pstContent(post.getPstContent())
                .memberNickname(post.getMember().getNickname())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}




