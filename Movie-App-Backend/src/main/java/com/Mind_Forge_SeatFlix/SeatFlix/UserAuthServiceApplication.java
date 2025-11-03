package com.Mind_Forge_SeatFlix.SeatFlix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.Mind_Forge_SeatFlix.SeatFlix")
public class UserAuthServiceApplication { // Main Application

	public static void main(String[] args) {
		SpringApplication.run(UserAuthServiceApplication.class, args);
	}
}
