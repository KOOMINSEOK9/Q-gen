package com.s12p31b204.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.s12p31b204.backend.dto.WorkBookRequestDto;
import com.s12p31b204.backend.dto.WorkBookResponseDto;
import com.s12p31b204.backend.oauth2.CustomOAuth2User;
import com.s12p31b204.backend.service.AuthorizationService;
import com.s12p31b204.backend.service.WorkBookService;
import com.s12p31b204.backend.util.ApiResponse;
import com.s12p31b204.backend.util.ResponseData;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/workbooks")
@RequiredArgsConstructor
public class WorkBookController {

    private final WorkBookService workBookService;
    private final AuthorizationService authorizationService;

    @PostMapping("/{userId}")
    public ResponseEntity<ResponseData<WorkBookResponseDto>> createWorkBook(
            @PathVariable Long userId,
            @RequestBody WorkBookRequestDto requestDto,
            HttpServletRequest request) {
        return ApiResponse.success(
                workBookService.createWorkBook(userId, requestDto),
                "문제집 생성 성공",
                HttpStatus.CREATED,
                request.getRequestURI());
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<ResponseData<List<WorkBookResponseDto>>> getAllWorkBooks(@PathVariable Long userId, HttpServletRequest request) {
        return ApiResponse.success(
                workBookService.getAllWorkBooksByUser(userId),
                "문제집 조회 성공",
                HttpStatus.OK,
                request.getRequestURI());
    }

    @PatchMapping("/{workBookId}")
    public ResponseEntity<ResponseData<Void>> updateWorkBookTitle(
            @PathVariable Long workBookId,
            @RequestBody WorkBookRequestDto requestDto,
            @AuthenticationPrincipal CustomOAuth2User user,
            HttpServletRequest request) {
        if(authorizationService.checkWorkBookAuthorization(user.getUserId(), workBookId)) {
            workBookService.updateWorkBookTitle(workBookId, requestDto.getTitle());
            return ApiResponse.success(null, "문제집 변경 성공", HttpStatus.NO_CONTENT, request.getRequestURI());
        } else {
            return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
        }
    }
    
    @DeleteMapping("/{workBookId}")
    public ResponseEntity<ResponseData<Void>> deleteWorkBook(
            @PathVariable Long workBookId,
            @AuthenticationPrincipal CustomOAuth2User user,
            HttpServletRequest request
    ) {
        if(authorizationService.checkWorkBookAuthorization(user.getUserId(), workBookId)) {
            workBookService.deleteWorkBook(workBookId);
            return ApiResponse.success(null, "문제집 삭제 성공", HttpStatus.NO_CONTENT, request.getRequestURI());
        } else {
            return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
        }
    }

}