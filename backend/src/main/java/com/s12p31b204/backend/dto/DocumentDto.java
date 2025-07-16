package com.s12p31b204.backend.dto;

import com.s12p31b204.backend.domain.Document;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class DocumentDto {
    private Long documentId;
    private String documentName;
    private long documentSize;
    private String documentType;
    private String documentURL;
    private Long workBookId;
    private LocalDateTime createAt;

    public DocumentDto(Document document) {
        this.documentId = document.getDocumentId();
        this.documentName = document.getDocumentName();
        this.documentSize = document.getDocumentSize();
        this.documentType = document.getDocumentType();
        this.documentURL = document.getDocumentURL();
        this.workBookId = document.getWorkBook().getWorkBookId();
        this.createAt = document.getCreateAt();
    }
}