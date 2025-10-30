package com.insurai.backend.controllers;

import com.insurai.backend.entities.User;
import com.insurai.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        if(user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("user"); // default fallback for API calls
        }
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public Object login(@RequestBody User loginData) {
        var userOptional = userRepository.findByEmail(loginData.getEmail())
                .filter(user -> user.getPassword().equals(loginData.getPassword()));

        if (userOptional.isPresent()) {
            return new Response(userOptional.get());
        } else {
            return new ErrorResponse("Invalid credentials");
        }
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public static class Response {
        public boolean success = true;
        public User user;
        public Response(User user) { this.user = user; }
    }

    public static class ErrorResponse {
        public boolean success = false;
        public String message;
        public ErrorResponse(String msg) { this.message = msg; }
    }
}
