package com.moneybricks.community.domain;

import com.moneybricks.common.domain.BaseEntity;
import com.moneybricks.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CommunityPost extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pst_id")
    private Long pstId;  // 게시글 ID

    @Column(length = 500, nullable = false)
    private String pstTitle;  // 게시글 제목

    @Column(length = 2000, nullable = false)
    private String pstContent;  // 게시글 내용

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;  // 작성자 (Member 엔티티 참조)



    public void change(String pstTitle, String pstContent) {
        this.pstTitle = pstTitle;
        this.pstContent = pstContent;
    }



    // ✅ 게시글과 연관된 댓글 리스트 추가
    @OneToMany(mappedBy = "post", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

}









