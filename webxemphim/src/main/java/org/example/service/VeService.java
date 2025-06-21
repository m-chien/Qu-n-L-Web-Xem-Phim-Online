package org.example.service;

import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import org.example.dto.request.IntroSpectRequest;
import org.example.dto.request.IntroSpectResponse;
import org.example.dto.request.LichSuVeResponse;
import org.example.model.khachhang;
import org.example.model.nguoidung;
import org.example.repository.VeRepository;
import org.example.repository.nguoidungRepository;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VeService {
    private final VeRepository veRepository;
    private final nguoidungRepository userRepository;
    private final JwtService jwtService;

    public List<LichSuVeResponse> GetAllLichSuVe(String token) throws ParseException, JOSEException {
        // giải mã đoạn token được gửi về
        IntroSpectRequest introSpectRequest = IntroSpectRequest.builder()
                .token(token)
                .build();
        IntroSpectResponse introSpectResponse = jwtService.introspect(introSpectRequest);
        //giải mã xong, kiểm tra nếu còn hạn thì làm tiếp không thì sai
        if (!introSpectResponse.isValid()) {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn");
        }
        //giải mã token ra để lấy email
        String userEmail = jwtService.extractemail(token);
        // tìm người dùng từ email đã giải mã
        nguoidung tokenUser = userRepository.findByEmail(userEmail);
        return veRepository.findVe(tokenUser.getIdUser());
    }
}
