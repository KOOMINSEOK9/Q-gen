package com.s12p31b204.backend.dto;

import com.s12p31b204.backend.domain.TestPaper;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.ToString;

@Data
@Builder
@AllArgsConstructor
@ToString
public class FindNoteTestPaperResponseDto {
    private Long testPaperId;
    private String title;
    private int quantity;

    public static FindNoteTestPaperResponseDto from(TestPaper testPaper) {
        return FindNoteTestPaperResponseDto.builder()
                .testPaperId(testPaper.getTestPaperId())
                .title(testPaper.getTitle())
                .quantity(testPaper.getQuantity())
                .build();
    }
}
