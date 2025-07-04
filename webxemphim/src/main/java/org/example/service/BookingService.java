package org.example.service;

import com.nimbusds.jose.JOSEException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dto.request.BookingRequest;
import org.example.dto.request.FoodBooking;
import org.example.dto.request.IntroSpectRequest;
import org.example.dto.request.IntroSpectResponse;
import org.example.exception.UnauthorizedException;
import org.example.model.chitietdatve;
import org.example.model.nguoidung;
import org.example.model.thanhtoan;
import org.example.model.ve;
import org.example.repository.ChiTietDatVeRepository;
import org.example.repository.VeRepository;
import org.example.repository.nguoidungRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {
    private final SuatChieuService suatChieuService;
    private final LichChieuService lichChieuService;
    private final ChoNgoiService choNgoiService;
    private final JwtService jwtService;
    private final nguoidungRepository userRepository;
    private final VeService veService;
    private final VeRepository veRepository;
    private final ChiTietDatVeService chiTietDatVeService;
    private final GiuGheService giuGheService;
    private final VeFoodService veFoodService;
    private final ThanhToanService thanhToanService;

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
        if (!tokenUser.getIdUser().equals(request.getIduser()))
            throw new RuntimeException("bạn không có quyền thao tác trên tài khoản của người khác");

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
        if (request.getFoodList() != null) {
            for (FoodBooking food : request.getFoodList()) {
                veFoodService.addVefood(idve, food);
            }
        }
        thanhToanService.addthanhtoan(idve,request.getTotalPrice());
        for (String seat: SeatList)
        {
            BigDecimal SeatPrice = choNgoiService.getSeatPricebyId(seat);
            chiTietDatVeService.AddChitietdatve(idve,idlichchieu,seat, SeatPrice);
            giuGheService.xoaGiuGhe(idlichchieu,seat);
        }
        return idve;
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

    public void updateOrderStatus(String idve, int number) {
        List<chitietdatve> chitietdatveList = chiTietDatVeService.getChiTietDatVeByidve(idve);
        ve v = veService.getVebyId(idve);
        thanhtoan thanhtoan = thanhToanService.getThanhtoanByidVe(idve);
        if (number == 1) statusSuccess(chitietdatveList,v,thanhtoan);
        else statusFailed(chitietdatveList,v,thanhtoan);
    }

    private void statusFailed(List<chitietdatve> chitietdatveList, ve v, thanhtoan thanhtoan) {
        for (chitietdatve chitietdatve1: chitietdatveList)
            chiTietDatVeService.updatechitietdatveFaile(chitietdatve1);
        veService.updateVeFaile(v);
        thanhToanService.updateThanhtoanFaile(thanhtoan);
    }

    private void statusSuccess(List<chitietdatve> chitietdatveList, ve v, thanhtoan thanhtoan) {
        for (chitietdatve chitietdatve1: chitietdatveList)
            chiTietDatVeService.updatechitietdatve(chitietdatve1);
        veService.updateVe(v);
        thanhToanService.updateThanhtoan(thanhtoan);
    }
    @Scheduled(fixedRate = 300000) // 5 phút = 300,000 milliseconds
    public void expireTickets() {
        try {
            System.out.println("chạy lần thứ......" + LocalDateTime.now());
            List<ve> expiredTickets = veRepository.findByTrangthaiAndNgayhethanBefore(
                    "Đang chờ thanh toán", LocalDateTime.now()
            );

            if (!expiredTickets.isEmpty()) {
                for (ve ticket : expiredTickets) {
                    updateOrderStatus(ticket.getIdVe(),0);
                    log.info("Vé hết hạn: {}, thời gian hết hạn: {}",
                            ticket.getIdVe(), ticket.getNgayhethan());
                }

                veRepository.saveAll(expiredTickets);
                log.info("Đã xử lý {} vé hết hạn", expiredTickets.size());
            }
        } catch (Exception e) {
            log.error("Lỗi khi xử lý vé hết hạn: {}", e.getMessage());
        }
    }
}
