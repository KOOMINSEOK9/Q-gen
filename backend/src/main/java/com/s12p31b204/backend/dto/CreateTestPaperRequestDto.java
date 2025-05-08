package com.s12p31b204.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CreateTestPaperRequestDto {
    private Long workBookId;
    private String title;
    private int choiceAns;
    private int shortAns;

    @JsonProperty("OXAns")
    private int OXAns;

    private int wordAns;
    private int quantity;
}
