package com.insurai.backend.controllers;

import com.insurai.backend.entities.Plan;
import com.insurai.backend.repositories.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class PlanController {
    @Autowired
    private PlanRepository planRepository;

    @GetMapping
    public List<Plan> getAll() {
        return planRepository.findAll();
    }

    @PostMapping
    public Plan create(@RequestBody Plan plan) {
        return planRepository.save(plan);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        planRepository.deleteById(id);
    }
}
