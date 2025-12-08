package com.insurai.backend.controllers;

import com.insurai.backend.entities.Plan;
import com.insurai.backend.entities.User;
import com.insurai.backend.repositories.PlanRepository;
import com.insurai.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/plans")
public class PlanController {
    @Autowired private PlanRepository planRepository;
    @Autowired private UserRepository userRepository;
    // Get all plans (visible to all)
    @GetMapping
    public List<Plan> getAll() { return planRepository.findAll(); }

    // Add plan (admin only)
    @PostMapping
    public Plan create(@RequestBody Plan plan) { return planRepository.save(plan); }

    // Edit plan (admin only)
    @PutMapping("/{id}")
    public ResponseEntity<Plan> update(@PathVariable Long id, @RequestBody Plan plan) {
        return planRepository.findById(id)
                .map(existingPlan -> {
                    // Update fields explicitly
                    existingPlan.setName(plan.getName());
                    existingPlan.setDescription(plan.getDescription());
                    existingPlan.setMonthlyPremium(plan.getMonthlyPremium());
                    existingPlan.setCoverageAmount(plan.getCoverageAmount());
                    existingPlan.setStatus(plan.getStatus());
                    Plan saved = planRepository.save(existingPlan);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    // Delete plan (admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!planRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        planRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
//    @GetMapping("/me/plan-summary")
//    public ResponseEntity<?> getMyPlanSummary(@RequestParam String email) {
//        User user = userRepository.findByEmail(email).orElse(null);
//        if (user == null) {
//            return ResponseEntity.badRequest()
//                    .body(Map.of("message", "User not found"));
//        }
//
//        Plan plan = user.getPlan();   // or however you link user → plan
//        if (plan == null) {
//            return ResponseEntity.ok(Map.of("hasPlan", false));
//        }
//
//        // EXAMPLE: adapt these to your real Plan fields
//        double totalAmount   = plan.getCoverageAmount();   // total sum insured / total amount
//        double monthlyAmount = plan.getMonthlyPremium();  // monthly premium
//
//        // if you do not yet store paid amount, set it 0 for now
//        double paidAmount = 0.0;
//        double dueAmount  = totalAmount - paidAmount;
//
//        Map<String, Object> dto = Map.of(
//                "hasPlan", true,
//                "planName", plan.getName(),
//                "totalAmount", totalAmount,
//                "monthlyAmount", monthlyAmount,
//                "dueAmount", dueAmount
//        );
//        return ResponseEntity.ok(dto);
//    }

}
