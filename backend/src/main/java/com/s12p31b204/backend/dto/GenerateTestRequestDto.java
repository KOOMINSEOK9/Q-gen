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
public class GenerateTestRequestDto {

    private List<String> s3Urls;

    private int choiceAns;

    private int oxAns;

    private int shortAns;
}
