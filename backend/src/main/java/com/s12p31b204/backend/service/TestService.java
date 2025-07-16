package com.s12p31b204.backend.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.s12p31b204.backend.domain.Test;
import com.s12p31b204.backend.dto.FindTestResponseDto;
import com.s12p31b204.backend.dto.SolvingTestRequestDto;
import com.s12p31b204.backend.dto.SolvingTestResponseDto;
import com.s12p31b204.backend.repository.TestPaperRepository;
import com.s12p31b204.backend.repository.TestRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
@Transactional
public class TestService {

    private final TestPaperRepository testPaperRepository;
    private final TestRepository testRepository;

    public FindTestResponseDto findTestOne(Long testId) {
        Test test = testRepository.findById(testId).orElseThrow(
                () -> new NoSuchElementException("문제를 찾을 수 없습니다."));
        return FindTestResponseDto.from(test);
    }

    public List<Long> findTestAll(Long testPaperId) {
        List<Test> tests = testRepository.findAllByTestPaper_TestPaperId(testPaperId);
        if(tests.isEmpty()) {
            throw new NoSuchElementException("해당 시험지를 찾을 수 없습니다.");
        }
        List<Long> testIds = new ArrayList<>();
        for(Test t : tests) {
            testIds.add(t.getTestId());
        }
        Collections.shuffle(testIds);
        return testIds;
    }

    public SolvingTestResponseDto solvingTest(SolvingTestRequestDto solvingTestRequestDto) {
        Test test = testRepository.findById(solvingTestRequestDto.getTestId()).orElseThrow(
                () -> new NoSuchElementException("문제를 찾을 수 없습니다."));
        boolean isCorrect = false;
        // 히스토리 저장 로직 필요
        if(test.getAnswer().equals(solvingTestRequestDto.getUserAnswer())) {
            isCorrect = true;
        } else {
            // 오답노트 저장 로직 필요



        }
        return SolvingTestResponseDto.from(test, solvingTestRequestDto.getUserAnswer(), isCorrect);
    }
}
