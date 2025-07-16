package com.s12p31b204.backend.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.ToString;

@Data
@Builder
@AllArgsConstructor
@ToString
public class UpdateNoteMemoRequestDto {
    private String memo;

    public static UpdateNoteMemoRequestDto from(String memo) {
        return UpdateNoteMemoRequestDto.builder()
                .memo(memo)
                .build();
    }
}
