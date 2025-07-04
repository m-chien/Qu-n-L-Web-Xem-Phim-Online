package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.request.FoodBooking;
import org.example.model.VeFood;
import org.example.repository.VeFoodRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VeFoodService {
    private final VeFoodRepository veFoodRepository;
    private final JdbcTemplate jdbcTemplate;

    public synchronized String generateNextIdVeFood() {
        String prefix = "VF";
        String sql = "SELECT MAX(idvefood) FROM ve_food";
        String maxId = jdbcTemplate.queryForObject(sql, String.class);

        int nextNumber = 1;
        if (maxId != null) {
            String numberPart = maxId.replace(prefix, "");
            nextNumber = Integer.parseInt(numberPart) + 1;
        }

        return prefix + String.format("%03d", nextNumber);
    }

    public void addVefood(String idve, FoodBooking food) {
        VeFood vf = new VeFood(generateNextIdVeFood(),idve,food.getIdfood(), food.getSoluong());
        veFoodRepository.saveAndFlush(vf);
    }
}
