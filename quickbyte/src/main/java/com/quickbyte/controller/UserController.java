package com.quickbyte.controller;

import com.quickbyte.dto.Request.LoginRequest;
import com.quickbyte.dto.Request.RefreshTokenRequest;
import com.quickbyte.dto.Request.UserRegistrationRequest;

import com.quickbyte.dto.Response.LoginResponse;
import com.quickbyte.dto.Response.RefreshTokenResponse;
import com.quickbyte.dto.Response.UserResponse;

import com.quickbyte.service.UserService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {


    private final UserService userService;


    /*
    ==================================
    REGISTER USER
    ==================================
    */

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse registerUser(

            @Valid

            @RequestBody
            UserRegistrationRequest request

    ) {

        return userService.registerUser(
                request
        );

    }



    /*
    ==================================
    LOGIN
    ==================================
    */

    @PostMapping("/login")
    public LoginResponse login(

            @Valid

            @RequestBody
            LoginRequest request

    ) {

        return userService.login(
                request
        );

    }



    /*
    ==================================
    REFRESH TOKEN
    ==================================
    */

    @PostMapping("/refresh-token")
    public RefreshTokenResponse refreshToken(

            @Valid

            @RequestBody
            RefreshTokenRequest request

    ) {

        return userService.refreshToken(
                request
        );

    }



    /*
    ==================================
    LOGOUT
    ==================================
    */

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(

            @RequestParam
            Long userId

    ) {

        userService.logout(
                userId
        );

    }



    /*
    ==================================
    GET ALL USERS
    ADMIN ONLY
    ==================================
    */

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers() {

        return userService.getAllUsers();

    }



    /*
    ==================================
    GET USER BY ID
    ==================================
    */

    @GetMapping("/{id}")
    public UserResponse getUserById(

            @PathVariable
            Long id

    ) {

        return userService.getUserById(
                id
        );

    }

}