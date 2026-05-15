
package com.Demiexample.DemiProjectWW.controller;

import com.Demiexample.DemiProjectWW.dto.request.ChatRequest;
import com.Demiexample.DemiProjectWW.dto.response.ChatResponse;
import com.Demiexample.DemiProjectWW.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest chatRequest) {
        ChatResponse response = chatService.processChat(chatRequest);
        return ResponseEntity.ok(response);
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("WealthWise Chat Service is running!");
    }
}