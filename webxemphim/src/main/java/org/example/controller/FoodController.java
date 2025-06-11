package org.example.controller;

import org.example.dto.request.ApiResponse;
import org.example.model.food;
import org.example.service.FoodService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/Food")
public class FoodController {
    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }
    @GetMapping
    public ApiResponse<List<food>> getAlFood()
    {
        ApiResponse<List<food>> ans = new ApiResponse<>();
        ans.setResult(foodService.getAllFood());
        ans.setMessage("tải thành công");
        return ans;
    }
}
