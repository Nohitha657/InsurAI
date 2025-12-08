package com.insurai.backend.repositories;

import com.insurai.backend.entities.Agent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AgentRepository extends JpaRepository<Agent, Long> {
    List<Agent> findByStatus(String status);
    Optional<Agent> findByEmail(String email);
    // in AgentRepository
    Optional<Agent> findByName(String name);



}
