package com.s12p31b204.backend.util;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


public class ApiResponse {

    public static <T> ResponseEntity<ResponseData<T>> success(T data, String message, HttpStatus status, String path) {
        ResponseData response = ResponseData.builder()
                .success(true)
                .status(status.value())
                .data(data)
                .message(message)
                .timestamp(LocalDateTime.now().toString())
                .path(path)
                .build();
        return ResponseEntity.status(status).body(response);
    }

    public static <T> ResponseEntity<ResponseData<T>> failure(String message, HttpStatus status, String path) {
        ResponseData response = ResponseData.builder()
                .success(false)
                .status(status.value())
                .data(null)
                .message(message)
                .timestamp(LocalDateTime.now().toString())
                .path(path)
                .build();
        return ResponseEntity.status(status).body(response);
    }

}
