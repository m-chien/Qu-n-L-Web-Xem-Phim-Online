package org.example.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface LichSuVeResponse {
    String getIdVe();
    String getUrl_poster();
    String getTenphim();
    LocalDateTime getNgayDat();
    String getDanhSachGhe();
    BigDecimal getTongGiaTriDonHang();
    String getTrangthai();
}
