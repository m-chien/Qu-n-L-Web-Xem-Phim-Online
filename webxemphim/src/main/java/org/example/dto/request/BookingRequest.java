package org.example.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingRequest {
    private String idPhim;
    private String idPhong;
    private List<String> selectedSeats;
    private BigDecimal totalPrice;
    private LocalDate bookingDate;
    private LocalTime showTime;
    private List<FoodBooking> foodList;
    private String iduser;
}
