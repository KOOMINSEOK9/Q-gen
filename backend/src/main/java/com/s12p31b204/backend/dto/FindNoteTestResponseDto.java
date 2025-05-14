package com.s12p31b204.backend.dto;

import java.util.List;

import com.s12p31b204.backend.domain.Test;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@AllArgsConstructor
@ToString
public class FindNoteTestResponseDto {
    private Long testId;
    private Test.Type type;
    private String question;
    private String option1;
    private String option2;
    private String option3;
    private String option4;
    private String answer;
    private String comment;
    private String memo;
    private List<TestHistoryDto> testHistoryList;
    private int incorrectCount;

    public static FindNoteTestResponseDto from(Test test, List<TestHistoryDto> testHistoryList, int incorrectCount) {
        return FindNoteTestResponseDto.builder()
                .testId(test.getTestId())
                .type(test.getType())
                .question(test.getQuestion())
                .option1(test.getOption1())
                .option2(test.getOption2())
                .option3(test.getOption3())
                .option4(test.getOption4())
                .answer(test.getAnswer())
                .comment(test.getComment())
                .memo(test.getMemo())
                .testHistoryList(testHistoryList)
                .incorrectCount(incorrectCount)
                .build();
    }
}
