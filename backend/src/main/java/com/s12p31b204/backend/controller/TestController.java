package com.s12p31b204.backend.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.s12p31b204.backend.dto.FindTestResponseDto;
import com.s12p31b204.backend.dto.SolvingTestRequestDto;
import com.s12p31b204.backend.dto.SolvingTestResponseDto;
import com.s12p31b204.backend.oauth2.CustomOAuth2User;
import com.s12p31b204.backend.service.AuthorizationService;
import com.s12p31b204.backend.service.TestService;
import com.s12p31b204.backend.util.ApiResponse;
import com.s12p31b204.backend.util.ResponseData;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/api/test")
public class TestController {

    private final TestService testService;
    private final AuthorizationService authorizationService;

    /**
     * 문제 전체 조회 -> 응답 : 순서가 섞인 문제Id 리스트
     * @param testPaperId
     * @return
     * {
     *     "success": true,
     *     "status": 200,
     *     "message": "전체 문제 조회 성공",
     *     "data": [
     *         10,
     *         8,
     *         6,
     *         7,
     *         9
     *     ],
     *     "timestamp": "2025-05-02T10:11:15.167511300",
     *     "path": "/api/test/list/14"
     * }
     */
    @GetMapping("/list/{testPaperId}")
    public ResponseEntity<ResponseData<List<Long>>> getAllTests
            (@PathVariable Long testPaperId,
            @AuthenticationPrincipal CustomOAuth2User user,
             HttpServletRequest request) {
        try {
//            if (authorizationService.checkTestPaperAuthorization(user.getUserId(), testPaperId)) {
//                log.info("getting testIds...");
//                List<Long> testIds = testService.findTestAll(testPaperId);
//                return ApiResponse.success(testIds, "전체 문제 조회 성공", HttpStatus.OK, request.getRequestURI());
//            } else {
//                return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
//            }
            log.info("getting testIds...");
            List<Long> testIds = testService.findIdTestAll(testPaperId);
            return ApiResponse.success(testIds, "전체 문제 조회 성공", HttpStatus.OK, request.getRequestURI());
        } catch (NoSuchElementException e) {
            return ApiResponse.failure(e.getMessage(), HttpStatus.BAD_REQUEST, request.getRequestURI());
        } catch (Exception e) {
            return ApiResponse.failure("문제 전체 조회 중 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
        }
    }

    /**
     * 문제 단일 조회 -> 응답 : 요청한 testId에 해당하는 문제 지문(+ 선택지)
     * @param testId
     * @return
     * {
     *     "success": true,
     *     "status": 200,
     *     "message": "단일 문제 조회 성공",
     *     "data": {
     *         "testId": 6,
     *         "type": "TYPE_CHOICE",
     *         "question": "다음 중 소프트웨어 개발 생명 주기(SDLC)의 단계에 해당하지 않는 것은?",
     *         "option1": "요구 사항 분석",
     *         "option2": "디자인",
     *         "option3": "구현",
     *         "option4": "배포 후 감사"
     *     },
     *     "timestamp": "2025-05-02T10:14:28.219163400",
     *     "path": "/api/test/6"
     * }
     */
    @GetMapping("/{testId}")
    public ResponseEntity<ResponseData<FindTestResponseDto>> getTest
            (@PathVariable Long testId,
             @AuthenticationPrincipal CustomOAuth2User user,
             HttpServletRequest request) {
        try {
//            if(authorizationService.checkTestAuthorization(user.getUserId(), testId)) {
//                log.info("getting test...");
//                FindTestResponseDto response = testService.findTestOne(testId);
//                return ApiResponse.success(response, "단일 문제 조회 성공", HttpStatus.OK, request.getRequestURI());
//            } else {
//                return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
//            }
            log.info("getting test...");
            FindTestResponseDto response = testService.findTestOne(testId);
            return ApiResponse.success(response, "단일 문제 조회 성공", HttpStatus.OK, request.getRequestURI());
        } catch (NoSuchElementException e) {
            return ApiResponse.failure(e.getMessage(), HttpStatus.BAD_REQUEST, request.getRequestURI());
        } catch (Exception e) {
            return ApiResponse.failure("단일 문제 조회 중 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
        }
    }

    /**
     * 문제 답안 제출 -> 응답 : 답안, 해설 포함 단일문제 전체 데이터(correct : 정답 여부)
     * @param solvingTestRequestDto
     * {
     * 		"testId": Long,
     *     "userAnswer": String
     * }
     * @return
     * {
     *     "success": true,
     *     "status": 200,
     *     "message": "답안 제출 성공",
     *     "data": {
     *         "testId": 6,
     *         "type": "TYPE_CHOICE",
     *         "question": "다음 중 소프트웨어 개발 생명 주기(SDLC)의 단계에 해당하지 않는 것은?",
     *         "option1": "요구 사항 분석",
     *         "option2": "디자인",
     *         "option3": "구현",
     *         "option4": "배포 후 감사",
     *         "userAnswer": "4",
     *         "correctAnswer": "4",
     *         "comment": "배포 후 감사는 공식적인 SDLC 단계에 포함되지 않습니다. 일반적인 SDLC 단계는 요구 사항 분석, 디자인, 구현, 테스트, 유지보수로 구성됩니다.",
     *         "correct": true
     *     },
     *     "timestamp": "2025-05-02T10:15:42.479968400",
     *     "path": "/api/test"
     * }
     */
    @PostMapping
    public ResponseEntity<ResponseData<SolvingTestResponseDto>> solvingTest
            (@RequestBody SolvingTestRequestDto solvingTestRequestDto,
             @AuthenticationPrincipal CustomOAuth2User user,
             HttpServletRequest request) {
        try {
//            if(authorizationService.checkTestAuthorization(user.getUserId(), solvingTestRequestDto.getTestId())) {
//                log.info("solving test...");
//                SolvingTestResponseDto response = testService.solvingTest(solvingTestRequestDto);
//                return ApiResponse.success(response, "답안 제출 성공", HttpStatus.OK, request.getRequestURI());
//            } else {
//                return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
//            }
            log.info("solving test...");
            SolvingTestResponseDto response = testService.solvingTest(solvingTestRequestDto);
            return ApiResponse.success(response, "답안 제출 성공", HttpStatus.OK, request.getRequestURI());
        } catch (NoSuchElementException e) {
            return ApiResponse.failure(e.getMessage(), HttpStatus.BAD_REQUEST, request.getRequestURI());
        } catch (Exception e) {
            return ApiResponse.failure("답안 제출 중 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
        }
    }
}
