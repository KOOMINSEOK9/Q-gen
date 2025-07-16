package com.s12p31b204.backend.domain;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@EntityListeners(AuditingEntityListener.class)
public class Document {

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long documentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workBookId", nullable = false)
    private WorkBook workBook;

    @Column(nullable = false)
    private String documentName;

    @Column(nullable = false)
    private long documentSize;

    @Column(nullable = false)
    private String documentType;

    @Column(nullable = false, length = 2000)
    private String documentURL;

    @CreatedDate
    private LocalDateTime createAt;

    public Document(WorkBook workBook, String name, long size, String type, String url) {
        this.workBook = workBook;
        this.documentName = name;
        this.documentSize = size;
        this.documentType = type;
        this.documentURL = url;
    }
}
