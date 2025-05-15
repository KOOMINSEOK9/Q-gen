package com.s12p31b204.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.s12p31b204.backend.repository.DocumentRepository;
import com.s12p31b204.backend.repository.TestHistoryRepository;
import com.s12p31b204.backend.repository.TestPaperRepository;
import com.s12p31b204.backend.repository.TestRepository;
import com.s12p31b204.backend.repository.WorkBookRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class AuthorizationService {

    private final WorkBookRepository workBookRepository;
    private final TestPaperRepository testPaperRepository;
    private final TestRepository testRepository;
    private final DocumentRepository documentRepository;

    public boolean checkWorkBookAuthorization(Long userId, Long workBookId) {
        return userId == workBookRepository.findUserIdByWorkBookId(workBookId);
    }

    public boolean checkTestPaperAuthorization(Long userId, Long testPaperId) {
        return userId == testPaperRepository.findUserIdByTestPaperId(testPaperId);
    }

    public boolean checkTestAuthorization(Long userId, Long testId) {
        return userId == testRepository.findUserIdByTestId(testId);
    }

    public boolean checkDocumentAuthorization(Long userId, Long documentId) {
        return userId == documentRepository.findUserIdByDocumentId(documentId);
    }

}
