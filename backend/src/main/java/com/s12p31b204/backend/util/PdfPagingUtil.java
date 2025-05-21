package com.s12p31b204.backend.util;

import java.util.ArrayList;
import java.util.List;

import com.s12p31b204.backend.dto.AnswerDto;
import com.s12p31b204.backend.dto.AnswerToHtmlDto;
import com.s12p31b204.backend.dto.QuestionDto;
import com.s12p31b204.backend.dto.QuestionToHtmlDto;

public class PdfPagingUtil {

    public static int estimateQuestionScore(QuestionDto q) {
        int score = q.getText().length() / 20;
        if (q.getExplanations() != null) {
            for (String line : q.getExplanations()) {
                score += Math.max(1, line.length() / 20);
            }
            score += 2; // 여백 공간 처리
        }
        if (q.getOptions() != null) {
            for (String line : q.getOptions()) {
                score += Math.max(1, line.length() / 20);
            }
            score += 1; // 여백 공간 처리
        }

        switch (q.getType()) {
            case "TYPE_CHOICE" -> score += 2;
            case "TYPE_OX" -> score += 3;
            case "TYPE_SHORT" -> score += 3;
        }
        score += 2; // 여백 공간 처리
        return Math.max(score, 1);
    }

    public static int estimateAnswerScore(AnswerDto a) {
        int score = a.getComment() != null ? a.getComment().length() / 50 : 0;
        return Math.max(score + 1, 1); // 기본 1점
    }

    public static List<QuestionToHtmlDto> paginateQuestions(List<QuestionDto> questions, int maxPageScore) {
        List<QuestionToHtmlDto> result = new ArrayList<>();
        List<QuestionDto> current = new ArrayList<>();
        int score = 0;

        for (QuestionDto q : questions) {
            int s = estimateQuestionScore(q);
            if (score + s > maxPageScore && !current.isEmpty()) {
                result.add(splitQuestionPage(current));
                current = new ArrayList<>();
                score = 0;
            }
            current.add(q);
            score += s;
        }
        if (!current.isEmpty()) result.add(splitQuestionPage(current));
        return result;
    }

    public static List<AnswerToHtmlDto> paginateAnswers(List<AnswerDto> answers, int maxPageScore) {
        List<AnswerToHtmlDto> result = new ArrayList<>();
        List<AnswerDto> current = new ArrayList<>();
        int score = 0;

        for (AnswerDto a : answers) {
            int s = estimateAnswerScore(a);
            if (score + s > maxPageScore && !current.isEmpty()) {
                result.add(splitAnswerPage(current));
                current = new ArrayList<>();
                score = 0;
            }
            current.add(a);
            score += s;
        }
        if (!current.isEmpty()) result.add(splitAnswerPage(current));
        return result;
    }

    private static QuestionToHtmlDto splitQuestionPage(List<QuestionDto> list) {
        int mid = (int) Math.ceil(list.size() / 2.0);
        List<QuestionDto> left = list.subList(0, mid);
        List<QuestionDto> right = list.subList(mid, list.size());
        return new QuestionToHtmlDto(left, right);
    }

    private static AnswerToHtmlDto splitAnswerPage(List<AnswerDto> list) {
        int mid = (int) Math.ceil(list.size() / 2.0);
        List<AnswerDto> left = list.subList(0, mid);
        List<AnswerDto> right = list.subList(mid, list.size());
        return new AnswerToHtmlDto(left, right);
    }

    public static List<QuestionToHtmlDto> paginateQuestionsLeftThenRight(List<QuestionDto> allQuestions, int maxPageScore) {
        List<QuestionToHtmlDto> pages = new ArrayList<>();
        int i = 0;
        int halfScore = maxPageScore / 2;

        while (i < allQuestions.size()) {
            List<QuestionDto> left = new ArrayList<>();
            int leftScore = 0;

            // 왼쪽 먼저 채움 (최소 1문제는 반드시 포함)
            while (i < allQuestions.size()) {
                QuestionDto q = allQuestions.get(i);
                int score = estimateQuestionScore(q);
                if (!left.isEmpty() && leftScore + score >= halfScore) break;

                left.add(q);
                leftScore += score;
                i++;
            }

            List<QuestionDto> right = new ArrayList<>();
            int rightScore = 0;

            // 오른쪽 채움 (최소 1문제는 반드시 포함)
            while (i < allQuestions.size()) {
                QuestionDto q = allQuestions.get(i);
                int score = estimateQuestionScore(q);
                if (!right.isEmpty() && rightScore + score >= halfScore) break;

                right.add(q);
                rightScore += score;
                i++;
            }

            pages.add(new QuestionToHtmlDto(left, right));
        }

        return pages;
    }
}
