package org.example.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FindingRequest {
    private String tenPhim;
    private String theLoai;
    private Integer nam;
    private String tenDaoDien;
    private String tenDienVien;
    private String quocGia;
}
