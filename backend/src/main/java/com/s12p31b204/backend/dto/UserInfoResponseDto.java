package com.s12p31b204.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class UserInfoResponseDto {
    private boolean login;
    private String nickname;
    private String googleEmail;
    private Long userId;
}
