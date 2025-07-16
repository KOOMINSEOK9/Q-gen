package com.s12p31b204.backend.dto;

import com.s12p31b204.backend.domain.Document;
import com.s12p31b204.backend.service.S3Service;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@AllArgsConstructor
@ToString
public class FindDocumentResponseDto {
    private Long documentId;
    private String documentName;
    private String documentType;
    private String documentContent;

    public static FindDocumentResponseDto from(Document document, S3Service s3Service) {
        String content;
        if (document.getDocumentType().toLowerCase().contains("txt") || document.getDocumentType().toLowerCase().contains("text")) {
            content = s3Service.readTxtFileFromS3(document.getDocumentURL());
        } else {
            content = null;
        }
        return FindDocumentResponseDto.builder()
            .documentId(document.getDocumentId())
            .documentName(document.getDocumentName())
            .documentType(document.getDocumentType())
            .documentContent(content)
            .build();
    }
}
