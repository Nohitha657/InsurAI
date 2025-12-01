package com.insurai.backend.controllers;

import com.insurai.backend.dto.LoginDTO;
import com.insurai.backend.dto.UserProfileDTO;
import com.insurai.backend.entities.Agent;
import com.insurai.backend.entities.Plan;
import com.insurai.backend.entities.User;
import com.insurai.backend.repositories.AgentRepository;
import com.insurai.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;



@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AgentRepository agentRepository;

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
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // User login
        Optional<User> userOpt = userRepository.findByEmail(dto.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (dto.getPassword().equals(user.getPassword())) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "user", Map.of("email", user.getEmail(),"fullName", user.getFullName(), "role", user.getRole())
                ));
            }
        }

        Optional<Agent> agentOpt = agentRepository.findByEmail(dto.getEmail());
        if (agentOpt.isPresent()) {
            Agent agent = agentOpt.get();
            if (encoder.matches(dto.getPassword(), agent.getPassword())) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "user", Map.of("email", agent.getEmail(),"fullName", agent.getName(),  "role", "agent")
                ));
            }
        }

        return ResponseEntity.status(401).body(
                Map.of("success", false, "message", "Invalid credentials")
        );
    }

    @GetMapping("/only-users")
    public List<User> getOnlyUsers() {
        return userRepository.findByRole("user");
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        Agent agent = user.getAgent();
        Plan plan = user.getPlan();

        double total = (plan != null ? plan.getMonthlyPremium() * 12 : 0.0);
        double paid = user.getPaidAmount();
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
