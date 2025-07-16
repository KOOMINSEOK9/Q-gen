package com.s12p31b204.backend.util;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseData<T> {
    private boolean success;         // 성공 여부
    private int status;              // HTTP 상태 코드
    private String message;          // 메시지
    private T data;                  // 실제 데이터
    private String timestamp;        // 응답 시간
    private String path;             // 요청 경로
}
