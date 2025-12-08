package com.insurai.backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private Agent agent;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private Plan plan;

    private Double totalAmount;    // overall plan amount
    private Double monthlyAmount;  // monthly premium for this user
    private Double paidAmount;     // how much user already paid

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @Column(nullable = true, unique = true)
    private Long phone;

    @Column(nullable = true)
    private String address;
}
