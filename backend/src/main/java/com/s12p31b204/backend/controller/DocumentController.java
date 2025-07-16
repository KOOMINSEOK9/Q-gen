package com.s12p31b204.backend.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.s12p31b204.backend.repository.WorkBookRepository;
import com.s12p31b204.backend.domain.Document;
import com.s12p31b204.backend.domain.WorkBook;
import com.s12p31b204.backend.dto.DocumentDto;
import com.s12p31b204.backend.repository.DocumentRepository;
import com.s12p31b204.backend.service.DocumentService;
import com.s12p31b204.backend.service.S3Service;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/document")
public class DocumentController {

    private final S3Service s3Service;
    private final DocumentRepository documentRepository;
    private final WorkBookRepository workBookRepository;
    private final DocumentService documentService;

    // document-01: 파일 업로드
    @PostMapping("/upload")
    public ResponseEntity<Long> uploadDocument(
        @RequestParam("file") MultipartFile file,
        @RequestParam("workBookId") Long workBookId
    ) throws IOException {

        String url = s3Service.upload(file, "documents");

        WorkBook workBook = workBookRepository.findById(workBookId)
            .orElseThrow(() -> new IllegalArgumentException("워크북 없음"));

        Document doc = new Document(
            workBook,
            file.getOriginalFilename(),
            file.getSize(),
            file.getContentType(),
            url
        );

        documentRepository.save(doc);
        return ResponseEntity.ok(doc.getDocumentId());
    }

    // document-02: 파일 전체 조회
    @GetMapping("/workbook/{workBookId}")
    public ResponseEntity<List<DocumentDto>> getDocumentsByWorkBookId(@PathVariable Long workBookId) {
    List<DocumentDto> documents = documentService.getDocumentsByWorkBookId(workBookId);
    return ResponseEntity.ok(documents);
    }

    // document-03: 파일 삭제
    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long documentId) {
        // 문서 존재 여부만 확인
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("삭제할 문서가 존재하지 않습니다."));
    
        s3Service.deleteFileFromS3(document.getDocumentURL());
        documentRepository.delete(document);
        
        return ResponseEntity.noContent().build();
    }
}
