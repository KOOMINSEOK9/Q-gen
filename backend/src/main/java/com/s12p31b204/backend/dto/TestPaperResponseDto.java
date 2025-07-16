package com.s12p31b204.backend.dto;

import java.time.LocalDateTime;

import com.s12p31b204.backend.domain.TestPaper;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@AllArgsConstructor
@ToString
public class TestPaperResponseDto {

    private Long testPaperId;

    private String title;

    private int choiceAns;
    private int shortAns;
    private int oxAns;

    private int quantity;

    private LocalDateTime createAt;

    public static TestPaperResponseDto from(TestPaper testPaper) {
        return TestPaperResponseDto.builder()
                .testPaperId(testPaper.getTestPaperId())
                .title(testPaper.getTitle())
                .choiceAns(testPaper.getChoiceAns())
                .shortAns(testPaper.getShortAns())
                .oxAns(testPaper.getOxAns())
                .quantity(testPaper.getQuantity())
                .createAt(testPaper.getCreateAt())
                .build();
    }
}
