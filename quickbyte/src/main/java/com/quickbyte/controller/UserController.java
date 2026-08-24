package com.quickbyte.controller;

import com.quickbyte.dto.Request.LoginRequest;
import com.quickbyte.dto.Response.LoginResponse;
import com.quickbyte.dto.Request.UserRegistrationRequest;
import com.quickbyte.dto.Response.UserResponse;
import com.quickbyte.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import com.quickbyte.dto.Request.RefreshTokenRequest;
import com.quickbyte.dto.Response.RefreshTokenResponse;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse registerUser(

            @Valid
            @RequestBody UserRegistrationRequest request) {

        return userService.registerUser(request);
    }
    @PostMapping("/refresh-token")
    public RefreshTokenResponse refreshToken(

            @Valid
            @RequestBody
            RefreshTokenRequest request) {

        return userService.refreshToken(request);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(

            @RequestParam Long userId) {

        userService.logout(userId);

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