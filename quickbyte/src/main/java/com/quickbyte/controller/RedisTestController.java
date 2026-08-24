package com.quickbyte.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/redis")
@RequiredArgsConstructor
public class RedisTestController {

    private final StringRedisTemplate redisTemplate;

    @PostMapping("/save")
    public String save() {

        redisTemplate.opsForValue().set(
                "project",
                "QuickByte");

        return "Saved";
    }

    @GetMapping("/get")
    public String get() {

        return redisTemplate.opsForValue().get(
                "project");
    }
}