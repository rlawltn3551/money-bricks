// Reply.java
package com.moneybricks.community.domain;

import com.moneybricks.common.domain.BaseEntity;
import com.moneybricks.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"comment"})
public class Reply extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reply_id")
    private Long replyId;

    //  부모 댓글(Comment) 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", nullable = false)
    private Comment comment;

    //  대댓글 내용
    @Column(name = "reply_content", length = 500, nullable = false)
    private String replyContent;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "writer", nullable = false)  //  닉네임 저장
    private String writer;

    //  대댓글 수정
    public void changeContent(String content) {
        this.replyContent = content;
    }
}
