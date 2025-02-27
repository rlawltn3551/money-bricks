//package com.moneybricks.community.service;
//
//import com.moneybricks.community.dto.CommunityPostDTO;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.List;
//import java.util.Set;
//
//public interface CommunityPostService {
//    Long createPost(CommunityPostDTO dto, List<MultipartFile> files) throws IOException;  // ✅ 수정됨
//    CommunityPostDTO getPost(Long pstId);
//    void updatePost(Long pstId, CommunityPostDTO dto, List<MultipartFile> files, Set<String> keepFileNames) throws IOException;  // ✅ 수정됨
//    void deletePost(Long pstId) throws IOException;  // ✅ IOException 추가
//    List<CommunityPostDTO> getAllPosts();
//}

package com.moneybricks.community.service;


import com.moneybricks.community.dto.CommunityPostDTO;
import java.util.List;

public interface CommunityPostService {
    Long createPost(CommunityPostDTO dto);  // 게시글 생성
    CommunityPostDTO getPost(Long pstId);   // 게시글 조회
    void updatePost(Long pstId, CommunityPostDTO dto);  // 게시글 수정
    void deletePost(Long pstId);  // 게시글 삭제
    List<CommunityPostDTO> getAllPosts();  // 게시글 목록 조회

}
