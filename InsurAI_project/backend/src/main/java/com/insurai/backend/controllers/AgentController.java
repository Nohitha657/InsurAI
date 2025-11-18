
package com.insurai.backend.controllers;

import com.insurai.backend.dto.AgentProfileDTO;
import com.insurai.backend.entities.Agent;
import com.insurai.backend.entities.Plan;
import com.insurai.backend.entities.User;
import com.insurai.backend.repositories.AgentRepository;
import com.insurai.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/agents")
public class AgentController {
    @Autowired private AgentRepository agentRepo;
    @Autowired private AgentRepository agentRepository;
    @Autowired private UserRepository userRepository;

    @GetMapping
    public List<Agent> getAgents() {
        return agentRepo.findAll();
    }

    @GetMapping("/active")
    public List<Agent> getActiveAgents() {
        return agentRepo.findByStatus("active");
    }

    @PostMapping
    public Agent createAgent(@RequestBody Agent agent) {
        if (agent.getStatus() == null) agent.setStatus("active");
        return agentRepo.save(agent);
    }

    @PutMapping("/{id}/status")
    public Agent updateStatus(@PathVariable Long id, @RequestBody String status) {
        Agent agent = agentRepo.findById(id).orElseThrow();
        agent.setStatus(status);
        return agentRepo.save(agent);
    }
    @GetMapping("/{agentId}/profile")
    public AgentProfileDTO getAgentProfile(@PathVariable Long agentId) {
        Agent agent = agentRepository.findById(agentId).orElseThrow();

        // All users managed by this agent
        List<User> users = userRepository.findByAgent(agent);

        int policiesRegistered = users.size();

        int runningPolicies = 0;
        int completedPolicies = 0;
        for (User user : users) {
            Plan plan = user.getPlan();
            if (plan != null) {
                String status = plan.getStatus();
                if ("running".equalsIgnoreCase(status)) runningPolicies++;
                if ("completed".equalsIgnoreCase(status)) completedPolicies++;
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


}


