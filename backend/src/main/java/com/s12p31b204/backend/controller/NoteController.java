package com.s12p31b204.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.s12p31b204.backend.dto.FindNoteTestPaperResponseDto;
import com.s12p31b204.backend.dto.FindNoteTestResponseDto;
import com.s12p31b204.backend.dto.UpdateNoteMemoRequestDto;
import com.s12p31b204.backend.oauth2.CustomOAuth2User;
import com.s12p31b204.backend.service.AuthorizationService;
import com.s12p31b204.backend.service.NoteService;
import com.s12p31b204.backend.util.ApiResponse;
import com.s12p31b204.backend.util.ResponseData;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/api/note")
public class NoteController {

    private final NoteService noteService;
    private final AuthorizationService authorizationService;

    @GetMapping("/{workBookId}")
    public ResponseEntity<ResponseData<List<FindNoteTestPaperResponseDto>>> getNoteTestPaper(
            @PathVariable Long workBookId,
            @AuthenticationPrincipal CustomOAuth2User user,
            HttpServletRequest request) {
        try {
            if (authorizationService.checkWorkBookAuthorization(user.getUserId(), workBookId)) {
                return ApiResponse.success(noteService.getNoteTestPaperByWorkBookId(workBookId), "success", HttpStatus.OK, request.getRequestURI());
            } else {
                return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
            }
        } catch (Exception e) {
            return ApiResponse.failure(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
        }
    }

    @GetMapping("/detail/{testId}")
    public ResponseEntity<ResponseData<FindNoteTestResponseDto>> getNoteTest(
            @PathVariable Long testId,
            @AuthenticationPrincipal CustomOAuth2User user,
            HttpServletRequest request) {
        try {
            if (authorizationService.checkTestAuthorization(user.getUserId(), testId)) {
                return ApiResponse.success(noteService.getNoteTest(testId), "success", HttpStatus.OK, request.getRequestURI());
            } else {
                return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
            }
        } catch (Exception e) {
            return ApiResponse.failure(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
        }
    }

    @PatchMapping("/{testId}/memo")
    public ResponseEntity<ResponseData<Void>> updateNoteMemo(
            @PathVariable Long testId,
            @RequestBody UpdateNoteMemoRequestDto memoRequest,
            @AuthenticationPrincipal CustomOAuth2User user,
            HttpServletRequest request) {
        try {
            if(authorizationService.checkTestAuthorization(user.getUserId(), testId)) {
                noteService.updateNoteMemo(testId, memoRequest);
                return ApiResponse.success(null, "success", HttpStatus.OK, request.getRequestURI());
            } else {
                return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
            }
        } catch (Exception e) {
            return ApiResponse.failure(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
        }
    }

    @PatchMapping("/{testId}/memo/remove")
    public ResponseEntity<ResponseData<Void>> removeNoteMemo(
            @PathVariable Long testId,
            @AuthenticationPrincipal CustomOAuth2User user,
            HttpServletRequest request) {
        try {
            if(authorizationService.checkTestAuthorization(user.getUserId(), testId)) {
                noteService.removeNoteMemo(testId);
                return ApiResponse.success(null, "success", HttpStatus.OK, request.getRequestURI());
            } else {
                return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
            }
        } catch (Exception e) {
            return ApiResponse.failure(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
        }
    }

    @GetMapping("/list/{testPaperId}")
    public ResponseEntity<ResponseData<List<Long>>> getNoteTestIdsByTestPaperId(
            @PathVariable Long testPaperId,
            @AuthenticationPrincipal CustomOAuth2User user,
            HttpServletRequest request) {
        try {
            if (authorizationService.checkTestPaperAuthorization(user.getUserId(), testPaperId)) {
                List<Long> testIds = noteService.getTestIdsByTestPaperId(testPaperId);
                return ApiResponse.success(testIds, "문제 ID 리스트 조회 성공", HttpStatus.OK, request.getRequestURI());
            } else {
                return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
            }
        } catch (Exception e) {
            return ApiResponse.failure(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
        }
    }

}