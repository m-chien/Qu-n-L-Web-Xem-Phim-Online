package org.example.service;

import org.example.dto.ChiTietDatVeDTO.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.sql.Types;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
public class ChiTietDatVeService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public ChiTietDatVeResponseDTO getChiTietDatVe(String idVe) {
        try {
            // Tạo SimpleJdbcCall để gọi stored procedure
            SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withProcedureName("sp_ChiTietDatVe")
                    .declareParameters(new SqlParameter("idVe", Types.NVARCHAR));

            // Tham số input
            Map<String, Object> inParams = new HashMap<>();
            inParams.put("idVe", idVe);

            // Thực thi stored procedure
            Map<String, Object> out = jdbcCall.execute(inParams);

            // Tạo response DTO
            ChiTietDatVeResponseDTO response = new ChiTietDatVeResponseDTO();

            // Xử lý result set 1: Thông tin phim
            List<Map<String, Object>> phimInfoResults = (List<Map<String, Object>>) out.get("#result-set-1");
            if (phimInfoResults != null && !phimInfoResults.isEmpty()) {
                Map<String, Object> phimData = phimInfoResults.get(0);
                PhimInfoDTO phimInfo = new PhimInfoDTO(
                        (String) phimData.get("url_poster"),
                        (String) phimData.get("tenphim"),
                        (String) phimData.get("mo_ta"),
                        (Integer) phimData.get("thoiluong")
                );
                response.setPhimInfo(phimInfo);
            }
            //lấy thể loại
            List<Map<String, Object>> theloai = (List<Map<String, Object>>) out.get("#result-set-2");
            List<String> danhsachtheloai = new ArrayList<>();
            if (theloai != null) {
                for (Map<String, Object> gheData : theloai) {
                    danhsachtheloai.add((String) gheData.get("tentheloai"));
                }
            }
            response.setTheloai(danhsachtheloai);
            // Xử lý result set 2: Điểm đánh giá
            List<Map<String, Object>> danhGiaResults = (List<Map<String, Object>>) out.get("#result-set-3");
            if (danhGiaResults != null && !danhGiaResults.isEmpty()) {
                Map<String, Object> danhGiaData = danhGiaResults.get(0);
                DanhGiaDTO danhGia = new DanhGiaDTO(
                        (int) danhGiaData.get("Số lượt đánh giá"),
                        (double) danhGiaData.get("Điểm đánh giá trung bình")
                );
                response.setDanhGia(danhGia);
            }

            // Xử lý result set 3: Lịch chiếu
            List<Map<String, Object>> lichChieuResults = (List<Map<String, Object>>) out.get("#result-set-4");
            if (lichChieuResults != null && !lichChieuResults.isEmpty()) {
                Map<String, Object> lichChieuData = lichChieuResults.get(0);
                LocalDate ngayChieu = ((java.sql.Date) lichChieuData.get("ngaychieu")).toLocalDate();
                LocalTime thoiGianChieu = ((java.sql.Time) lichChieuData.get("tgianchieu")).toLocalTime();

                LichChieuDTO lichChieu = new LichChieuDTO(ngayChieu, thoiGianChieu);
                response.setLichChieu(lichChieu);
            }

            // Xử lý result set 4: Danh sách ghế
            List<Map<String, Object>> gheResults = (List<Map<String, Object>>) out.get("#result-set-5");
            List<String> danhSachTenGhe = new ArrayList<>();
            if (gheResults != null) {
                for (Map<String, Object> gheData : gheResults) {
                    danhSachTenGhe.add((String) gheData.get("TenGhe"));
                }
            }
            response.setDanhSachGhe(danhSachTenGhe);

            // Xử lý result set 5: Thông tin vé
            List<Map<String, Object>> veResults = (List<Map<String, Object>>) out.get("#result-set-6");
            if (veResults != null && !veResults.isEmpty()) {
                Map<String, Object> veData = veResults.get(0);
                VeInfoDTO veInfo = new VeInfoDTO(
                        (String) veData.get("idVe"),
                        (String) veData.get("trangthai"),
                        (BigDecimal) veData.get("Tổng tiền"),
                        (BigDecimal) veData.get("Tiền vé"),
                        (BigDecimal) veData.get("Tiền đồ ăn")
                );
                response.setVeInfo(veInfo);
            }

            // Xử lý result set 6: Thông tin thanh toán
            List<Map<String, Object>> thanhToanResults = (List<Map<String, Object>>) out.get("#result-set-7");
            if (thanhToanResults != null && !thanhToanResults.isEmpty()) {
                Map<String, Object> thanhToanData = thanhToanResults.get(0);
                ThanhToanDTO thanhToan = new ThanhToanDTO(
                        (String) thanhToanData.get("phuongthucthanhtoan"),
                        ((Timestamp) thanhToanData.get("ngayThanhToan")).toLocalDateTime()
                );
                response.setThanhToan(thanhToan);
            }
            //lấy phòng
            List<Map<String, Object>> phongResult = (List<Map<String, Object>>) out.get("#result-set-8");
            String tenPhong = null;
            if (phongResult != null && !phongResult.isEmpty()) {
                Map<String, Object> row = phongResult.get(0);
                tenPhong = (String) row.get("tenphong");
            }
            response.setPhong(tenPhong);
            return response;

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy chi tiết đặt vé: " + e.getMessage(), e);
        }
    }

    // Phương thức kiểm tra vé có tồn tại không
    public boolean kiemTraVeTonTai(String idVe) {
        try {
            String sql = "SELECT COUNT(*) FROM ve WHERE idVe = ?";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, idVe);
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }
}
