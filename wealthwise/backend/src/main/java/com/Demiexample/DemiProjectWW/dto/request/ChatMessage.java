package com.Demiexample.DemiProjectWW.dto.request;

public class ChatMessage {

    private String message;
    private String role; // "user" or "assistant"

    public ChatMessage() {}

    public ChatMessage(String message, String role) {
        this.message = message;
        this.role = role;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}