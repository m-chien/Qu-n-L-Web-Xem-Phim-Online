package org.example.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class GiuGheService {
    private final StringRedisTemplate stringRedisTemplate;
    private static final Duration TTL = Duration.ofMinutes(7);

    public Boolean giuGhe(String idlichchieu, String ghe, String userId)
    {
        String key = "giu-ghe:" + idlichchieu + ":" + ghe;
        return Boolean.TRUE.equals(stringRedisTemplate.opsForValue().setIfAbsent(key,userId,TTL));
    }
    public String getNguoiGiuGhe(String idlichchieu, String ghe)
    {
        String key = "giu-ghe:" + idlichchieu + ":" + ghe;
        return stringRedisTemplate.opsForValue().get(key);
    }
    public void xoaGiuGhe(String idlichchieu, String ghe)
    {
        String key = "giu-ghe:" + idlichchieu + ":"+ ghe;
        stringRedisTemplate.delete(key);
    }
    public Long getRemainingTTL(String idlichchieu, String userId) {
        Set<String> keys = stringRedisTemplate.keys("giu-ghe:" + idlichchieu + ":*");

        if (keys == null || keys.isEmpty()) {
            return -2L; // Không có key nào
        }

        Optional<String> matchedKey = keys.stream()
                .filter(k -> userId.equals(stringRedisTemplate.opsForValue().get(k)))
                .findFirst();
        return matchedKey.map(stringRedisTemplate::getExpire).orElse(-2L);
    }
}
