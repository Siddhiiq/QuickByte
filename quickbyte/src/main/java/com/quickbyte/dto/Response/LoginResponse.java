package com.quickbyte.dto.Response;

import com.quickbyte.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String message;

    private String accessToken;

    private String refreshToken;

    private String tokenType;

    private Role role;

    private Long userId;

    private String email;
}