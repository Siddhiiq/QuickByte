package com.quickbyte.service;

import com.quickbyte.dto.Request.LoginRequest;
import com.quickbyte.dto.Request.RefreshTokenRequest;
import com.quickbyte.dto.Request.UserRegistrationRequest;
import com.quickbyte.dto.Response.LoginResponse;
import com.quickbyte.dto.Response.RefreshTokenResponse;
import com.quickbyte.dto.Response.UserResponse;

public interface UserService {

    UserResponse registerUser(UserRegistrationRequest request);

    LoginResponse login(LoginRequest request);

    RefreshTokenResponse refreshToken(
            RefreshTokenRequest request);

    void logout(Long userId);

    UserResponse getUserById(Long id);
}