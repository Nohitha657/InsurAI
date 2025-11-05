package com.insurai.backend.controllers;

import com.insurai.backend.dto.UserProfileDTO;
import com.insurai.backend.entities.Agent;
import com.insurai.backend.entities.Plan;
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



    @GetMapping("/{id}/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        Agent agent = user.getAgent();
        Plan plan = user.getPlan();

        // For demo, let's say totalAmount is 12 months of premium
        double total = plan.getMonthlyPremium() * 12;
        double paid = user.getPaidAmount(); // Or sum from payments table
        double remaining = total - paid;

        UserProfileDTO dto = new UserProfileDTO(
                user.getFullName(),
                user.getEmail(),
                (agent != null ? agent.getName() : "N/A"),
                (plan != null ? plan.getName() : "N/A"),
                (plan != null ? plan.getDescription() : ""),
                (plan != null ? plan.getMonthlyPremium() : 0.0),
                total, paid, remaining
        );
        return ResponseEntity.ok(dto);
    }

}
