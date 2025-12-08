package com.insurai.backend.controllers;

import com.insurai.backend.entities.Agent;
import com.insurai.backend.entities.Message;
import com.insurai.backend.entities.User;
import com.insurai.backend.repositories.AgentRepository;
import com.insurai.backend.repositories.MessageRepository;
import com.insurai.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RestController
@RequestMapping("/api/messages")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowedHeaders = "*",
        methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.OPTIONS }
)
public class MessageController {
    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    // USER sends message to AGENT

    @PostMapping("/contact")
    public ResponseEntity<?> contactAgent(@RequestBody Map<String, String> body) {
        String agentEmail = body.get("agentEmail");
        String messageText = body.get("message");
        String userEmail = body.get("userEmail");

        System.out.println("CONTACT BODY = " + body);
        Agent agent = agentRepository.findByEmail(agentEmail).orElse(null);
        System.out.println("FOUND AGENT = " + (agent != null ? agent.getEmail() : "null"));

        User user = userRepository.findByEmail(userEmail).orElse(null);
        System.out.println("FOUND USER = " + (user != null ? user.getEmail() : "null"));

        Message msg = Message.builder()
                .agent(agent)
                .user(user)
                .senderEmail(userEmail)
                .content(messageText)
                .createdAt(java.time.LocalDateTime.now())
                .readFlag(false)
                .build();

        System.out.println("SAVING MESSAGE: " + msg.getContent());
        messageRepository.save(msg);
        System.out.println("SAVED MESSAGE ID: " + msg.getId());

        return ResponseEntity.ok(Map.of("success", true));
    }



    // AGENT gets notifications (messages)
    @GetMapping("/me/messages")
    public ResponseEntity<?> getMyMessages(@RequestParam String email) {
        Agent agent = agentRepository.findByEmail(email)
                .orElse(null);
        if (agent == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Agent not found"));
        }

        var list = messageRepository.findByAgentOrderByCreatedAtDesc(agent);

        // minimal DTO to avoid infinite recursion
        var dtoList = list.stream().map(m -> Map.of(
                "id", m.getId(),
                "from", m.getSenderEmail(),
                "fromName", m.getUser() != null ? m.getUser().getFullName() : "",
                "phone", m.getUser() != null ? m.getUser().getPhone() : null,
                "content", m.getContent(),
                "createdAt", m.getCreatedAt(),
                "read", m.isReadFlag()
        )).toList();

        return ResponseEntity.ok(dtoList);

    }
    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Message msg = messageRepository.findById(id).orElse(null);
        if (msg == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Message not found"));
        }
        if (!msg.isReadFlag()) {
            msg.setReadFlag(true);
            messageRepository.save(msg);
        }
        return ResponseEntity.ok(Map.of("success", true));
    }

}
