package com.s12p31b204.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.s12p31b204.backend.domain.TestPaper;

@Repository
public interface TestPaperRepository extends JpaRepository<TestPaper, Long> {
    List<TestPaper> findByWorkBook_WorkBookId(Long workBookId);

}
