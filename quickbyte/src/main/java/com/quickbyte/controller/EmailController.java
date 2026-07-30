package com.quickbyte.controller;

import com.quickbyte.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/test")
    public String sendTestEmail(
            @RequestParam String to) {

        emailService.sendSimpleEmail(

                to,

                "QuickByte Test Email",

                "Congratulations!\n\n"
                        + "Your Email Service is working successfully.\n\n"
                        + "Regards,\n"
                        + "QuickByte Team"
        );

        return "Email Sent Successfully";

    }

}