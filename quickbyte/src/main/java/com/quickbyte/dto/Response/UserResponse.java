package com.quickbyte.dto.Response;

import com.quickbyte.enums.AccountStatus;
import com.quickbyte.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phoneNumber;

    private Role role;

    private AccountStatus accountStatus;

}