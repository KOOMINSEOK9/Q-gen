package com.s12p31b204.backend.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.s12p31b204.backend.domain.Test;
import com.s12p31b204.backend.domain.TestHistory;
import com.s12p31b204.backend.dto.FindTestResponseDto;
import com.s12p31b204.backend.dto.SolvingTestRequestDto;
import com.s12p31b204.backend.dto.SolvingTestResponseDto;
import com.s12p31b204.backend.repository.TestHistoryRepository;
import com.s12p31b204.backend.repository.TestRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
@Transactional
public class TestService {

    private final TestRepository testRepository;
    private final TestHistoryRepository testHistoryRepository;

    public FindTestResponseDto findTestOne(Long testId) {
        Test test = testRepository.findById(testId).orElseThrow(
                () -> new NoSuchElementException("문제를 찾을 수 없습니다."));
        return FindTestResponseDto.from(test);
    }

    public List<Long> findIdTestAll(Long testPaperId) {
        List<Test> tests = testRepository.findAllByTestPaper_TestPaperId(testPaperId);
        if(tests.isEmpty()) {
            throw new NoSuchElementException("해당 시험지를 찾을 수 없습니다.");
        }
        List<Long> testIds = new ArrayList<>();
        for(Test t : tests) {
            testIds.add(t.getTestId());
        }
        return testIds;
    }

    public List<Test> findTestAll(Long testPaperId) {
        List<Test> tests = testRepository.findAllByTestPaper_TestPaperId(testPaperId);
        if(tests.isEmpty()) {
            throw new NoSuchElementException("해당 시험지를 찾을 수 없습니다.");
        }
        return tests;
    }

    public SolvingTestResponseDto solvingTest(SolvingTestRequestDto solvingTestRequestDto) {
        Test test = testRepository.findById(solvingTestRequestDto.getTestId()).orElseThrow(
                () -> new NoSuchElementException("문제를 찾을 수 없습니다."));
        boolean isCorrect = false;
        // 히스토리 저장
        if(test.getAnswer().equals(solvingTestRequestDto.getUserAnswer())) {
            isCorrect = true;
        }
        TestHistory history = new TestHistory(test, solvingTestRequestDto.getUserAnswer(), isCorrect);
        testHistoryRepository.save(history);
        return SolvingTestResponseDto.from(test, solvingTestRequestDto.getUserAnswer(), isCorrect);
    }
}
