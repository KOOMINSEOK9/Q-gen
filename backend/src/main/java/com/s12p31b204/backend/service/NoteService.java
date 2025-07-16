package com.s12p31b204.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.s12p31b204.backend.domain.Test;
import com.s12p31b204.backend.domain.TestHistory;
import com.s12p31b204.backend.dto.FindNoteTestPaperResponseDto;
import com.s12p31b204.backend.dto.FindNoteTestResponseDto;
import com.s12p31b204.backend.dto.TestHistoryDto;
import com.s12p31b204.backend.dto.TestPaperResponseDto;
import com.s12p31b204.backend.dto.UpdateNoteMemoRequestDto;
import com.s12p31b204.backend.repository.TestHistoryRepository;
import com.s12p31b204.backend.repository.TestRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
@Transactional
public class NoteService {

    private final TestPaperService testPaperService;
    private final TestHistoryRepository testHistoryRepository;
    private final TestRepository testRepository;

    @Transactional(readOnly = true)
    public List<FindNoteTestPaperResponseDto> getNoteTestPaperByWorkBookId(Long workBookId) throws Exception {
        List<TestPaperResponseDto> testPapers = testPaperService.findTestPaperByWorkBookId(workBookId);
        List<FindNoteTestPaperResponseDto> response = new ArrayList<>();
        for(TestPaperResponseDto testPaper : testPapers) {
            response.add(FindNoteTestPaperResponseDto.builder()
            .testPaperId(testPaper.getTestPaperId())
            .title(testPaper.getTitle())
            .quantity(testPaper.getQuantity())
            .build());
        }
        return response;
    }
    
    @Transactional(readOnly = true)
    public List<Long> getTestIdsByTestPaperId(Long testPaperId) {
        List<Test> tests = testRepository.findAllByTestPaper_TestPaperId(testPaperId);
        List<Long> testIds = new ArrayList<>();
        for (Test test : tests) {
            testIds.add(test.getTestId());
        }
        return testIds;
    }
    
    @Transactional(readOnly = true)
    public FindNoteTestResponseDto getNoteTest(Long testId) {
        Test test = testRepository.findById(testId).orElseThrow(() -> new RuntimeException("문제를 찾을 수 없습니다."));
        List<TestHistory> testHistoryList = testHistoryRepository.findAllByTest_TestId(testId);
        List<TestHistoryDto> testHistoryDtoList = new ArrayList<>();
        int incorrectCount = 0;
        for(TestHistory testHistory : testHistoryList) {
            testHistoryDtoList.add(TestHistoryDto.from(testHistory));
            if (!testHistory.isCorrect()) {
                incorrectCount++;
            }
        }
        List<String> explanations = null;
        if(test.getExplanations() != null) {
            String[] split = test.getExplanations().split("///");
            explanations = new ArrayList<>();
            for(String ex : split) {
                explanations.add(ex);
            }
        }
        return FindNoteTestResponseDto.from(test, testHistoryDtoList, explanations, incorrectCount);
    }

    @Transactional
    public void updateNoteMemo(Long testId, UpdateNoteMemoRequestDto request) {
        Test test = testRepository.findById(testId).orElseThrow(() -> new RuntimeException("문제를 찾을 수 없습니다."));
        test.updateMemo(request.getMemo());
        testRepository.save(test);
    }

    @Transactional
    public void removeNoteMemo(Long testId) {
        Test test = testRepository.findById(testId).orElseThrow(() -> new RuntimeException("문제를 찾을 수 없습니다."));
        test.removeMemo();
        testRepository.save(test);
    }

}
