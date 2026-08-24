package com.quickbyte;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
public class QuickbyteApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuickbyteApplication.class, args);
	}

}
