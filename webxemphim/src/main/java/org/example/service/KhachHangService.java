package org.example.service;

import com.nimbusds.jose.JOSEException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.dto.request.IntroSpectRequest;
import org.example.dto.request.IntroSpectResponse;
import org.example.dto.request.khachhangUpdateRequest;
import org.example.model.khachhang;
import org.example.model.nguoidung;
import org.example.repository.KhachHangRepository;
import org.example.repository.nguoidungRepository;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
@RequiredArgsConstructor
public class KhachHangService {
    private final KhachHangRepository khachHangRepository;
    private final JwtService jwtService;
    private final nguoidungRepository userRepository;

    @Transactional
    public khachhang updateProfile(khachhangUpdateRequest request, String token) {
        try {
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

            // kiểm tra xem c đúng là người dùng này cập nhật thông tin của mình hay của người khác
            if (!tokenUser.getIdUser().equals(request.getIdUser())) {
                throw new RuntimeException("Bạn không có quyền cập nhật thông tin của người dùng khác");
            }

            // Find khach hang by idUser
            khachhang khachHang = khachHangRepository.findKhachhangByIdUser(request.getIdUser());

            // Update khach hang information
            if (request.getHoten() != null && !request.getHoten().trim().isEmpty()) {
                khachHang.setHoten(request.getHoten().trim());
            }

            if (request.getSdt() != null && !request.getSdt().trim().isEmpty()) {
                khachHang.setSdt(request.getSdt().trim());
            }

            if (request.getNgaysinh() != null && !request.getNgaysinh().trim().isEmpty()) {
                try {
                    LocalDate birthDate = LocalDate.parse(request.getNgaysinh(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                    khachHang.setNgaysinh(birthDate);
                } catch (DateTimeParseException e) {
                    throw new RuntimeException("Định dạng ngày sinh không hợp lệ. Vui lòng sử dụng định dạng yyyy-MM-dd");
                }
            }

            if (request.getGioitinh() != null && !request.getGioitinh().trim().isEmpty()) {
                String gender = request.getGioitinh().trim();
                if (gender.equals("Nam") || gender.equals("Nữ") || gender.equals("Khác")) {
                    khachHang.setGioitinh(gender);
                } else {
                    throw new RuntimeException("Giới tính không hợp lệ. Vui lòng chọn Nam, Nữ hoặc Khác");
                }
            }
            return khachHangRepository.save(khachHang);

        } catch (JOSEException | ParseException e) {
            throw new RuntimeException("Token không hợp lệ");
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Có lỗi xảy ra khi cập nhật thông tin khách hàng");
        }
    }
}
