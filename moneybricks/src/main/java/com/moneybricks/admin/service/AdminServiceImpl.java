package com.moneybricks.admin.service;

import com.moneybricks.admin.dto.AdminMemberDTO;
import com.moneybricks.admin.repository.AdminRepository;
import com.moneybricks.member.domain.Member;
import com.moneybricks.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final MemberRepository memberRepository;

    @Override
    public List<AdminMemberDTO> getAllMembers() {
        return adminRepository.getAllWithRoles().stream()
                .map(AdminMemberDTO::fromEntity) // Member → AdminMemberDTO 변환
                .collect(Collectors.toList());
    }

    @Override
    public void deleteMember(Long id) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("회원이 존재하지 않습니다.");
        }

        Member member = adminRepository.findByIdAndDeletedFalse(id);

        member.changeDeleted(true);
        memberRepository.save(member);
    }

    @Override
    public List<AdminMemberDTO> searchMembers(String keyword) {
        return adminRepository.searchByKeyword(keyword).stream()
                .map(AdminMemberDTO::fromEntity) // Member → AdminMemberDTO 변환
                .collect(Collectors.toList());
    }


    @Override
    public List<AdminMemberDTO> getMembersByEmails(List<String> emails) {
        return adminRepository.findByEmailIn(emails)
                .stream()
                .map(AdminMemberDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
