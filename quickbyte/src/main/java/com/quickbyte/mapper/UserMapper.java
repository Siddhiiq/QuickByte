package com.quickbyte.mapper;

import com.quickbyte.dto.Request.UserRegistrationRequest;
import com.quickbyte.dto.Response.UserResponse;
import com.quickbyte.entity.User.Users;
import com.quickbyte.enums.AccountStatus;
import com.quickbyte.enums.Role;

public class UserMapper {

    public static Users toEntity(UserRegistrationRequest request) {

        Users user = new Users();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setPhoneNumber(request.getPhoneNumber());

        user.setRole(Role.CUSTOMER);
        user.setAccountStatus(AccountStatus.ACTIVE);

        return user;
    }

    public static UserResponse toResponse(Users user) {

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setRole(user.getRole());
        response.setAccountStatus(user.getAccountStatus());

        return response;
    }
}