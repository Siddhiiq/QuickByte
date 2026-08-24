package com.quickbyte.service;


import com.quickbyte.entity.User.RefreshToken;
import com.quickbyte.entity.User.Users;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(Users user);

    RefreshToken verifyRefreshToken(String token);

    void deleteByUser(Users user);
}