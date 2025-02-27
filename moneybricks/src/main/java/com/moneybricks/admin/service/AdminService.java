package com.moneybricks.admin.service;

import com.moneybricks.admin.dto.AdminMemberDTO;

import java.util.List;

public interface AdminService {
    List<AdminMemberDTO> getAllMembers(); // 모든 회원 정보 조회

    void deleteMember(Long id); // 회원 삭제

    List<AdminMemberDTO> searchMembers(String keyword); // 검색 추가

    List<AdminMemberDTO> getMembersByEmails(List<String> emails); // 이메일 리스트로 회원 조회
}



