package com.quickbyte.service;

import com.quickbyte.dto.Request.LoginRequest;
import com.quickbyte.dto.Response.LoginResponse;
import com.quickbyte.dto.Request.UserRegistrationRequest;
import com.quickbyte.dto.Response.UserResponse;

public interface UserService {

    UserResponse registerUser(UserRegistrationRequest request);

    LoginResponse login(LoginRequest request);

    UserResponse getUserById(Long id);

}