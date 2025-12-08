package com.insurai.backend.repositories;

import com.insurai.backend.entities.Claim;
import com.insurai.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByEmail(String email);
    List<Claim> findByAgentName(String agentName);
    List<Claim> findByRequestSentTrue();   // for admin view
    List<Claim> findByAgentNameAndStatus(String agentName, String status);
// or findByUser(User user)
}

