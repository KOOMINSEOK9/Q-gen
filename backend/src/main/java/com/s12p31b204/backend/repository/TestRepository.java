package com.s12p31b204.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.s12p31b204.backend.domain.Test;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
    @Query("SELECT t.testPaper.workBook.user.userId FROM Test t WHERE t.testId = :testId")
    Long findUserIdByTestId(@Param("testId") Long testId);

    List<Test> findAllByTestPaper_TestPaperId(Long testPaperId);
}
