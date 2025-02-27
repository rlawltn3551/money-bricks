package com.moneybricks.community.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.moneybricks.community.domain.Comment;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {


    private Long cmtId;

    @NotNull(message = "댓글 내용은 필수입니다.")
    private String cmtContent;

    @NotNull(message = "게시글 ID는 필수입니다.")
    @JsonProperty("pstId")  //  JSON 필드명 일치
    private Long pstId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String writer;  // ✅ 댓글 작성자의 닉네임 (게시글 작성자와 구분됨)
    private Long memberId;
    // Comment → CommentDTO 변환 메서드
    public static CommentDTO fromEntity(Comment comment) {
        return CommentDTO.builder()
                .memberId(comment.getMember().getId())
                .cmtId(comment.getCmtId())
                .cmtContent(comment.getCmtContent())
                .writer(comment.getWriter())  //  저장된 닉네임 사용
                .pstId(comment.getPost().getPstId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
