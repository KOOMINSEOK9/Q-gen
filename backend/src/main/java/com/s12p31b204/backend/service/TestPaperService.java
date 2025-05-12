package com.s12p31b204.backend.service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.CompletableFuture;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.s12p31b204.backend.domain.Test;
import com.s12p31b204.backend.domain.TestPaper;
import com.s12p31b204.backend.domain.WorkBook;
import com.s12p31b204.backend.dto.CreateTestPaperRequestDto;
import com.s12p31b204.backend.dto.CreateTestRequestDto;
import com.s12p31b204.backend.dto.CreateTestResponseDto;
import com.s12p31b204.backend.dto.TestPaperResponseDto;
import com.s12p31b204.backend.dto.UpdateTestPaperRequestDto;
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
                createTestPaperRequestDto.getOxAns(),
                createTestPaperRequestDto.getWordAns(),
                createTestPaperRequestDto.getQuantity());
        testPaper = testPaperRepository.save(testPaper);


        List<Test> tests = Collections.synchronizedList(new ArrayList<>());

        List<CompletableFuture<Void>> futures = new ArrayList<>();
        int choiceAns = testPaper.getChoiceAns();
        int oxAns = testPaper.getOxAns();
        int shortAns = testPaper.getShortAns();

        while(choiceAns + oxAns + shortAns >= 10) {
            int rqQuantity = 10;
            int rqChoice = 0;
            int rqOx = 0;
            int rqShort = 0;

            if(choiceAns > 0) {
                rqChoice = Math.min(choiceAns, rqQuantity);
                choiceAns -= rqChoice;
                rqQuantity -= rqChoice;
            }

            if(oxAns > 0 && rqQuantity > 0) {
                rqOx = Math.min(oxAns, rqQuantity);
                oxAns -= rqOx;
                rqQuantity -= rqOx;
            }

            if(shortAns > 0 && rqQuantity > 0) {
                rqShort = Math.min(shortAns, rqQuantity);
                shortAns -= rqShort;
                rqQuantity -= rqShort;
            }

            futures.add(createTest(testPaper, tests, rqChoice, rqOx, rqShort));
        }
        if(choiceAns + oxAns + shortAns > 0) {
            futures.add(createTest(testPaper, tests, choiceAns, oxAns, shortAns));
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

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

    public CompletableFuture<Void> createTest(TestPaper testPaper, List<Test> tests, int choiceAns, int oxAns, int shortAns) {
        return CompletableFuture.runAsync(() -> {
            log.info("Test Generate Request");
            CreateTestResponseDto response = webClient.post()
                    .uri("/api/ai/chatgpt/{testPaperId}/", testPaper.getTestPaperId())
                    .bodyValue(new CreateTestRequestDto(choiceAns, oxAns, shortAns))
                    .retrieve()
                    .bodyToMono(CreateTestResponseDto.class)
                    .timeout(Duration.ofMinutes(5))
                    .block();
            for(CreateTestResponseDto.Data data : response.getData()) {
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
        });
    }
}
