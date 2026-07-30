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

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

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
        emailService.sendSimpleEmail(

                savedUser.getEmail(),

                "Welcome to QuickByte 🎉",

                "Hi " + savedUser.getFullName()
                        + ",\n\n"
                        + "Welcome to QuickByte!\n\n"
                        + "Your account has been created successfully.\n\n"
                        + "Happy Ordering!\n\n"
                        + "Regards,\n"
                        + "QuickByte Team"
        );

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

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name());

        return LoginResponse.builder()
                .message("Login Successful")
                .token(token)
                .role(user.getRole())
                .build();

    }
    @Override
    public UserResponse getUserById(Long id) {

        Users user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return UserMapper.toResponse(user);
    }

}