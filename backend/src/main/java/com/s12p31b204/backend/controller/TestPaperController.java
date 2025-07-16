package com.s12p31b204.backend.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.s12p31b204.backend.dto.CreateTestPaperRequestDto;
import com.s12p31b204.backend.dto.TestPaperResponseDto;
import com.s12p31b204.backend.dto.UpdateTestPaperRequestDto;
import com.s12p31b204.backend.service.TestPaperService;
import com.s12p31b204.backend.util.ApiResponse;
import com.s12p31b204.backend.util.ResponseData;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/api/testpaper")
public class TestPaperController {

    private final TestPaperService testPaperService;

    @GetMapping("/{workBookId}")
    public ResponseEntity<ResponseData<List<TestPaperResponseDto>>> getTestPapers(@PathVariable Long workBookId, HttpServletRequest request) {
        try {
            log.info("getting TestPapers...");
            List<TestPaperResponseDto> testPapers = testPaperService.findTestPaperByWorkBookId(workBookId);
            return ApiResponse.success(testPapers, "시험지 리스트 조회 성공", HttpStatus.OK, request.getRequestURI());
        } catch (NoSuchElementException e) {
            return ApiResponse.failure(e.getMessage(), HttpStatus.BAD_REQUEST, request.getRequestURI());
        } catch (Exception e) {
            log.error(e.getMessage());
            return ApiResponse.failure("시험지 조회 중 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
        }
    }

    @PostMapping
    public ResponseEntity<ResponseData<TestPaperResponseDto>> createTestPaper(@RequestBody CreateTestPaperRequestDto createTestPaperRequestDto, HttpServletRequest request) {
        try {
            log.info("creating TestPaper...");
            TestPaperResponseDto response = testPaperService.createTestPaper(createTestPaperRequestDto);
            return ApiResponse.success(response, "시험지 생성 성공", HttpStatus.CREATED, request.getRequestURI());
        } catch (NoSuchElementException e) {
            return ApiResponse.failure(e.getMessage(), HttpStatus.BAD_REQUEST, request.getRequestURI());
        } catch (Exception e) {
            log.error(e.getMessage());
            return ApiResponse.failure("시험지 생성 중 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
        }
    }

    @DeleteMapping("/{testPaperId}")
    public ResponseEntity<ResponseData<Void>> removeTestPaper(@PathVariable Long testPaperId, HttpServletRequest request) {
        try {
            log.info("removing TestPaper...");
            testPaperService.removeTestPaper(testPaperId);
            return ApiResponse.success(null, "시험지 삭제 성공", HttpStatus.NO_CONTENT, request.getRequestURI());
        } catch (Exception e) {
            log.error(e.getMessage());
            return ApiResponse.failure("시험지 삭제 중 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
        }
    }

    @PutMapping
    public ResponseEntity<ResponseData<TestPaperResponseDto>> modifyTestPaper(@RequestBody UpdateTestPaperRequestDto updateTestPaperRequestDto, HttpServletRequest request) {
        try {
            log.info("modifying TestPaper...");
            TestPaperResponseDto response = testPaperService.updateTestPaper(updateTestPaperRequestDto);
            return ApiResponse.success(response, "시험지 수정 성공", HttpStatus.OK, request.getRequestURI());
        } catch (NoSuchElementException e) {
            return ApiResponse.failure(e.getMessage(), HttpStatus.BAD_REQUEST, request.getRequestURI());
        } catch (Exception e) {
            log.error(e.getMessage());
            return ApiResponse.failure("시험지 수정 중 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
        }
    }
}
