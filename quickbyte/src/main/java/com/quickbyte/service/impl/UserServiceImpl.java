package com.quickbyte.service.impl;

import com.quickbyte.dto.Request.LoginRequest;
import com.quickbyte.dto.Response.LoginResponse;
import com.quickbyte.dto.Request.UserRegistrationRequest;
import com.quickbyte.dto.Response.UserResponse;
import com.quickbyte.entity.User.Users;
import com.quickbyte.exception.ResourceAlreadyExistsException;
import com.quickbyte.mapper.UserMapper;
import com.quickbyte.repository.UserRepository;
import com.quickbyte.security.jwt.JwtService;
import com.quickbyte.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.service.EmailService;
import com.quickbyte.entity.User.RefreshToken;
import com.quickbyte.service.RefreshTokenService;
import com.quickbyte.dto.Request.RefreshTokenRequest;
import com.quickbyte.dto.Response.RefreshTokenResponse;
import com.quickbyte.entity.User.RefreshToken;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;
    private final EmailService emailService;

    @Override
    public UserResponse registerUser(UserRegistrationRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {

            throw new ResourceAlreadyExistsException(
                    "Email already exists");

        }

        if (userRepository.existsByPhoneNumber(
                request.getPhoneNumber())) {

            throw new ResourceAlreadyExistsException(
                    "Phone number already exists");

        }

        Users user = UserMapper.toEntity(request);
        if (user.getRole() == null) {
            user.setRole(com.quickbyte.enums.Role.CUSTOMER);
        }

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        Users savedUser = userRepository.save(user);
        /*emailService.sendSimpleEmail(

                savedUser.getEmail(),

                "Welcome to QuickByte 🎉",

                "Hi " + savedUser.getFullName()
                        + ",\n\n"
                        + "Welcome to QuickByte!\n\n"
                        + "Your account has been created successfully.\n\n"
                        + "Happy Ordering!\n\n"
                        + "Regards,\n"
                        + "QuickByte Team"
        );*/

        return UserMapper.toResponse(savedUser);

    }

    @Override
    public LoginResponse login(LoginRequest request) {

        Users user = userRepository.findByEmail(
                        request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Invalid Email or Password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new ResourceNotFoundException(
                    "Invalid Email or Password");
        }

        String accessToken =
                jwtService.generateToken(
                        user.getEmail(),
                        user.getRole().name()
                );

        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(user);

        return LoginResponse.builder()

                .message("Login Successful")

                .accessToken(accessToken)

                .refreshToken(refreshToken.getToken())

                .tokenType("Bearer")

                .role(user.getRole())

                .userId(user.getId())

                .email(user.getEmail())

                .build();
    }

    @Override
    public void logout(Long userId) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        refreshTokenService.deleteByUser(user);

    }
    @Override
    public UserResponse getUserById(Long id) {

        Users user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return UserMapper.toResponse(user);
    }
    @Override
    public RefreshTokenResponse refreshToken(
            RefreshTokenRequest request) {

        RefreshToken refreshToken =
                refreshTokenService.verifyRefreshToken(
                        request.getRefreshToken());

        Users user = refreshToken.getUser();

        String accessToken =
                jwtService.generateAccessToken(
                        user.getEmail(),
                        user.getRole().name()
                );

        return RefreshTokenResponse.builder()

                .accessToken(accessToken)

                .refreshToken(refreshToken.getToken())

                .tokenType("Bearer")

                .build();
    }

}