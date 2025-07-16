package com.s12p31b204.backend.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.ToString;
import java.time.LocalDateTime;

import com.s12p31b204.backend.domain.TestHistory;

@Data
@Builder
@AllArgsConstructor
@ToString
public class TestHistoryDto {
    private long testHistoryId;
    private long testId;
    private LocalDateTime createAt;
    private String userAnswer;
    private boolean isCorrect;

    public static TestHistoryDto from(TestHistory testHistory) {
        return TestHistoryDto.builder()
                .testHistoryId(testHistory.getTestHistoryId())
                .testId(testHistory.getTest().getTestId())
                .createAt(testHistory.getCreateAt())
                .userAnswer(testHistory.getUserAnswer())
                .isCorrect(testHistory.isCorrect())
                .build();
    }
}