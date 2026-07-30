package com.quickbyte.dto.Response;

import lombok.*;
import com.quickbyte.enums.Role;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String message;

    private String token;

    private Role role;

}