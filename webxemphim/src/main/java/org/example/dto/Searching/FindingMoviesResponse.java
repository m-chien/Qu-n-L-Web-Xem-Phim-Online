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
public class FindingMoviesResponse {
    private String idPhim;
    private String tenPhim;
    private String urlPoster;
    private LocalDate ngayPhatHanh;
    private String daoDien;
    private List<String> tenDienVien;
    private List<String> tenTheLoai;
}
