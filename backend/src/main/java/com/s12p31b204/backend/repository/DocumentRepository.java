package com.s12p31b204.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.s12p31b204.backend.domain.Document;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long>{    
    List<Document> findByWorkBook_WorkBookId(Long workBookId);
    void deleteByDocumentId(Long documentId);
} 
