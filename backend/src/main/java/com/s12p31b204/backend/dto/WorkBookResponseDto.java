package com.s12p31b204.backend.dto;

import java.time.LocalDateTime;

import com.s12p31b204.backend.domain.WorkBook;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class WorkBookResponseDto {
    private Long workBookId;
    private String title;
    private LocalDateTime createAt;

    public WorkBookResponseDto(WorkBook workBook) {
        this.workBookId = workBook.getWorkBookId();
        this.title = workBook.getTitle();
        this.createAt = workBook.getCreateAt();
    }
}
