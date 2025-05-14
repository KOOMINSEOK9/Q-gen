package com.s12p31b204.backend.controller;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.openhtmltopdf.extend.FSSupplier;
import com.openhtmltopdf.outputdevice.helper.BaseRendererBuilder;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.s12p31b204.backend.domain.Test;
import com.s12p31b204.backend.dto.AnswerDto;
import com.s12p31b204.backend.dto.AnswerToHtmlDto;
import com.s12p31b204.backend.dto.ConvertPdfRequestDto;
import com.s12p31b204.backend.dto.CreateTestPaperRequestDto;
import com.s12p31b204.backend.dto.QuestionDto;
import com.s12p31b204.backend.dto.TestPaperResponseDto;
import com.s12p31b204.backend.dto.QuestionToHtmlDto;
import com.s12p31b204.backend.dto.UpdateTestPaperRequestDto;
import com.s12p31b204.backend.oauth2.CustomOAuth2User;
import com.s12p31b204.backend.service.AuthorizationService;
import com.s12p31b204.backend.service.TestPaperService;
import com.s12p31b204.backend.service.TestService;
import com.s12p31b204.backend.util.ApiResponse;
import com.s12p31b204.backend.util.ResponseData;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/api/testpaper")
public class TestPaperController {

    private final TestPaperService testPaperService;
    private final TestService testService;
    private final AuthorizationService authorizationService;
    private final SpringTemplateEngine templateEngine;

    @GetMapping("/{workBookId}")
    public ResponseEntity<ResponseData<List<TestPaperResponseDto>>> getTestPapers
            (@PathVariable Long workBookId,
             @AuthenticationPrincipal CustomOAuth2User user,
             HttpServletRequest request) {
        try {
//            if(authorizationService.checkWorkBookAuthorization(user.getUserId(), workBookId)) {
//                log.info("getting TestPapers...");
//                List<TestPaperResponseDto> testPapers = testPaperService.findTestPaperByWorkBookId(workBookId);
//                return ApiResponse.success(testPapers, "시험지 리스트 조회 성공", HttpStatus.OK, request.getRequestURI());
//            } else {
//                return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
//            }
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
    public ResponseEntity<ResponseData<TestPaperResponseDto>> createTestPaper(
            @RequestBody CreateTestPaperRequestDto createTestPaperRequestDto,
            @AuthenticationPrincipal CustomOAuth2User user,
            HttpServletRequest request
    ) {
        try {
//            if(authorizationService.checkWorkBookAuthorization(user.getUserId(), createTestPaperRequestDto.getWorkBookId())) {
//                log.info("creating TestPaper...");
//                TestPaperResponseDto response = testPaperService.createTestPaper(createTestPaperRequestDto);
//                return ApiResponse.success(response, "시험지 생성 성공", HttpStatus.CREATED, request.getRequestURI());
//            } else {
//                return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
//            }
            log.info("creating TestPaper...");
            TestPaperResponseDto response = testPaperService.createTestPaper(createTestPaperRequestDto, user.getUserId());
            return ApiResponse.success(response, "시험지 생성 성공", HttpStatus.CREATED, request.getRequestURI());
        } catch (NoSuchElementException e) {
            return ApiResponse.failure(e.getMessage(), HttpStatus.BAD_REQUEST, request.getRequestURI());
        } catch (Exception e) {
            log.error(e.getMessage());
            return ApiResponse.failure("시험지 생성 중 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
        }
    }

    @DeleteMapping("/{testPaperId}")
    public ResponseEntity<ResponseData<Void>> removeTestPaper(
            @PathVariable Long testPaperId,
            @AuthenticationPrincipal CustomOAuth2User user,
            HttpServletRequest request) {
        try {
//            if(authorizationService.checkTestPaperAuthorization(user.getUserId(), testPaperId)) {
//                log.info("removing TestPaper...");
//                testPaperService.removeTestPaper(testPaperId);
//                return ApiResponse.success(null, "시험지 삭제 성공", HttpStatus.NO_CONTENT, request.getRequestURI());
//            } else {
//                return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
//            }
            log.info("removing TestPaper...");
            testPaperService.removeTestPaper(testPaperId);
            return ApiResponse.success(null, "시험지 삭제 성공", HttpStatus.NO_CONTENT, request.getRequestURI());
        } catch (Exception e) {
            log.error(e.getMessage());
            return ApiResponse.failure("시험지 삭제 중 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
        }
    }

    @PutMapping
    public ResponseEntity<ResponseData<TestPaperResponseDto>> modifyTestPaper(
            @RequestBody UpdateTestPaperRequestDto updateTestPaperRequestDto,
            @AuthenticationPrincipal CustomOAuth2User user,
            HttpServletRequest request) {
        try {
//            if(authorizationService.checkTestPaperAuthorization(user.getUserId(), updateTestPaperRequestDto.getTestPaperId())) {
//                log.info("modifying TestPaper...");
//                TestPaperResponseDto response = testPaperService.updateTestPaper(updateTestPaperRequestDto);
//                return ApiResponse.success(response, "시험지 수정 성공", HttpStatus.OK, request.getRequestURI());
//            } else {
//                return ApiResponse.failure("권한이 없습니다.", HttpStatus.FORBIDDEN, request.getRequestURI());
//            }
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

    @PostMapping("/convert-pdf")
    public void convertPdf(
            @RequestBody ConvertPdfRequestDto convertPdfRequestDto,
            @AuthenticationPrincipal CustomOAuth2User user,
            HttpServletResponse response) {
        try {
            log.info("Convert TestPaper To PDF...");
            List<Test> tests = testService.findTestAll(convertPdfRequestDto.getTestPaperId());

            List<QuestionDto> allQuestions = new ArrayList<>();
            List<AnswerDto> allAnswers = new ArrayList<>();

            // 객관식 문제
            for (int i = 0; i < tests.size(); i++) {
                Test test = tests.get(i);
                if(test.getType() == Test.Type.TYPE_CHOICE) {
                    allQuestions.add(new QuestionDto(
                            i + 1,
                            test.getQuestion(),
                            List.of(test.getOption1(), test.getOption2(), test.getOption3(), test.getOption4()),
                            test.getType().toString()
                    ));
                } else {
                    allQuestions.add(new QuestionDto(
                            i + 1,
                            test.getQuestion(),
                            null,
                            test.getType().toString()
                    ));
                }
                allAnswers.add(new AnswerDto(
                        i + 1,
                        test.getAnswer(),
                        test.getComment()
                ));
            }

            // 페이징 처리(왼쪽, 오른쪽)
            List<QuestionToHtmlDto> questions = new ArrayList<>();
            List<AnswerToHtmlDto> answers = new ArrayList<>();
            int pageSize = 10;
            int leftSize = pageSize / 2;

            for (int start = 0; start < allQuestions.size(); start += pageSize) {
                int end = Math.min(start + pageSize, allQuestions.size());
                List<QuestionDto> pageQuestions = allQuestions.subList(start, end);
                List<AnswerDto> pageAnswers = allAnswers.subList(start, end);
                List<QuestionDto> leftQuestion = new ArrayList<>();
                List<QuestionDto> rightQuestion = new ArrayList<>();
                List<AnswerDto> leftAnswer = new ArrayList<>();
                List<AnswerDto> rightAnswer = new ArrayList<>();

                for (int i = 0; i < pageQuestions.size(); i++) {
                    if (i < leftSize) {
                        leftQuestion.add(pageQuestions.get(i));
                        leftAnswer.add(pageAnswers.get(i));
                    } else {
                        rightQuestion.add(pageQuestions.get(i));
                        rightAnswer.add(pageAnswers.get(i));
                    }
                }
                questions.add(new QuestionToHtmlDto(leftQuestion, rightQuestion));
                answers.add(new AnswerToHtmlDto(leftAnswer, rightAnswer));
            }



            // Thymeleaf context
            Context context = new Context();
            Map<String, Object> variables = new HashMap<>();
            variables.put("questions", questions);
            if(convertPdfRequestDto.isIncludeAnswer()) {
                variables.put("answers", answers);
            }
            context.setVariables(variables);

            // HTML 렌더링
            String htmlContent = templateEngine.process("testpaper", context);

            // HTML → PDF 변환
            ByteArrayOutputStream stream = new ByteArrayOutputStream();
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(htmlContent, null);

            ClassPathResource fontResource = new ClassPathResource("fonts/AppleSDGothicNeoB.ttf"); // 폰트 파일 위치

            builder.useFont(
                    () -> {
                        try {
                            return fontResource.getInputStream();
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    },
                    "AppleSDGothicNeoB",
                    400,
                    BaseRendererBuilder.FontStyle.NORMAL,
                    true
            );

            builder.toStream(stream);
            builder.run();

            // 응답
            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=testpaper.pdf");
            response.getOutputStream().write(stream.toByteArray());
            response.getOutputStream().flush();
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }
}
