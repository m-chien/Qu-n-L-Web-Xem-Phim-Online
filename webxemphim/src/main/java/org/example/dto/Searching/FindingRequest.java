package org.example.dto.Searching;

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
    private String daodien;
    private String dienvien;
    private String quocGia;
    private String iduser;
}
