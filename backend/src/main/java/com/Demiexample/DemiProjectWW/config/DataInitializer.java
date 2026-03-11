package com.Demiexample.DemiProjectWW.config;

import com.Demiexample.DemiProjectWW.entity.User;
import com.Demiexample.DemiProjectWW.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initUsers() {
        return args -> {

            if(userRepository.count() == 0){

                User user1 = new User();
                user1.setUsername("shiv");
                user1.setEmail("shiv@gmail.com");
                user1.setPassword(passwordEncoder.encode("123"));

                User user2 = new User();
                user2.setUsername("nikhil");
                user2.setEmail("nik@gmail.com");
                user2.setPassword(passwordEncoder.encode("123"));

                userRepository.save(user1);
                userRepository.save(user2);
            }
        };
    }
}
