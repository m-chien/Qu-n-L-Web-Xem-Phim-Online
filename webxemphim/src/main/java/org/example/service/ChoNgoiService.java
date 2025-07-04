package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.exception.AppException;
import org.example.model.chongoi;
import org.example.repository.ChoNgoiRepository;
import org.example.repository.LoaiGheRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChoNgoiService {
    private final ChoNgoiRepository choNgoiRepository;
    private final LoaiGheService loaiGheService;
    private final JdbcTemplate jdbcTemplate;

    public List<chongoi> GetChoNgoiByPhong(String tenphim, LocalTime suatchieu, LocalDate ngaychieu)
    {
        return choNgoiRepository.findChoNgoiDaDatTheoPhimSuatNgay(tenphim,ngaychieu,suatchieu);
    }
    public chongoi findbyId(String idchongoi)
    {
        return choNgoiRepository.findById(idchongoi).orElseThrow(() -> new RuntimeException("Không có chỗ ngồi tương ứng"));
    }
    public List<String> findListSeatByRowAndColumn(List<String> seatList, String idphong) {
        try {
            StringBuilder sql = new StringBuilder("SELECT idChoNgoi FROM chongoi WHERE idPhong = ? AND (");
            List<Object> params = new ArrayList<>();
            params.add(idphong);

            for (int i = 0; i < seatList.size(); i++) {
                String seat = seatList.get(i);
                System.out.println("ghế: "+ seat);
                String hang = seat.replaceAll("[0-9]", "");
                String cot = seat.replaceAll("[^0-9]", "");
                sql.append("(hang = ? AND cot = ?)");
                if (i < seatList.size() - 1) sql.append(" OR ");
                params.add(hang);
                params.add(Integer.valueOf(cot));
            }

            sql.append(")");

            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql.toString(), params.toArray());
            List<String> result = new ArrayList<>();
            for (Map<String, Object> row : rows) {
                result.add(row.get("idChoNgoi").toString());
            }
            return result;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public BigDecimal getSeatPricebyId(String seat) {
        String idloaighe = choNgoiRepository.findIdLoaiGhebyIdChoNgoi(seat);
        return loaiGheService.findGiaById(idloaighe);
    }
}
