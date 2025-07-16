package com.s12p31b204.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.s12p31b204.backend.dto.WorkBookRequestDto;
import com.s12p31b204.backend.dto.WorkBookResponseDto;
import com.s12p31b204.backend.service.WorkBookService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/workbooks")
@RequiredArgsConstructor
public class WorkBookController {

    private final WorkBookService workBookService;

    @PostMapping("/{userId}")
    public WorkBookResponseDto createWorkBook(@PathVariable Long userId, @RequestBody WorkBookRequestDto requestDto) {
        return workBookService.createWorkBook(userId, requestDto);
    }
    
    @GetMapping("/{userId}")
    public List<WorkBookResponseDto> getAllWorkBooks(@PathVariable Long userId) {
        return workBookService.getAllWorkBooksByUser(userId);
    }

    @PatchMapping("/{workBookId}")
    public void updateWorkBookTitle(
            @PathVariable Long workBookId,
            @RequestBody WorkBookRequestDto requestDto) {
        workBookService.updateWorkBookTitle(workBookId, requestDto.getTitle());
    }
    
    @DeleteMapping("/{workBookId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteWorkBook(@PathVariable Long workBookId) {
        workBookService.deleteWorkBook(workBookId);
    }

}