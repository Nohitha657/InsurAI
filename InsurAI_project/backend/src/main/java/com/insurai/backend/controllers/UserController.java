package com.insurai.backend.controllers;

import com.insurai.backend.entities.User;
import com.insurai.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("user");
            }
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Email already registered!"));
            }
            User saved = userRepository.save(user);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid data or server error!"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        return userRepository.findByEmail(loginData.get("email"))
                .filter(user -> user.getPassword().equals(loginData.get("password")))
                .map(user -> ResponseEntity.ok(Map.of(
                        "success", true,
                        "user", user
                )))
                .orElseGet(() -> ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid credentials", "success", false)));
    }



    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
