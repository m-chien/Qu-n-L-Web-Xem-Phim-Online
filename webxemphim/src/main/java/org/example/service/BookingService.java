package org.example.service;

import com.nimbusds.jose.JOSEException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.dto.request.BookingRequest;
import org.example.dto.request.IntroSpectRequest;
import org.example.dto.request.IntroSpectResponse;
import org.example.exception.UnauthorizedException;
import org.example.model.nguoidung;
import org.example.repository.ChiTietDatVeRepository;
import org.example.repository.VeRepository;
import org.example.repository.nguoidungRepository;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final SuatChieuService suatChieuService;
    private final LichChieuService lichChieuService;
    private final ChoNgoiService choNgoiService;
    private final JwtService jwtService;
    private final nguoidungRepository userRepository;
    private final VeService veService;
    private final ChiTietDatVeService chiTietDatVeService;
    private final GiuGheService giuGheService;

    @Transactional
    public String CreateBooking(BookingRequest request,String token) throws ParseException, JOSEException {
        IntroSpectRequest introSpectRequest = IntroSpectRequest.builder()
                .token(token)
                .build();
        IntroSpectResponse introSpectResponse = jwtService.introspect(introSpectRequest);
        if (!introSpectResponse.isValid()) {
            throw new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn");
        }
        String userEmail = jwtService.extractemail(token);
        nguoidung tokenUser = userRepository.findByEmail(userEmail);
        String idsuatchieu = suatChieuService.getIdsuatchieubyTgianchieu(request.getShowTime());
        String idlichchieu = lichChieuService.getIdlichchieuByIdsuatchieuAndIdphong(idsuatchieu, request.getIdPhong(), request.getBookingDate());
        List<String> SeatList = choNgoiService.findListSeatByRowAndColumn(request.getSelectedSeats(), request.getIdPhong());
        for (String seat: SeatList)
        {
            String curentHolder = giuGheService.getNguoiGiuGhe(idlichchieu,seat);
            if (!tokenUser.getIdUser().equals(curentHolder))
                throw new IllegalStateException("Ghế " + seat + " không còn giữ bởi bạn hoặc đã bị giữ bởi người khác.");
        }
        String idve = veService.AddVe(tokenUser.getIdUser(), request.getTotalPrice());
        for (String seat: SeatList)
        {
            chiTietDatVeService.AddChitietdatve(idve,idlichchieu,seat, request.getTotalPrice());
            giuGheService.xoaGiuGhe(idlichchieu,seat);
        }
        return "đặt thành công";
    }

    public Boolean Giughe(BookingRequest request, String token) throws ParseException, JOSEException {
        IntroSpectRequest introSpectRequest = IntroSpectRequest.builder()
                .token(token)
                .build();
        IntroSpectResponse introSpectResponse = jwtService.introspect(introSpectRequest);
        if (!introSpectResponse.isValid()) {
            throw new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn");
        }
        String userEmail = jwtService.extractemail(token);
        nguoidung tokenUser = userRepository.findByEmail(userEmail);
        List<String> SeatList = choNgoiService.findListSeatByRowAndColumn(request.getSelectedSeats(), request.getIdPhong());
        String idsuatchieu = suatChieuService.getIdsuatchieubyTgianchieu(request.getShowTime());
        String idlichchieu = lichChieuService.getIdlichchieuByIdsuatchieuAndIdphong(idsuatchieu, request.getIdPhong(), request.getBookingDate());
        for (String seat: SeatList)
        {
            Boolean ok = giuGheService.giuGhe(idlichchieu,seat,tokenUser.getIdUser());
            if (!ok) {
                return false;
            }
        }
        return true;
    }
    public String getsuatchieu(LocalTime suatchieu)
    {
        return suatChieuService.getIdsuatchieubyTgianchieu(suatchieu);
    }
    public String getlichchieu(String idsuatchieu, String idphong, LocalDate ngaydat)
    {
        return lichChieuService.getIdlichchieuByIdsuatchieuAndIdphong(idsuatchieu, idphong, ngaydat);
    }

    public Long getTTLRemain(String idlichchieu, String token) throws ParseException, JOSEException {
        IntroSpectRequest introSpectRequest = IntroSpectRequest.builder()
                .token(token)
                .build();
        IntroSpectResponse introSpectResponse = jwtService.introspect(introSpectRequest);
        if (!introSpectResponse.isValid()) {
            throw new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn");
        }
        String userEmail = jwtService.extractemail(token);
        nguoidung tokenUser = userRepository.findByEmail(userEmail);
        return giuGheService.getRemainingTTL(idlichchieu, tokenUser.getIdUser());
    }
}
