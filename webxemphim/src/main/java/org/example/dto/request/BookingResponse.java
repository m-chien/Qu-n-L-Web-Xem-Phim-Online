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
public class BookingResponse {
     String idPhim;
     String idPhong;
     List<String> selectedSeats;
     BigDecimal totalPrice;
     LocalDate bookingDate;
     LocalTime showTime;
     String idlichchieu;
     List<FoodBooking> foodList;
}
