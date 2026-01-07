package com.sweetshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main entry point for the Sweet Shop Management System API.
 * This application provides RESTful endpoints for managing sweets,
 * user authentication, and inventory operations.
 */
@SpringBootApplication
@EnableScheduling
public class SweetShopApplication {

    public static void main(String[] args) {
        SpringApplication.run(SweetShopApplication.class, args);
    }
}
