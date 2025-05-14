package com.s12p31b204.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GenerateTestPaperRequestDto {
    private Long workBookId;
    private String title;
    private int choiceAns;
    private int shortAns;
    private int oxAns;
    private int wordAns;
    private int quantity;
    private List<Long> documentIds;
}
