package com.s12p31b204.backend.service;

import com.s12p31b204.backend.domain.Document;
import com.s12p31b204.backend.dto.DocumentDto;
import com.s12p31b204.backend.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final S3Service s3Service;

    @Transactional(readOnly = true)
    public List<DocumentDto> getDocumentsByWorkBookId(Long workBookId) {
        return documentRepository.findByWorkBook_WorkBookId(workBookId)
                .stream()
                .map(DocumentDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteDocument(Long documentId) {
        documentRepository.deleteByDocumentId(documentId);
    }

    @Transactional
    public void deleteDocumentWithS3File(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("문서를 찾을 수 없습니다."));

        // 1. S3 파일 먼저 삭제
        s3Service.deleteFileFromS3(document.getDocumentURL());
        
        // 2. DB 레코드 삭제
        documentRepository.delete(document);
    }
}