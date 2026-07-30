package com.quickbyte.service;

public interface EmailService {

    void sendSimpleEmail(
            String to,
            String subject,
            String body
    );

}