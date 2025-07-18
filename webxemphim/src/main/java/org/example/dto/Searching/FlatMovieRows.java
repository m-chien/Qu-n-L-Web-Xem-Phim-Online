package org.example.dto.Searching;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FlatMovieRows {
    private String idPhim;
    private String tenPhim;
    private String urlPoster;
    private LocalDate ngayPhatHanh;
    private String daoDien;
    private String tenDienVien;
    private String tenTheLoai;
}
