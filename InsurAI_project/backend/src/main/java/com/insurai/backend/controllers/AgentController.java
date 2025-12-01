package com.insurai.backend.controllers;

import com.insurai.backend.dto.AgentProfileDTO;
import com.insurai.backend.entities.Agent;
import com.insurai.backend.entities.Plan;
import com.insurai.backend.entities.User;
import com.insurai.backend.repositories.AgentRepository;
import com.insurai.backend.repositories.UserRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/agents")
@CrossOrigin(origins = "http://localhost:3000")
public class AgentController {

    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private UserRepository userRepository;

    // ---------- BASIC LISTS ----------

    @GetMapping
    public List<Agent> getAllAgents() {
        return agentRepository.findAll();
    }

    @GetMapping("/active")
    public List<Agent> getActiveAgents() {
        return agentRepository.findByStatus("active");
    }


    @PostMapping   // <-- plain POST /api/agents
    public ResponseEntity<?> createAgent(@RequestBody Agent agent) {
        try {
            // Optional: avoid duplicate email
            if (agentRepository.findByEmail(agent.getEmail()).isPresent()) {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("message", "Email already registered"));
            }

            if (agent.getStatus() == null || agent.getStatus().isBlank()) {
                agent.setStatus("active");
            }

            String commonPassword = "Admin@123";   // default password
            String hashed = new BCryptPasswordEncoder().encode(commonPassword);
            agent.setPassword(hashed);

            Agent saved = agentRepository.save(agent);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Error saving agent"));
        }
    }


    // ---------- PASSWORD RESET / CHANGE ----------

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordDto dto) {
        Optional<Agent> agentOpt = agentRepository.findByEmail(dto.getEmail());
        if (agentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Agent not found");
        }

        Agent agent = agentOpt.get(); // unwrap Optional

        String hashed = new BCryptPasswordEncoder().encode(dto.getPassword());
        agent.setPassword(hashed);
        agentRepository.save(agent);

        return ResponseEntity.ok(Map.of("success", true));
    }


    // ---------- AGENT DASHBOARD ENDPOINTS ----------

    // Basic agent info for dashboard: GET /api/agents/me?email=...
    // Basic agent info for dashboard: GET /api/agents/me?email=...
    @GetMapping("/me")
    public ResponseEntity<?> getAgentMe(@RequestParam String email) {
        Optional<Agent> agentOpt = agentRepository.findByEmail(email);
        if (agentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Agent not found");
        }

        Agent agent = agentOpt.get();

        Map<String, Object> body = Map.of(
                "id", agent.getId(),
                "name", agent.getName(),
                "email", agent.getEmail(),
                "phone", agent.getPhone(),
                "status", agent.getStatus()
        );
        return ResponseEntity.ok(body);
    }


    // Real aggregated stats from User + Plan: GET /api/agents/me/stats?email=...
    @GetMapping("/me/stats")
    public ResponseEntity<?> getAgentStats(@RequestParam String email) {
        Optional<Agent> agentOpt = agentRepository.findByEmail(email);
        if (agentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Agent not found");
        }
        Agent agent = agentOpt.get();
        List<User> users = userRepository.findByAgent(agent);

        int policiesRegistered = users.size();
        int runningPolicies = 0;
        int completedPolicies = 0;
        double totalAmount = 0.0;
        double paidAmount = 0.0;

        for (User user : users) {
            Plan plan = user.getPlan();
            if (plan != null) {
                String st = plan.getStatus();
                if ("running".equalsIgnoreCase(st)) {
                    runningPolicies++;
                } else if ("completed".equalsIgnoreCase(st)) {
                    completedPolicies++;
                }

                // These getters must match your Plan.java
                totalAmount += plan.getMonthlyPremium();
                paidAmount += plan.getCoverageAmount();
            }
        }

        Map<String, Object> body = Map.of(
                "policiesRegistered", policiesRegistered,
                "runningPolicies", runningPolicies,
                "completedPolicies", completedPolicies,
                "totalAmount", totalAmount,
                "paidAmount", paidAmount
        );
        return ResponseEntity.ok(body);
    }

    // Appointments list for agent (currently empty): GET /api/agents/me/appointments?email=...
    @GetMapping("/me/appointments")
    public List<Map<String, Object>> getAppointments(@RequestParam String email) {
        // TODO: fetch real appointments for this agent
        return List.of();
    }

    // ---------- AGENT UPDATES OWN STATUS ----------

    // Agent updates own status: PUT /api/agents/me/status?email=...
    @PutMapping("/me/status")
    public ResponseEntity<?> updateMyStatus(@RequestParam String email,
                                            @RequestBody String status) {
        Optional<Agent> agentOpt = agentRepository.findByEmail(email);
        if (agentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Agent not found");
        }

        Agent agent = agentOpt.get(); // unwrap Optional<Agent>

        String cleanStatus = status.replace("\"", "").trim();
        agent.setStatus(cleanStatus);
        agentRepository.save(agent);

        return ResponseEntity.ok(Map.of("success", true, "status", agent.getStatus()));
    }


    // ---------- ADMIN PROFILE VIEW BY ID (OPTIONAL) ----------

    @GetMapping("/{agentId}/profile")
    public AgentProfileDTO getAgentProfile(@PathVariable Long agentId) {
        Agent agent = agentRepository.findById(agentId).orElseThrow();
        List<User> users = userRepository.findByAgent(agent);

        int policiesRegistered = users.size();
        int runningPolicies = 0;
        int completedPolicies = 0;
        for (User user : users) {
            Plan plan = user.getPlan();
            if (plan != null) {
                String st = plan.getStatus();
                if ("running".equalsIgnoreCase(st)) runningPolicies++;
                if ("completed".equalsIgnoreCase(st)) completedPolicies++;
            }
        }
        return new AgentProfileDTO(
                agent.getName(),
                agent.getEmail(),
                policiesRegistered,
                runningPolicies,
                completedPolicies
        );
    }

    // ---------- DTOs ----------

    @Data
    public static class CreateAgentDto {
        private String name;
        private String email;
        private String phone;
        private String specialization;
    }

    @Data
    public static class ResetPasswordDto {
        private String email;
        private String password;
    }
}
