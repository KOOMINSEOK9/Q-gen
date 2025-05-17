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
public class FindTestResponseDto {
    private Long testId;
    private Test.Type type;
    private String question;
    private List<String> explanation;
    private String option1;
    private String option2;
    private String option3;
    private String option4;

    public static FindTestResponseDto from(Test test, List<String> explanation) {
        return FindTestResponseDto.builder()
                .testId(test.getTestId())
                .type(test.getType())
                .question(test.getQuestion())
                .explanation(explanation)
                .option1(test.getOption1())
                .option2(test.getOption2())
                .option3(test.getOption3())
                .option4(test.getOption4())
                .build();
    }
}
