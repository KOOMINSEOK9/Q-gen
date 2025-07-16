package com.s12p31b204.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnswerToHtmlDto {
    private List<AnswerDto> leftAnswers;
    private List<AnswerDto> rightAnswers;
}
