package com.wealthwise.notifications.notification;

public class BroadcastRequest {

    private String message;
    private String type;

    public String getMessage() { return message; }
    public void setMessage(String message) { 
        this.message = message; 
    }

    public String getType() { return type; }
    public void setType(String type) { 
        this.type = type; 
    }
}