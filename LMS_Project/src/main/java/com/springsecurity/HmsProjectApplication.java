package com.springsecurity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HmsProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(HmsProjectApplication.class, args);
	}

}
