package com.insurai.backend.dto;

public class AgentProfileDTO {
    private String name;
    private String email;
    private int policiesRegistered;
    private int runningPolicies;
    private int completedPolicies;

    // Constructor
    public AgentProfileDTO(String name, String email, int policiesRegistered, int runningPolicies, int completedPolicies) {
        this.name = name;
        this.email = email;
        this.policiesRegistered = policiesRegistered;
        this.runningPolicies = runningPolicies;
        this.completedPolicies = completedPolicies;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public int getPoliciesRegistered() { return policiesRegistered; }
    public void setPoliciesRegistered(int policiesRegistered) { this.policiesRegistered = policiesRegistered; }
    public int getRunningPolicies() { return runningPolicies; }
    public void setRunningPolicies(int runningPolicies) { this.runningPolicies = runningPolicies; }
    public int getCompletedPolicies() { return completedPolicies; }
    public void setCompletedPolicies(int completedPolicies) { this.completedPolicies = completedPolicies; }
}

