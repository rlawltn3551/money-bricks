package com.moneybricks.community.domain;

import com.moneybricks.common.domain.BaseEntity;
import com.moneybricks.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Comment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long cmtId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pst_id", nullable = false )
    private CommunityPost post;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private String writer;

    @Column(name = "cmt_content", length = 1000, nullable = false)
    private String cmtContent;


     //🟢 대댓글 리스트 (연결)
   @OneToMany(mappedBy = "comment", cascade = CascadeType.REMOVE, orphanRemoval = true)
private List<Reply> replies = new ArrayList<>();



    public void changeContent(String cmtContent) {
        this.cmtContent = cmtContent;
    }
}



