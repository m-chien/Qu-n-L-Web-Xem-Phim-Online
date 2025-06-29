package org.example.controller;

import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import org.example.dto.request.ApiResponse;
import org.example.dto.request.BookingRequest;
import org.example.dto.request.BookingResponse;
import org.example.exception.ErrorCode;
import org.example.model.chongoi;
import org.example.service.BookingService;
import org.example.service.ChoNgoiService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final StringRedisTemplate redisTemplate;
    private final ChoNgoiService choNgoiService;
    //đặt chỗ sau khi đã thanh toán
    @PostMapping
    public ResponseEntity<ApiResponse<?>> datve(
            @RequestBody BookingRequest request,
            @RequestHeader("Authorization") String authorizationHeader) throws ParseException, JOSEException {
        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }
        String result = bookingService.CreateBooking(request,token);
        return ResponseEntity.ok(ApiResponse.builder()
                        .code(1000)
                        .message(result)
                        .build());
    }
    //lưu ghế đã chọn vào redis
    @PostMapping("/giuGhe")
    public ResponseEntity<ApiResponse<?>> giuGhe(
            @RequestBody BookingRequest request,
            @RequestHeader("Authorization") String authorizationHeader) throws ParseException, JOSEException {
        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }
        Boolean result = bookingService.Giughe(request,token);
        if (!result) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.builder()
                            .code(ErrorCode.Seat_Holder.getCode())
                            .message(ErrorCode.Seat_Holder.getMessage())
                            .build());
        }
        BookingResponse bookingResponse = BookingResponse.builder()
                .idPhim(request.getIdPhim())
                .idPhong(request.getIdPhong())
                .selectedSeats(request.getSelectedSeats())
                .totalPrice(request.getTotalPrice())
                .bookingDate(request.getBookingDate())
                .showTime(request.getShowTime())
                .idlichchieu(bookingService.getlichchieu(
                        bookingService.getsuatchieu(request.getShowTime()),
                        request.getIdPhong(),
                        request.getBookingDate()))
                .build();
        return ResponseEntity.ok(ApiResponse.builder()
                        .code(1000)
                        .message("giữ ghế thành công")
                        .result(bookingResponse)
                        .build());
    }
    //trả về danh sách các ghế đã đặt chỗ trên redis
    @GetMapping("/ghe")
    public ResponseEntity<List<chongoi>>  Getghedaduocdat(
            @RequestParam LocalTime suatchieu,
            @RequestParam String idphong,
            @RequestParam LocalDate ngaydat)
    {
        String idlichchieu = bookingService.getlichchieu(bookingService.getsuatchieu(suatchieu),idphong,ngaydat);
        Set<String> keys = redisTemplate.keys("giu-ghe:" + idlichchieu + ":*");
        if (keys == null || keys.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        List<chongoi> danhSachGhe = keys.stream()
                .map(key -> key.substring(key.lastIndexOf(":") + 1))  // tách "A1"
                .map(choNgoiService::findbyId)                        // gọi DB hoặc service
                .filter(Objects::nonNull)                             // tránh null
                .toList();

        return ResponseEntity.ok(danhSachGhe);
    }
    @GetMapping("/remainTime")
    public ResponseEntity<Long> getTimeRemain(@RequestParam String idlichchieu,@RequestHeader("Authorization") String authorizationHeader) throws ParseException, JOSEException {
        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }
        return ResponseEntity.ok(bookingService.getTTLRemain(idlichchieu,token));
    }
}
