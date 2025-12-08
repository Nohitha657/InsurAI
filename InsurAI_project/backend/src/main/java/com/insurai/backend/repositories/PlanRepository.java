package com.insurai.backend.repositories;

import com.insurai.backend.entities.Plan;
import com.insurai.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlanRepository extends JpaRepository<Plan, Long> {
    Optional<Plan> findByName(String name);
}

