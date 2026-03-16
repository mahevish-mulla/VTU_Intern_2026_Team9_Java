package com.Demiexample.DemiProjectWW.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

    @Controller
    public class HomeController {

        @GetMapping("/home")
        public String home() {
            return "home";
        }

        @GetMapping("/home/sip")
        public String sip() {
            return "sip";
        }

        @GetMapping("/home/mutualfunds")
        public String mutualFunds() {
            return "mutualfunds";
        }

        @GetMapping("/home/userprofile")
        public String userProfilePage() {
            return "userprofile";
        }


    }
