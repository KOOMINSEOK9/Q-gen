package com.s12p31b204.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.s12p31b204.backend.domain.TestPaper;

@Repository
public interface TestPaperRepository extends JpaRepository<TestPaper, Long> {

    @Query("SELECT p.workBook.user.userId FROM TestPaper p WHERE p.testPaperId = :testPaperId")
    Long findUserIdByTestPaperId(@Param("testPaperId") Long testPaperId);

    @Query("SELECT p.workBook.workBookId FROM TestPaper p WHERE p.testPaperId = :testPaperId")
    Long findWorkBookIdByTestPaperId(@Param("testPaperId") Long testPaperId);

    @Query("SELECT p FROM TestPaper p WHERE p.workBook.workBookId = :workBookId ORDER BY p.createAt DESC")
    List<TestPaper> findAllByWorkBook_WorkBookId(Long workBookId);

}
