package com.ssms.suppliermanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "suppliers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Supplier name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Contact is required")
    private String contact;

    @Email(message = "Invalid email format")
    private String email;

    private String address;

    @ElementCollection
    @CollectionTable(name = "supplier_products",
            joinColumns = @JoinColumn(name = "supplier_id"))
    @Column(name = "product_id")
    private List<Long> productIds;
}
