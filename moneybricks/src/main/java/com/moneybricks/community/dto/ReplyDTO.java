// ReplyDTO.java
package com.moneybricks.community.dto;

import com.moneybricks.community.domain.Reply;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReplyDTO {
    private Long replyId;// 대댓글 ID
    @NotNull
    private Long commentId;        // 부모 댓글 ID
    private String replyContent;   // 대댓글 내용

    private String memberNickname;
    private String writer;  // 댓글 작성자 (nickname)
    @NotNull
    private Long memberId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public static ReplyDTO fromEntity(Reply reply) {
        return ReplyDTO.builder()
                .replyId(reply.getReplyId())
                .commentId(reply.getComment().getCmtId())
                .replyContent(reply.getReplyContent())
                .writer(reply.getWriter())  // ✅ DB에 저장된 writer 값 그대로 사용
                .createdAt(reply.getCreatedAt())
                .updatedAt(reply.getUpdatedAt())
                .memberId(reply.getMember() != null ? reply.getMember().getId() : null)
                .build();
    }
}
