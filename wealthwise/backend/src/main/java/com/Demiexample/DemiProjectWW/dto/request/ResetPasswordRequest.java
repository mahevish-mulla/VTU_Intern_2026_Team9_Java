package com.Demiexample.DemiProjectWW.dto.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String newPassword;
}