package com.s12p31b204.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TestPaperToHtmlDto {
    private String title;
    private String createAt;
    private int quantity;
}
