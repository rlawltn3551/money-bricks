package com.moneybricks.community.service;

import com.moneybricks.community.dto.CommentDTO;
import java.util.List;

public interface CommentService {
    void addComment(CommentDTO dto, String nickname);  // ✅ nickname 사용
    CommentDTO getComment(Long cmtId);
    void updateComment(Long cmtId, CommentDTO dto, String nickname);
    List<CommentDTO> deleteComment(Long cmtId, String nickname);
    List<CommentDTO> getCommentsByPost(Long postId);
}



