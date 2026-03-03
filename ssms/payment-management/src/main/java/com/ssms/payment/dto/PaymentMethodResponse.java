package com.ssms.payment.dto;

import com.ssms.payment.entity.PaymentMethodType;

public class PaymentMethodResponse {

    private Long paymentMethodId;
    private String methodName;
    private PaymentMethodType type;
    private String description;
    private Boolean isActive;

    public PaymentMethodResponse() {}

    public PaymentMethodResponse(Long paymentMethodId, String methodName, PaymentMethodType type, 
                                 String description, Boolean isActive) {
        this.paymentMethodId = paymentMethodId;
        this.methodName = methodName;
        this.type = type;
        this.description = description;
        this.isActive = isActive;
    }

    // Getters and Setters
    public Long getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(Long paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

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
