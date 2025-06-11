package org.example.service;

import org.example.model.food;
import org.example.repository.FoodRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodService {
    private final FoodRepository foodRepository;

    public FoodService(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }
    public List<food> getAllFood()
    {
        return foodRepository.findAll();
    }
}
