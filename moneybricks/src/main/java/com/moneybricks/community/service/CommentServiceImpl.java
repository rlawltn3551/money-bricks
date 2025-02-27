package com.moneybricks.community.service;

import com.moneybricks.community.domain.Comment;
import com.moneybricks.community.domain.CommunityPost;
import com.moneybricks.community.dto.CommentDTO;
import com.moneybricks.community.repository.CommentRepository;
import com.moneybricks.community.repository.CommunityPostRepository;
import com.moneybricks.member.domain.Member;
import com.moneybricks.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final CommunityPostRepository postRepository;
    private final MemberRepository memberRepository;

    @Override
    public void addComment(CommentDTO dto, String nickname) {


        //  댓글 찾기
        CommunityPost post = postRepository.findByPstId(dto.getPstId())
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        //  `memberId`를 `dto`에서 가져오기 (nickname이 아니라 `id` 사용)
        Member member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        //  댓글 생성 (`member`도 저장)
        Comment comment = Comment.builder()
                .cmtContent(dto.getCmtContent())
                .post(post)
                .member(member) //
                .writer(nickname)  //
                .build();

        //  댓글 저장
        commentRepository.save(comment);

    }


    @Override
    public CommentDTO getComment(Long cmtId) {
        Comment comment = commentRepository.findById(cmtId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));
        return CommentDTO.fromEntity(comment);
    }

    @Override
    public void updateComment(Long cmtId, CommentDTO dto, String nickname) {
        Comment comment = commentRepository.findById(cmtId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));

        if (!comment.getWriter().equals(nickname)) {
            throw new IllegalArgumentException("본인만 댓글을 수정할 수 있습니다.");
        }

        comment.changeContent(dto.getCmtContent());
        commentRepository.save(comment);
    }

    @Override
    public List<CommentDTO> deleteComment(Long cmtId, String nickname) {
        Comment comment = commentRepository.findById(cmtId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));

        if (!comment.getWriter().equals(nickname)) {
            throw new IllegalArgumentException("본인만 댓글을 삭제할 수 있습니다.");
        }

        commentRepository.delete(comment);


        return getCommentsByPost(comment.getPost().getPstId());
    }

@Override
public List<CommentDTO> getCommentsByPost(Long postId) {
    List<Comment> comments = commentRepository.findAllByPostPstId(postId);
//테스트
    for (Comment comment : comments) {
        log.info(" [DEBUG] 댓글 ID={}, writer={}, memberId={}",
                comment.getCmtId(), comment.getWriter(), comment.getMember().getId());
    }

    // ✅ `CommentDTO.fromEntity(comment)`를 이용하여 변환
    return comments.stream()
            .map(comment -> CommentDTO.builder()
                    .cmtId(comment.getCmtId())
                    .cmtContent(comment.getCmtContent())
                    .pstId(comment.getPost().getPstId())
                    .memberId(comment.getMember().getId())  // ✅ `memberId` 설정
                    .writer(comment.getWriter())  // ✅ `writer` 설정
                    .createdAt(comment.getCreatedAt())
                    .updatedAt(comment.getUpdatedAt())
                    .build())
            .collect(Collectors.toList());
}

}




