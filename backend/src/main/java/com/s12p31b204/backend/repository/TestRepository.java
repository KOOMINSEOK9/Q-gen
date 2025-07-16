package com.s12p31b204.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.s12p31b204.backend.domain.Test;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findAllByTestPaper_TestPaperId(Long testPaperId);
}
