package com.s12p31b204.backend.controller;

import java.io.IOException;
import java.util.List;

import org.apache.http.protocol.HTTP;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;

import com.s12p31b204.backend.oauth2.CustomOAuth2User;
import com.s12p31b204.backend.repository.WorkBookRepository;
import com.s12p31b204.backend.domain.Document;
import com.s12p31b204.backend.domain.WorkBook;
import com.s12p31b204.backend.dto.FindDocumentResponseDto;
import com.s12p31b204.backend.repository.DocumentRepository;
import com.s12p31b204.backend.service.AuthorizationService;
import com.s12p31b204.backend.service.DocumentService;
import com.s12p31b204.backend.service.S3Service;
import com.s12p31b204.backend.util.ApiResponse;
import com.s12p31b204.backend.util.ResponseData;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/document")
public class DocumentController {

    private final S3Service s3Service;
    private final DocumentService documentService;
    private final AuthorizationService authorizationService;

    // document-01: 파일 업로드
    @PostMapping("/upload")
    public ResponseEntity<ResponseData<Long>> uploadDocument(
        @RequestParam("file") MultipartFile file,
        @RequestParam("workBookId") Long workBookId,
        @AuthenticationPrincipal CustomOAuth2User user,
        HttpServletRequest request
    ) {
        try {
            if(authorizationService.checkWorkBookAuthorization(user.getUserId(), workBookId)) {
                String url = s3Service.upload(file, "documents");

                Long documentId = documentService.createDocument(file, workBookId, url);

                return ApiResponse.success(documentId, "파일 업로드 성공", HttpStatus.CREATED, request.getRequestURI());

            } else {
                return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
            }

        } catch (Exception e) {
            return ApiResponse.failure(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
        }

    }

    // document-02: 파일 전체 조회
    @GetMapping("/workbook/{workBookId}")
    public ResponseEntity<ResponseData<List<FindDocumentResponseDto>>> getDocumentsByWorkBookId(
            @PathVariable Long workBookId,
            @AuthenticationPrincipal CustomOAuth2User user,
            HttpServletRequest request) {
        if(authorizationService.checkWorkBookAuthorization(user.getUserId(), workBookId)) {
            List<FindDocumentResponseDto> documents = documentService.getDocumentsByWorkBookId(workBookId);
            return ApiResponse.success(documents, "파일 전체 조회 성공", HttpStatus.OK, request.getRequestURI());
        }
        else {
            return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
        }

    }

    // document-03: 파일 삭제
    @DeleteMapping("/{documentId}")
    public ResponseEntity<ResponseData<Void>> deleteDocument(
            @PathVariable Long documentId,
            @AuthenticationPrincipal CustomOAuth2User user,
            HttpServletRequest request
    ) {
        try {
            if(authorizationService.checkDocumentAuthorization(user.getUserId(), documentId)) {
                documentService.deleteDocumentWithS3File(documentId);
                return ResponseEntity.noContent().build();
            } else {
                return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
            }

        } catch (Exception e) {
            return ApiResponse.failure(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
        }
    }

    // document-04: 파일 상세 조회
    @GetMapping("/{documentId}")
    public ResponseEntity<ResponseData<FindDocumentResponseDto>> getDocument(
            @PathVariable Long documentId,
            @AuthenticationPrincipal CustomOAuth2User user,
            HttpServletRequest request
    ) {
        FindDocumentResponseDto document = documentService.getDocument(documentId);
        return ApiResponse.success(document, "파일 상세 조회 성공", HttpStatus.OK, request.getRequestURI());
    }
    
    // document-05: 텍스트 입력 txt파일 변환
    @PostMapping("/text")
    public ResponseEntity<ResponseData<FindDocumentResponseDto>> convertTextToTxt(
            @RequestParam("workBookId") Long workBookId,
            @RequestParam("text") String text,
            HttpServletRequest request
    ) {
        FindDocumentResponseDto document = documentService.convertTextToTxt(workBookId, text);
        return ApiResponse.success(document, "txt파일 변환 성공", HttpStatus.OK, request.getRequestURI());
    }

    // document-06: url txt파일 변환
    @PostMapping("/url")
    public ResponseEntity<ResponseData<FindDocumentResponseDto>> convertUrlToTxt(
            @RequestParam("workBookId") Long workBookId,
            @RequestParam("url") String url,
            HttpServletRequest request
    ) {
        FindDocumentResponseDto document = documentService.convertUrlToTxt(workBookId, url);
        return ApiResponse.success(document, "url txt파일 변환 성공", HttpStatus.OK, request.getRequestURI());
    }

    // document-07: 파일 다운로드
    @GetMapping("/download/{documentId}")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable Long documentId) {
        Document document = documentService.getDocumentEntity(documentId); // Document 엔티티 직접 반환
        String fileName = document.getDocumentName();
        String fileType = document.getDocumentType();
        String fileUrl = document.getDocumentURL();
        byte[] fileBytes = s3Service.readFileFromS3AsBytes(fileUrl);
        ByteArrayResource resource = new ByteArrayResource(fileBytes);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .header(HttpHeaders.CONTENT_TYPE, fileType)
                .contentLength(fileBytes.length)
                .body(resource);
    }
}