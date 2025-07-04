package org.example.service;

import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import org.example.dto.request.IntroSpectRequest;
import org.example.dto.request.IntroSpectResponse;
import org.example.dto.request.LichSuVeResponse;
import org.example.exception.UnauthorizedException;
import org.example.model.khachhang;
import org.example.model.nguoidung;
import org.example.model.ve;
import org.example.repository.VeRepository;
import org.example.repository.nguoidungRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VeService {
    private final VeRepository veRepository;
    private final nguoidungRepository userRepository;
    private final JwtService jwtService;
    private final JdbcTemplate jdbcTemplate;

    public List<LichSuVeResponse> GetAllLichSuVe(String token) throws ParseException, JOSEException {
        // giải mã đoạn token được gửi về
        IntroSpectRequest introSpectRequest = IntroSpectRequest.builder()
                .token(token)
                .build();
        IntroSpectResponse introSpectResponse = jwtService.introspect(introSpectRequest);
        //giải mã xong, kiểm tra nếu còn hạn thì làm tiếp không thì sai
        if (!introSpectResponse.isValid()) {
            throw new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn");
        }
        //giải mã token ra để lấy email
        String userEmail = jwtService.extractemail(token);
        // tìm người dùng từ email đã giải mã
        nguoidung tokenUser = userRepository.findByEmail(userEmail);
        return veRepository.findVe(tokenUser.getIdUser());
    }
    public String AddVe(String iduser, BigDecimal giatien)
    {
        String idve = generateNextIdVe();
        ve ve = new ve(idve,iduser, LocalDateTime.now(),giatien,"Đang chờ thanh toán",LocalDateTime.now().plusMinutes(15));
        veRepository.saveAndFlush(ve);
        return idve;
    }
    public synchronized String generateNextIdVe() {
        String prefix = "V";
        String sql = "SELECT MAX(idVe) FROM ve";
        String maxId = jdbcTemplate.queryForObject(sql, String.class);

        int nextNumber = 1;
        if (maxId != null) {
            String numberPart = maxId.replace(prefix, "");
            nextNumber = Integer.parseInt(numberPart) + 1;
        }

        return prefix + String.format("%04d", nextNumber);
    }

    public ve getVebyId(String idve) {
        return veRepository.findById(idve).orElseThrow(() -> new RuntimeException("không có vé"));
    }

    public void updateVe(ve v) {
        v.setTrangthai("Đã thanh toán");
        veRepository.save(v);
    }

    public void updateVeFaile(ve v) {
        v.setTrangthai("Đã hủy");
        veRepository.save(v);
    }
}
