package com.s12p31b204.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.s12p31b204.backend.domain.User;
import com.s12p31b204.backend.domain.WorkBook;
import com.s12p31b204.backend.dto.WorkBookRequestDto;
import com.s12p31b204.backend.dto.WorkBookResponseDto;
import com.s12p31b204.backend.repository.UserRepository;
import com.s12p31b204.backend.repository.WorkBookRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkBookService {

    private final WorkBookRepository workBookRepository;
    private final UserRepository userRepository;

    @Transactional
    public WorkBookResponseDto createWorkBook(Long userId, WorkBookRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    
        WorkBook workBook = new WorkBook(requestDto.getTitle(), user);
        workBookRepository.save(workBook);
    
        return new WorkBookResponseDto(workBook);
    }


    @Transactional(readOnly = true)
    public List<WorkBookResponseDto> getAllWorkBooksByUser(Long userId) {
        return workBookRepository.findByUser_UserId(userId).stream()
                .map(WorkBookResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateWorkBookTitle(Long workBookId, String newTitle) {
        WorkBook workBook = workBookRepository.findById(workBookId)
                .orElseThrow(() -> new IllegalArgumentException("워크북을 찾을 수 없습니다."));

        workBook.updateTitle(newTitle);
    }

    @Transactional
    public void deleteWorkBook(Long workBookId) {
        WorkBook workBook = workBookRepository.findById(workBookId)
                .orElseThrow(() -> new IllegalArgumentException("워크북을 찾을 수 없습니다."));
        workBookRepository.delete(workBook);
    }

}
