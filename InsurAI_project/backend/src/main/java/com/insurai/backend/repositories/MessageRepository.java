
package com.insurai.backend.repositories;

import com.insurai.backend.entities.Agent;
import com.insurai.backend.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByAgentOrderByCreatedAtDesc(Agent agent);
}
