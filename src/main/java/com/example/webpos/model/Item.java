package com.example.webpos.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Item {

    private Product product;

    private int quantity;

    private Long timestamp;

}
