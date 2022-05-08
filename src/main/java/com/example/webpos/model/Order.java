package com.example.webpos.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

// just for display
@Data
@NoArgsConstructor
public class Order implements Serializable {

    private String id = UUID.randomUUID().toString();

    private double tax = 0.12;

    private double discount = 0.20;

    private double subTotal = 0.0;

    private double total = 0.0;

    public Order(List<Item> items) {
        // assume an unchangeable tax and discount for convenience
        for (Item item : items) {
            subTotal += item.getProduct().getPrice() * item.getQuantity();
        }
        // may not right
        double taxFee = subTotal * tax;
        total = subTotal * (1 - discount) + taxFee;
    }
}
