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
        List<String> explanations = null;
        if(test.getExplanations() != null) {
            String[] split = test.getExplanations().split("///");
            explanations = new ArrayList<>();
            for(String ex : split) {
                explanations.add(ex);
            }
        }
        return FindTestResponseDto.from(test, explanations);
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
        String correctAnswer = test.getAnswer()
                .trim()
                .toLowerCase();
        String userAnswer = solvingTestRequestDto.getUserAnswer()
                .trim()
                .toLowerCase();

        List<String> explanations = null;
        if(test.getExplanations() != null) {
            String[] split = test.getExplanations().split("///");
            explanations = new ArrayList<>();
            for(String ex : split) {
                explanations.add(ex);
            }
        }

        if(correctAnswer.equals(userAnswer)) {
            isCorrect = true;
        } else if(test.getType().equals(Test.Type.TYPE_SHORT)) {
            String[] aliases = test.getAliases().split("///");
            for(String alias : aliases) {
                alias = alias.trim().toLowerCase();
                if(alias.equals(userAnswer)) {
                    isCorrect = true;
                    break;
                }
            }
        }
        TestHistory history = new TestHistory(test, solvingTestRequestDto.getUserAnswer(), isCorrect);
        testHistoryRepository.save(history);
        return SolvingTestResponseDto.from(test, explanations, solvingTestRequestDto.getUserAnswer(), isCorrect);
    }
}
