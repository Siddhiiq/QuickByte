package com.quickbyte.controller;

import com.quickbyte.dto.Request.LoginRequest;
import com.quickbyte.dto.Response.LoginResponse;
import com.quickbyte.dto.Request.UserRegistrationRequest;
import com.quickbyte.dto.Response.UserResponse;
import com.quickbyte.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public UserResponse registerUser(
            @Valid
            @RequestBody UserRegistrationRequest request) {

        return userService.registerUser(request);

    }

    @PostMapping("/login")
    public LoginResponse login(

            @Valid
            @RequestBody LoginRequest request) {

        return userService.login(request);

    }
    @GetMapping("/{id}")
    public UserResponse getUserById(
            @PathVariable Long id) {

        return userService.getUserById(id);
    }


}