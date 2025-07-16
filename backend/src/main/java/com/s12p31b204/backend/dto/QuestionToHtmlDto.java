package com.s12p31b204.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuestionToHtmlDto {
    private List<QuestionDto> leftQuestions;
    private List<QuestionDto> rightQuestions;
}