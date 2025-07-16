package com.s12p31b204.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@AllArgsConstructor
@ToString
public class SolvingTestRequestDto {
    private Long testId;
    private String userAnswer;
}
