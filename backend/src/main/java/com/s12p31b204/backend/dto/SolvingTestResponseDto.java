package com.s12p31b204.backend.dto;

import com.s12p31b204.backend.domain.Test;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@AllArgsConstructor
@ToString
public class SolvingTestResponseDto {
    private Long testId;
    private Test.Type type;
    private String question;
    private String option1;
    private String option2;
    private String option3;
    private String option4;
    private String userAnswer;
    private String correctAnswer;
    private boolean isCorrect;
    private String comment;

    public static SolvingTestResponseDto from(Test test, String userAnswer, boolean isCorrect) {
        return SolvingTestResponseDto.builder()
                .testId(test.getTestId())
                .type(test.getType())
                .question(test.getQuestion())
                .option1(test.getOption1())
                .option2(test.getOption2())
                .option3(test.getOption3())
                .option4(test.getOption4())
                .userAnswer(userAnswer)
                .correctAnswer(test.getAnswer())
                .isCorrect(isCorrect)
                .comment(test.getComment())
                .build();
    }
}
