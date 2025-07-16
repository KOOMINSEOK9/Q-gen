package com.s12p31b204.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.s12p31b204.backend.domain.TestHistory;

import java.util.List;

@Repository
public interface TestHistoryRepository extends JpaRepository<TestHistory, Long> {
    @Query("SELECT h.test.testPaper.workBook.user.userId FROM TestHistory h")
    Long findUserIdByTestHistoryId(Long testHistoryId);
    List<TestHistory> findAllByTest_TestId(Long testId);
}
