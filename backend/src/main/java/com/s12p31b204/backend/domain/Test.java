package com.s12p31b204.backend.domain;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@EntityListeners(AuditingEntityListener.class)
public class Test {

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long testId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testPaperId", nullable = false)
    private TestPaper testPaper;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Type type;

    @Column(nullable = false, length = 1000)
    private String question;

    @Column(length = 1000)
    private String explanations;

    private String explanationType;

    private String option1;
    private String option2;
    private String option3;
    private String option4;

    @Column(nullable = false)
    private String answer;

    @Column(length = 1000)
    private String aliases;

    @Column(nullable = false, length = 1000)
    private String comment;

    @Column(length = 1000)
    private String memo;

    @OneToMany(mappedBy = "test", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestHistory> testHistories;

    @CreatedDate
    private LocalDateTime createAt;

    // 객관식인 경우
    public Test(TestPaper testPaper, Type type, String question, String explanations, String explanationType,
                String option1, String option2, String option3, String option4,
                String answer, String comment) {
        this.testPaper = testPaper;
        this.type = type;
        this.question = question;
        this.explanations = explanations;
        this.explanationType = explanationType;
        this.option1 = option1;
        this.option2 = option2;
        this.option3 = option3;
        this.option4 = option4;
        this.answer = answer;
        this.comment = comment;
    }

    // 주관식, OX인 경우
    public Test(TestPaper testPaper, Type type, String question,
                String aliases, String answer, String comment) {
        this.testPaper = testPaper;
        this.type = type;
        this.question = question;
        this.aliases = aliases;
        this.answer = answer;
        this.comment = comment;
    }

    public void updateMemo(String memo) {
        this.memo = memo;
    }

    public void removeMemo() {
        this.memo = null;
    }

    public enum Type {
        TYPE_CHOICE("객관식"),
        TYPE_SHORT("주관식"),
        TYPE_OX("OX 문제");

        private final String displayName;

        Type(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}
