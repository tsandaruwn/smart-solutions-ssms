package com.ssms.payment.dto;

import com.ssms.payment.entity.PaymentMethodType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PaymentMethodRequest {

    @NotBlank(message = "Method name is required")
    private String methodName;

    @NotNull(message = "Type is required")
    private PaymentMethodType type;

    private String description;

    private Boolean isActive;

    // Getters and Setters
    public String getMethodName() {
        return methodName;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }

    public PaymentMethodType getType() {
        return type;
    }

    public void setType(PaymentMethodType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
