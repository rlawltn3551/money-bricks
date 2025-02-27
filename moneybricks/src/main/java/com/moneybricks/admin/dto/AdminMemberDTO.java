package com.moneybricks.admin.dto;


import com.moneybricks.member.domain.Member;
import com.moneybricks.member.domain.MemberRole;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminMemberDTO {
    private Long id;                // 멤버의 고유 식별자 (DB의 ID 값)
    private String username;        // 로그인용 아이디 (고유)
    private String name;            // 멤버의 실제 이름
    private String nickname;        // 멤버의 닉네임
    private String email;           // 멤버의 이메일 주소
    private String ssn;             // 멤버의 주민등록번호(7자리)
    private boolean emailAgreed;    // 이메일 수신 동의 여부
    private boolean deleted;        // 회원 탈퇴 여부 (탈퇴한 경우 true)
    private List<String> roles;     // 멤버의 역할 목록

    // Member -> AdminMemberDTO 변환
    public static AdminMemberDTO fromEntity(Member member) {
        return AdminMemberDTO.builder()
                .id(member.getId())
                .username(member.getUsername())
                .name(member.getName())
                .nickname(member.getNickname())
                .email(member.getEmail())
                .ssn(member.getSsn())
                .emailAgreed(member.isEmailAgreed())
                .deleted(member.isDeleted())
                .roles(member.getMemberRoleList().stream()
                        .map(MemberRole::name)  // 역할을 String 값으로 변환
                        .collect(Collectors.toList()))  // 역할 목록
                .build();
    }
}
