package com.moneybricks.community.service;

import com.moneybricks.community.domain.Comment;
import com.moneybricks.community.domain.Reply;
import com.moneybricks.community.dto.ReplyDTO;
import com.moneybricks.community.repository.CommentRepository;
import com.moneybricks.community.repository.ReplyRepository;
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
public class ReplyServiceImpl implements ReplyService {

    private final ReplyRepository replyRepository;
    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;

    @Override
    public Long addReply(ReplyDTO dto, String nickname) {
        log.info("  addReply 호출됨. commentId={}, writer={}, memberId={}", dto.getCommentId(), nickname,dto.getMemberId());

        //  `memberId`를 `dto`에서 가져오기 (nickname이 아니라 `id` 사용)
        Member member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));


        Comment comment = commentRepository.findById(dto.getCommentId())
                .orElseThrow(() -> new IllegalArgumentException("부모 댓글이 존재하지 않습니다."));

        Reply reply = Reply.builder()
                .replyContent(dto.getReplyContent())
                .comment(comment)
                .writer(nickname)
                .member(member)
                .build();

        replyRepository.save(reply);
        log.info(" 대댓글 저장 완료: replyId={}", reply.getReplyId());

        return reply.getReplyId();
    }

    @Override
    public List<ReplyDTO> getRepliesByComment(Long commentId) {
        return replyRepository.findByCommentId(commentId)

                .stream().map(ReplyDTO::fromEntity)  //  여기서 memberId 포함되는지 확인
                .collect(Collectors.toList());
    }

    @Override
    public Long countRepliesByComment(Long commentId) {
        return replyRepository.countByCommentId(commentId);
    }

    @Override
    public void updateReply(Long replyId, String content, String nickname) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new IllegalArgumentException("대댓글이 존재하지 않습니다."));

        if (!reply.getWriter().equals(nickname)) {
            throw new IllegalArgumentException("본인만 대댓글을 수정할 수 있습니다.");
        }

        reply.changeContent(content);
        replyRepository.save(reply);
    }

    @Override
    public List<ReplyDTO> deleteReply(Long replyId, String nickname) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new IllegalArgumentException("대댓글이 존재하지 않습니다."));

        if (!reply.getWriter().equals(nickname)) {
            throw new IllegalArgumentException("본인만 대댓글을 삭제할 수 있습니다.");
        }

        replyRepository.delete(reply);
        log.info("✅ 대댓글 삭제 완료: replyId={}", replyId);

        return getRepliesByComment(reply.getComment().getCmtId());
    }
}

