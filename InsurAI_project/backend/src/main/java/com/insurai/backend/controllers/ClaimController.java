package com.insurai.backend.controllers;

import com.insurai.backend.entities.Agent;
import com.insurai.backend.entities.Claim;
import com.insurai.backend.entities.Plan;
import com.insurai.backend.entities.User;
import com.insurai.backend.repositories.AgentRepository;
import com.insurai.backend.repositories.ClaimRepository;
import com.insurai.backend.repositories.PlanRepository;
import com.insurai.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "http://localhost:3000")
public class ClaimController {

    @Autowired
    private ClaimRepository claimRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PlanRepository planRepository;
    @Autowired
    private AgentRepository agentRepository;

    // URL: POST http://localhost:8080/api/claims
    // in ClaimController

    @PostMapping
    public ResponseEntity<?> createClaim(@RequestBody Claim claim) {

        claim.setClaimDate(java.time.LocalDateTime.now());

        // save claim
        Claim saved = claimRepository.save(claim);

        // find user by claim email
        User user = userRepository.findByEmail(claim.getEmail()).orElse(null);

        // find agent by claim agentName (or use agentEmail if you store that)
        Agent agent = agentRepository.findByName(claim.getAgentName()).orElse(null);

        // find plan by policyName
        Plan plan = planRepository.findByName(claim.getPolicyName()).orElse(null);

        if (user != null) {
            if (agent != null) {
                user.setAgent(agent);                    // <-- sets agent_id
            }
            if (plan != null) {
                user.setPlan(plan);
                user.setTotalAmount(plan.getCoverageAmount());
                user.setMonthlyAmount(plan.getMonthlyPremium());
            }
            if (user.getPaidAmount() == null) {
                user.setPaidAmount(0.0);
            }
            userRepository.save(user);                   // <-- writes agent_id to DB
        }

        return ResponseEntity.ok(saved);
    }
    @GetMapping("/by-agent-from-claims")
    public ResponseEntity<?> getUsersByAgentFromClaims(@RequestParam String agentName) {
        List<Claim> claims = claimRepository.findByAgentName(agentName);
        if (claims.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        Map<String, Claim> latestByEmail = new HashMap<>();
        for (Claim c : claims) {
            latestByEmail.put(c.getEmail(), c);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Claim c : latestByEmail.values()) {
            Map<String, Object> row = new HashMap<>();
            row.put("id", c.getId());
            row.put("name", c.getName());
            row.put("email", c.getEmail());
            row.put("gender", c.getGender());
            row.put("policyName", c.getPolicyName());
            row.put("cityOrVillage", c.getCityOrVillage());
            row.put("claimDate", c.getClaimDate());
            row.put("requestSent", c.isRequestSent());
            row.put("status", c.getStatus());              // <-- add status
            row.put("approvedDate", c.getApprovedDate());  // <-- add date
            result.add(row);
        }

        return ResponseEntity.ok(result);
    }

    // PUT /api/claims/{id}/request
    @PutMapping("/{id}/request")
    public ResponseEntity<?> markRequestSent(@PathVariable Long id) {
        Claim claim = claimRepository.findById(id).orElse(null);
        if (claim == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Claim not found"));
        }
        claim.setRequestSent(true);
        claimRepository.save(claim);
        return ResponseEntity.ok(Map.of("success", true));
    }
    // GET /api/claims/requests
    // GET /api/claims/requests
    @GetMapping("/requests")
    public ResponseEntity<?> getRequestedClaims() {
        List<Claim> claims = claimRepository.findByRequestSentTrue();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Claim c : claims) {
            Map<String, Object> row = new HashMap<>();
            row.put("id", c.getId());
            row.put("name", c.getName());
            row.put("email", c.getEmail());
            row.put("gender", c.getGender());
            row.put("policyName", c.getPolicyName());
            row.put("cityOrVillage", c.getCityOrVillage());
            row.put("claimDate", c.getClaimDate());
            row.put("agentName", c.getAgentName());
            row.put("status", c.getStatus());              // <-- include status
            row.put("approvedDate", c.getApprovedDate());  // <-- include date
            result.add(row);
        }
        return ResponseEntity.ok(result);
    }



    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveClaim(@PathVariable Long id) {
        Claim claim = claimRepository.findById(id).orElse(null);
        if (claim == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Claim not found"));
        }
        claim.setStatus("APPROVED");
        claim.setApprovedDate(LocalDate.now());
        claimRepository.save(claim);
        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "approvedDate", claim.getApprovedDate()
                )
        );
    }
    // GET /api/claims/by-agent-approved?agentName=...
    @GetMapping("/by-agent-approved")
    public ResponseEntity<?> getApprovedByAgent(@RequestParam String agentName) {
        List<Claim> claims = claimRepository.findByAgentNameAndStatus(agentName, "APPROVED");
        List<Map<String, Object>> result = new ArrayList<>();
        for (Claim c : claims) {
            // find user to get balance
            User user = userRepository.findByEmail(c.getEmail()).orElse(null);
            double balance = 0.0;
            if (user != null) {
                double total = user.getTotalAmount() != null ? user.getTotalAmount() : 0.0;
                double paid = user.getPaidAmount() != null ? user.getPaidAmount() : 0.0;
                balance = total - paid;
            }

            Map<String, Object> row = new HashMap<>();
            row.put("id", c.getId());
            row.put("name", c.getName());
            row.put("email", c.getEmail());
            row.put("gender", c.getGender());
            row.put("policyName", c.getPolicyName());
            row.put("cityOrVillage", c.getCityOrVillage());
            row.put("claimDate", c.getClaimDate());        // claim submitted date
            row.put("approvedDate", c.getApprovedDate());  // admin approval date
            row.put("balance", balance);                   // due amount
            row.put("completed", c.isCompleted());         // status
            result.add(row);
        }
        return ResponseEntity.ok(result);
    }
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeClaim(@PathVariable Long id) {
        Claim claim = claimRepository.findById(id).orElse(null);
        if (claim == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Claim not found"));
        }
        claim.setCompleted(true);
        claimRepository.save(claim);
        return ResponseEntity.ok(Map.of("success", true));
    }


}
