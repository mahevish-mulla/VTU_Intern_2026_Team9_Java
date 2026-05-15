package com.Demiexample.DemiProjectWW.service;

import com.Demiexample.DemiProjectWW.dto.request.ChatMessage;
import com.Demiexample.DemiProjectWW.dto.request.ChatRequest;
import com.Demiexample.DemiProjectWW.dto.response.ChatResponse;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ChatService {

    // Ollama runs locally - no API key needed!
    private static final String OLLAMA_URL = "http://localhost:11434/api/chat";
    private static final String MODEL = "llama3.2:1b"; // Your installed model

    // WealthWise system prompt
    private static final String SYSTEM_PROMPT =
        "You are WealthWise Assistant, a helpful and friendly financial support chatbot for the WealthWise platform. " +
        "You help users with questions about: " +
        "- Investment portfolio management and tracking " +
        "- Mutual funds and AMC (Asset Management Companies) " +
        "- Financial goals setting and tracking " +
        "- Account and profile related queries " +
        "- General financial advice and education " +
        "- SIP (Systematic Investment Plan) and NAV (Net Asset Value) concepts " +
        "Be concise, professional, and always encourage users to make informed financial decisions. " +
        "If asked about something unrelated to finance or WealthWise, politely redirect the conversation. " +
        "Never provide specific stock tips or guaranteed return promises.";

    private final RestTemplate restTemplate;

    public ChatService() {
        this.restTemplate = new RestTemplate();
    }

    public ChatResponse processChat(ChatRequest chatRequest) {
        try {
            // Build headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Build messages for Ollama
            // Ollama uses same format as OpenAI: role + content
            List<Map<String, String>> messages = new ArrayList<>();

            // Add system message first
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", SYSTEM_PROMPT);
            messages.add(systemMessage);

            // Add conversation history
            for (ChatMessage msg : chatRequest.getMessages()) {
                Map<String, String> message = new HashMap<>();
                message.put("role", msg.getRole());
                message.put("content", msg.getMessage());
                messages.add(message);
            }

            // Build Ollama request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", MODEL);
            requestBody.put("messages", messages);
            requestBody.put("stream", false); // Important: false = wait for full response

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Call Ollama API
            ResponseEntity<Map> response = restTemplate.exchange(
                OLLAMA_URL,
                HttpMethod.POST,
                entity,
                Map.class
            );

            // Extract response
            Map responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("message")) {
                Map<String, String> messageObj = (Map<String, String>) responseBody.get("message");
                String replyText = messageObj.get("content");
                return new ChatResponse(replyText, true);
            }

            return new ChatResponse("Sorry, I couldn't process your request. Please try again.", false);

        } catch (Exception e) {
            // Ollama might not be running
            return new ChatResponse(
                "WealthWise Assistant is temporarily unavailable. " +
                "Please make sure Ollama is running on your machine.", false
            );
        }
    }
}