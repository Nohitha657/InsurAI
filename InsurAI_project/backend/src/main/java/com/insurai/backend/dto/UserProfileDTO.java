package com.insurai.backend.dto;

public class UserProfileDTO {
    public String fullName;
    public String email;
    public String agentName;
    public String planName;
    public String planDescription;
    public double planPremium;
    public double totalAmount;
    public double paidAmount;
    public double remainingAmount;

    public UserProfileDTO(
            String fullName, String email, String agentName,
            String planName, String planDescription, double planPremium,
            double totalAmount, double paidAmount, double remainingAmount
    ) {
        this.fullName = fullName;
        this.email = email;
        this.agentName = agentName;
        this.planName = planName;
        this.planDescription = planDescription;
        this.planPremium = planPremium;
        this.totalAmount = totalAmount;
        this.paidAmount = paidAmount;
        this.remainingAmount = remainingAmount;
    }
}

