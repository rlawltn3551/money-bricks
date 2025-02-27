package com.moneybricks.admin.repository;

import com.moneybricks.member.domain.Member;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AdminRepository extends JpaRepository<Member, String> {

    @EntityGraph(attributePaths = {"memberRoleList"})
    @Query("SELECT m FROM Member m")
    List<Member> getAllWithRoles();

    @EntityGraph(attributePaths = {"memberRoleList"})
    @Query("SELECT m FROM Member m WHERE m.username LIKE %:keyword% OR m.email LIKE %:keyword%")
    List<Member> searchByKeyword(@Param("keyword") String keyword);

    @EntityGraph(attributePaths = {"memberRoleList"})
    List<Member> findByEmailIn(List<String> emails);

    boolean existsById(Long id);

    @EntityGraph(attributePaths = {"memberRoleList"})
    Member findByIdAndDeletedFalse(Long id);
}
