package com.Demiexample.DemiProjectWW.service;

import com.Demiexample.DemiProjectWW.dto.request.ChatMessage;
import com.Demiexample.DemiProjectWW.dto.request.ChatRequest;
import com.Demiexample.DemiProjectWW.dto.response.ChatResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ChatService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    // Groq API URL
    private static final String GROQ_API_URL =
            "https://api.groq.com/openai/v1/chat/completions";

    // Free Groq model
    private static final String MODEL = "llama-3.1-8b-instant";

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

            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Authorization: Bearer <API_KEY>
            headers.setBearerAuth(groqApiKey);

            // Messages list
            List<Map<String, String>> messages = new ArrayList<>();

            // System prompt first
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", SYSTEM_PROMPT);

            messages.add(systemMessage);

            // Conversation history
            for (ChatMessage msg : chatRequest.getMessages()) {

                Map<String, String> message = new HashMap<>();

                message.put("role", msg.getRole());
                message.put("content", msg.getMessage());

                messages.add(message);
            }

            // Request body
            Map<String, Object> requestBody = new HashMap<>();

            requestBody.put("model", MODEL);
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", 1024);
            requestBody.put("temperature", 0.7);

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(requestBody, headers);

            // API call
            ResponseEntity<Map> response = restTemplate.exchange(
                    GROQ_API_URL,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            // Extract response
            Map responseBody = response.getBody();

            if (responseBody != null &&
                    responseBody.containsKey("choices")) {

                List<Map<String, Object>> choices =
                        (List<Map<String, Object>>) responseBody.get("choices");

                if (!choices.isEmpty()) {

                    Map<String, Object> choice = choices.get(0);

                    Map<String, String> messageObj =
                            (Map<String, String>) choice.get("message");

                    String replyText = messageObj.get("content");

                    return new ChatResponse(replyText, true);
                }
            }

            return new ChatResponse(
                    "Sorry, I couldn't process your request. Please try again.",
                    false
            );

        } catch (Exception e) {

            e.printStackTrace();

            return new ChatResponse(
                    "WealthWise Assistant is temporarily unavailable. Please try again later.",
                    false
            );
        }
    }
}
