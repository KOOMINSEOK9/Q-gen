package com.s12p31b204.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuestionDto {
    private int number;
    private String text;
    private String explanationType;
    private List<String> explanations;
    private List<String> options;
    private String type; // "TYPE_CHOICE", "TYPE_OX", "TYPE_SHORT"
}
