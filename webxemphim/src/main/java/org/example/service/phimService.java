package org.example.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.example.dto.Searching.FindingMoviesResponse;
import org.example.dto.Searching.FindingRequest;
import org.example.dto.Searching.FlatMovieRows;
import org.example.exception.AppException;
import org.example.exception.ErrorCode;
import org.example.model.dienvien;
import org.example.model.phim;
import org.example.model.theloai;
import org.example.repository.phimrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class phimService {
    @Autowired
    private phimrepository phimrepository;
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final RowMapper<FlatMovieRows> rowMapper = (rs, rowNum) -> FlatMovieRows.builder()
            .idPhim(rs.getString("idPhim"))
            .tenPhim(rs.getString("tenphim"))
            .urlPoster(rs.getString("url_poster"))
            .ngayPhatHanh(rs.getDate("ngayphathanh").toLocalDate())
            .daoDien(rs.getString("daoDien"))
            .tenDienVien(rs.getString("tendienvien"))
            .tenTheLoai(rs.getString("tentheloai"))
            .build();

    //thêm phim
    public phim themPhim(phim phim) {
        Optional<phim> existingPhim = phimrepository.findByTenphim(phim.getTenphim());
        if (existingPhim.isPresent()) {
            throw new IllegalArgumentException("Phim đã tồn tại!");
        }
        return phimrepository.save(phim);
    }

    //xóa phim
    public boolean xoaphim(String idphim)
    {
        if (phimrepository.existsById(idphim))
        {
            phimrepository.deleteById(idphim);
            return true;
        }
         else return false;
    }

    //lấy tất cả phim
    public List<phim> getallphim()
    {
        return phimrepository.findAll();
    }

    //lấy 1 phim
    public phim get1phim(String idphim) {
        return phimrepository.findById(idphim)
                .orElseThrow(() -> new AppException(ErrorCode.Id_Not_Found));
    }

    //update phim
    public phim updatephim(String id, phim phim) {
        phim existing = get1phim(id);
        phim updated = existing.toBuilder()
                .tenphim(phim.getTenphim())
                .daodien(phim.getDaodien())
                .moTaPhim(phim.getMoTaPhim())
                .thoiLuong(phim.getThoiLuong())
                .ngaySanXuat(phim.getNgaySanXuat())
                .luotXem(phim.getLuotXem())
                .quocgia(phim.getQuocgia())
                .gioihandotuoi(phim.getGioihandotuoi())
                .trangthai(phim.getTrangthai())
                .url_anh(phim.getUrl_anh())
                .build();
        return phimrepository.save(updated);
    }
    //cuối cùng hàm này sẽ thực hiện việc mỗi bản ghi sẽ lọc và phân vào từng object tương ứng thể loại
    public List<FindingMoviesResponse> findListfilm(List<FlatMovieRows> rows) {
        Map<String, FindingMoviesResponse> groupedMap = new LinkedHashMap<>();

        for (FlatMovieRows row : rows) {
            // Nếu chưa có phim này trong map thì thêm mới
            groupedMap.computeIfAbsent(row.getIdPhim(), id -> FindingMoviesResponse.builder()
                    .idPhim(row.getIdPhim())
                    .tenPhim(row.getTenPhim())
                    .urlPoster(row.getUrlPoster())
                    .ngayPhatHanh(row.getNgayPhatHanh())
                    .daoDien(row.getDaoDien())
                    .tenDienVien(new ArrayList<>())
                    .tenTheLoai(new ArrayList<>())
                    .build());

            FindingMoviesResponse dto = groupedMap.get(row.getIdPhim());

            // Thêm diễn viên nếu chưa có
            if (row.getTenDienVien() != null && !dto.getTenDienVien().contains(row.getTenDienVien())) {
                dto.getTenDienVien().add(row.getTenDienVien());
            }

            // Thêm thể loại nếu chưa có
            if (row.getTenTheLoai() != null && !dto.getTenTheLoai().contains(row.getTenTheLoai())) {
                dto.getTenTheLoai().add(row.getTenTheLoai());
            }
        }

        return new ArrayList<>(groupedMap.values());
    }
    //hàm này lấy ra các bản ghi trùng từ idphim này
    public List<FlatMovieRows> findfilm(List<String> pagePhimIds) {
        String sql = """
        SELECT p.idPhim, p.tenphim, p.url_poster, p.ngayphathanh, 
               p.DaoDien, p.quocgia, d.tendienvien, t.tentheloai
        FROM phim p
        JOIN theloai_phim tp ON tp.idPhim = p.idPhim
        JOIN theloai t ON t.idTheLoai = tp.idTheLoai
        JOIN dienvien_phim dp ON dp.idPhim = p.idPhim
        JOIN dienvien d ON d.idDienVien = dp.idDienVien
        WHERE p.idPhim IN (:pagePhimIds)
        ORDER BY p.idPhim
    """;

        Map<String, Object> params = new HashMap<>();
        params.put("pagePhimIds", pagePhimIds);

        return namedParameterJdbcTemplate.query(sql, new MapSqlParameterSource(params), rowMapper);
    }
    //lấy ra các idphim distinct trước. nếu không lấy mà lọc thô thì sẽ bị 2 dòng cùng idphim nhưng khác the loại nên
    //sẽ có 2 bản ghi => cái phân trang lấy 10 bản ghi đầu sẽ sai (vì nó sẽ lấy 2 idphimm y nhau).
    //tốt nhất là lấy ra idphim trước rồi từ idphim đã phân trang
    //từ đó mới lấy ra bản ghi trùng thì hàm tiếp theo sẽ xử lý việc trùng đó
    public List<String> findMoviesDynamic(FindingRequest request, int limit, int offset) {
        StringBuilder sql = new StringBuilder("""
        SELECT distinct p.idPhim
        FROM phim p
          JOIN theloai_phim tp ON tp.idPhim = p.idPhim
          JOIN theloai t ON t.idTheLoai = tp.idTheLoai
          JOIN dienvien_phim dp ON dp.idPhim = p.idPhim
          JOIN dienvien d ON d.idDienVien = dp.idDienVien
        WHERE 1=1
    """);

        Map<String, Object> params = new HashMap<>();

        if (request.getTenPhim() != null && !request.getTenPhim().isBlank()) {
            sql.append(" AND LOWER(p.tenphim) LIKE :tenPhim");
            params.put("tenPhim", "%" + request.getTenPhim().toLowerCase() + "%");
        }

        if (request.getDaodien() != null && !request.getDaodien().isBlank()) {
            sql.append(" AND LOWER(p.daoDien) LIKE :daoDien");
            params.put("daoDien", "%" + request.getDaodien().toLowerCase() + "%");
        }

        if (request.getDienvien() != null && !request.getDienvien().isBlank()) {
            sql.append(" AND LOWER(d.tendienvien) LIKE :tenDienVien");
            params.put("tenDienVien", "%" + request.getDienvien().toLowerCase() + "%");
        }

        if (request.getTheLoai() != null && !request.getTheLoai().isBlank()) {
            sql.append(" AND LOWER(t.tentheloai) LIKE :tenTheLoai");
            params.put("tenTheLoai", "%" + request.getTheLoai().toLowerCase() + "%");
        }

        if (request.getNam() != null) {
            sql.append(" AND p.ngayphathanh LIKE :ngayphathanh");
            params.put("ngayphathanh", "%" + request.getNam() + "%");
        }

        if (request.getQuocGia() != null && !request.getQuocGia().isBlank()) {
            sql.append(" AND  LOWER(p.quocgia) LIKE :quocgia");
            params.put("quocgia", "%" + request.getQuocGia() + "%");
        }

        sql.append("""
        ORDER BY p.idPhim
        OFFSET :offset ROWS
        FETCH NEXT :limit ROWS ONLY
    """);
        params.put("limit", limit);
        params.put("offset", offset);

        return namedParameterJdbcTemplate.queryForList(
                sql.toString(),
                new MapSqlParameterSource(params),
                String.class
        );
    }

    public int countfilm(FindingRequest request) {
        StringBuilder sql = new StringBuilder("""
        SELECT COUNT(DISTINCT p.idPhim)
        FROM phim p
        JOIN theloai_phim tp ON tp.idPhim = p.idPhim
        JOIN theloai t ON t.idTheLoai = tp.idTheLoai
        JOIN dienvien_phim dp ON dp.idPhim = p.idPhim
        JOIN dienvien d ON d.idDienVien = dp.idDienVien
        WHERE 1=1
    """);

        Map<String, Object> params = new HashMap<>();

        if (request.getTenPhim() != null && !request.getTenPhim().isBlank()) {
            sql.append(" AND LOWER(p.tenphim) LIKE :tenPhim");
            params.put("tenPhim", "%" + request.getTenPhim().toLowerCase() + "%");
        }

        if (request.getDaodien() != null && !request.getDaodien().isBlank()) {
            sql.append(" AND LOWER(p.daoDien) LIKE :daoDien");
            params.put("daoDien", "%" + request.getDaodien().toLowerCase() + "%");
        }

        if (request.getDienvien() != null && !request.getDienvien().isBlank()) {
            sql.append(" AND LOWER(d.tendienvien) LIKE :tenDienVien");
            params.put("tenDienVien", "%" + request.getDienvien().toLowerCase() + "%");
        }

        if (request.getTheLoai() != null && !request.getTheLoai().isBlank()) {
            sql.append(" AND LOWER(t.tentheloai) LIKE :tenTheLoai");
            params.put("tenTheLoai", "%" + request.getTheLoai().toLowerCase() + "%");
        }

        if (request.getNam() != null) {
            sql.append(" AND YEAR(p.ngayphathanh) = :nam");
            params.put("nam", request.getNam());
        }

        if (request.getQuocGia() != null && !request.getQuocGia().isBlank()) {
            sql.append(" AND  LOWER(p.quocgia) LIKE :quocgia");
            params.put("quocgia", "%" + request.getQuocGia() + "%");
        }

        return namedParameterJdbcTemplate.queryForObject(sql.toString(), new MapSqlParameterSource(params), Integer.class);
    }

}
