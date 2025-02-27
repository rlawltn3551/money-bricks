package com.moneybricks.community.service;

import com.moneybricks.community.dto.ReplyDTO;
import java.util.List;

public interface ReplyService {
    Long addReply(ReplyDTO dto, String nickname);  // ✅ 대댓글 추가 (로그인한 사용자의 닉네임 사용)
    List<ReplyDTO> getRepliesByComment(Long commentId);  // ✅ 특정 댓글의 대댓글 목록 조회
    Long countRepliesByComment(Long commentId);  // ✅ 특정 댓글에 대한 대댓글 개수 조회
    void updateReply(Long replyId, String content, String nickname);  // ✅ 본인만 대댓글 수정 가능
    List<ReplyDTO> deleteReply(Long replyId, String nickname);  // ✅ 본인만 대댓글 삭제 가능 (삭제 후 최신 목록 반환)
}

