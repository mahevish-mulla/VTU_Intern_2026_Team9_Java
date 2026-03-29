// File: VTU_Intern_2026_Team9_Java/wealthwise/backend/src/main/java/com/Demiexample/DemiProjectWW/config/AppConfig.java
package com.Demiexample.DemiProjectWW.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}