package com.insurai.backend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "plans")
public class Plan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private double monthlyPremium;
    private double coverageAmount;

    // Getters and Setters
}

