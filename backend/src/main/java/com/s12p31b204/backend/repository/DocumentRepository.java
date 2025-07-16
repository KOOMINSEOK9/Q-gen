package com.s12p31b204.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.s12p31b204.backend.domain.Document;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long>{

    @Query("SELECT d.workBook.user.userId FROM Document d WHERE d.documentId = :documentId")
    Long findUserIdByDocumentId(@Param("documentId") Long documentId);

    List<Document> findAllByWorkBook_WorkBookId(Long workBookId);
} 
