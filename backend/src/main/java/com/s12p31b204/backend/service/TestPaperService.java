package com.s12p31b204.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.s12p31b204.backend.domain.Test;
import com.s12p31b204.backend.domain.WorkBook;
import com.s12p31b204.backend.dto.CreateTestPaperRequestDto;
import com.s12p31b204.backend.dto.CreateTestRequestDto;
import com.s12p31b204.backend.dto.CreateTestResponseDto;
import com.s12p31b204.backend.dto.TestPaperResponseDto;
import com.s12p31b204.backend.dto.UpdateTestPaperRequestDto;
import com.s12p31b204.backend.domain.TestPaper;
import com.s12p31b204.backend.repository.TestPaperRepository;
import com.s12p31b204.backend.repository.TestRepository;
import com.s12p31b204.backend.repository.WorkBookRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
@Transactional
public class TestPaperService {

    private final WorkBookRepository workBookRepository;
    private final TestPaperRepository testPaperRepository;
    private final TestRepository testRepository;
    private final WebClient webClient;

    public TestPaperResponseDto createTestPaper(CreateTestPaperRequestDto createTestPaperRequestDto) throws Exception {
        WorkBook workBook = workBookRepository.findById(createTestPaperRequestDto.getWorkBookId())
                .orElseThrow(() -> new NoSuchElementException("해당 문제집을 찾을 수 없습니다"));

        TestPaper testPaper = new TestPaper(
                workBook,
                createTestPaperRequestDto.getTitle(),
                createTestPaperRequestDto.getChoiceAns(),
                createTestPaperRequestDto.getShortAns(),
                createTestPaperRequestDto.getOXAns(),
                createTestPaperRequestDto.getWordAns(),
                createTestPaperRequestDto.getQuantity());
        testPaper = testPaperRepository.save(testPaper);

        CreateTestResponseDto createTest = webClient.post()
                .uri("/api/ai/chatgpt/{testPaperId}/", testPaper.getTestPaperId())
                .bodyValue(new CreateTestRequestDto(testPaper.getQuantity()))
                .retrieve()
                .bodyToMono(CreateTestResponseDto.class)
                .block();

        List<Test> tests = new ArrayList<>();
        for(CreateTestResponseDto.Data data : createTest.getData()) {
            if(data.getType() == Test.Type.TYPE_CHOICE) {
                tests.add(new Test(testPaper, data.getType(), data.getQuestion(),
                        data.getOption().get(0), data.getOption().get(1),
                        data.getOption().get(2), data.getOption().get(3),
                        data.getAnswer(), data.getComment()));
            } else {
                tests.add(new Test(testPaper, data.getType(), data.getQuestion(),
                        data.getAnswer(), data.getComment()));
            }
        }
        testRepository.saveAll(tests);

        return TestPaperResponseDto.from(testPaper);
    }

        @Transactional(readOnly = true)
        public List<TestPaperResponseDto> findTestPaperByWorkBookId(Long workBookId) throws Exception {
            WorkBook workBook = workBookRepository.findById(workBookId).orElseThrow(() -> new NoSuchElementException("해당 문제집을 찾을 수 없습니다"));
            List<TestPaper> testPapers = testPaperRepository.findByWorkBook_WorkBookId(workBookId);
            if(testPapers.isEmpty()) {
                return null;
            }
            List<TestPaperResponseDto> response = new ArrayList<>();
            for(TestPaper paper : testPapers) {
                response.add(TestPaperResponseDto.from(paper));
            }
            return response;
        }
    public void removeTestPaper(Long testPaperId) {
        testPaperRepository.deleteById(testPaperId);
    }

    public TestPaperResponseDto updateTestPaper(UpdateTestPaperRequestDto updateTestPaperRequestDto) {
        TestPaper testPaper = testPaperRepository.findById(updateTestPaperRequestDto.getTestPaperId())
                .orElseThrow(() -> new NoSuchElementException("시험지를 찾을 수 없습니다."));
        testPaper.updateTestPaper(updateTestPaperRequestDto.getTitle());
        return TestPaperResponseDto.from(testPaper);
    }
}
