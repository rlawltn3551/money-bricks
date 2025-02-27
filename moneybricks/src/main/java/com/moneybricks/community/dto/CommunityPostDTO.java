package com.moneybricks.community.dto;

import com.moneybricks.member.domain.Member;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommunityPostDTO {

    private Long pstId;                    // 게시글 ID
    private String pstTitle;               // 게시글 제목
    private String pstContent;             // 게시글 내용
    private String memberNickname;         // 작성자 닉네임
    private Long memberId;                 // 작성자 ID

    private LocalDateTime createdAt;       // 생성일
    private LocalDateTime updatedAt;       // 수정일



    // 게시글 작성자 정보 (옵션)
    private Member memberEntity;

    // 작성자 정보 추가 메서드
    public void setMemberInfo(Member member) {
        if (member != null) {
            this.memberId = member.getId();
            this.memberNickname = member.getNickname();
        }
    }
}
