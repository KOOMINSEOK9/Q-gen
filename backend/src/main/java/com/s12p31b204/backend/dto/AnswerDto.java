package com.s12p31b204.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnswerDto {
    private int number;
    private String answer;
    private String comment;
    private String type; // "TYPE_CHOICE", "TYPE_OX", "TYPE_SHORT"
}
