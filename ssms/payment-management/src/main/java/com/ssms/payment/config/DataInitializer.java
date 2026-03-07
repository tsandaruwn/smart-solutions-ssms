package com.ssms.payment.config;

import com.ssms.payment.entity.PaymentMethod;
import com.ssms.payment.entity.PaymentMethodType;
import com.ssms.payment.repository.PaymentMethodRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initPaymentMethods(PaymentMethodRepository paymentMethodRepository) {
        return args -> {
            
            if (paymentMethodRepository.count() == 0) {
                
                PaymentMethod creditCard = new PaymentMethod(
                        "Credit Card",
                        PaymentMethodType.Card,
                        "Payment via credit card (Visa, MasterCard, etc.)",
                        true
                );
                paymentMethodRepository.save(creditCard);

                PaymentMethod debitCard = new PaymentMethod(
                        "Debit Card",
                        PaymentMethodType.Card,
                        "Payment via debit card",
                        true
                );
                paymentMethodRepository.save(debitCard);

                PaymentMethod bankTransfer = new PaymentMethod(
                        "Bank Transfer",
                        PaymentMethodType.Bank_Transfer,
                        "Direct bank transfer / Wire transfer",
                        true
                );
                paymentMethodRepository.save(bankTransfer);

                PaymentMethod mobileWallet = new PaymentMethod(
                        "Mobile Wallet",
                        PaymentMethodType.Mobile_Wallet,
                        "Payment via mobile wallet apps",
                        true
                );
                paymentMethodRepository.save(mobileWallet);

                PaymentMethod cash = new PaymentMethod(
                        "Cash",
                        PaymentMethodType.Cash,
                        "Cash on delivery or in-person payment",
                        true
                );
                paymentMethodRepository.save(cash);

                PaymentMethod onlineBanking = new PaymentMethod(
                        "Online Banking",
                        PaymentMethodType.Online_Banking,
                        "Payment via online banking portal",
                        true
                );
                paymentMethodRepository.save(onlineBanking);

                System.out.println("✅ Default payment methods initialized successfully!");
            }
        };
    }
}
