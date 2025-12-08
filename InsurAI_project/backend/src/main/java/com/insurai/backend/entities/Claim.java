package com.insurai.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Claim {
//    @ManyToOne
//    @JoinColumn(name = "user_id")   // column in claim table
//    private User user;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String name;
    private Integer age;
    private String cityOrVillage;
    private String gender;
    private String policyName;
    private String agentName;
    private LocalDateTime claimDate;
    private String status;
    private java.time.LocalDate approvedDate;
    // in Claim.java
    private boolean requestSent;
    private boolean completed;

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    // fields
                 // e.g. "PENDING", "REQUESTED", "APPROVED"


    // getters/setters
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getApprovedDate() { return approvedDate; }
    public void setApprovedDate(LocalDate approvedDate) { this.approvedDate = approvedDate; }


    // getter/setter
    public boolean isRequestSent() { return requestSent; }
    public void setRequestSent(boolean requestSent) { this.requestSent = requestSent; }

}
