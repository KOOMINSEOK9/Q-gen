package com.s12p31b204.backend.domain;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@EntityListeners(AuditingEntityListener.class)
public class TestPaper {

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long testPaperId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workBookId", nullable = false)
    private WorkBook workBook;

    @Column(length = 100, nullable = false)
    private String title;

    private int choiceAns;
    private int shortAns;
    private int oxAns;

    @Column(nullable = false)
    private int quantity;

    @OneToMany(mappedBy = "testPaper", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Test> tests;

    @OneToMany(mappedBy = "testPaper", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestResult> testResults;

    @OneToOne(mappedBy = "testPaper", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Feedback feedback;

    @CreatedDate
    private LocalDateTime createAt;

    public TestPaper(WorkBook workBook, String title, int choiceAns, int shortAns, int oxAns, int quantity) {
        this.workBook = workBook;
        this.title = title;
        this.choiceAns = choiceAns;
        this.shortAns = shortAns;
        this.oxAns = oxAns;
        this.quantity = quantity;
    }

    public void updateTestPaper(String title) {
        this.title = title;
    }
}
