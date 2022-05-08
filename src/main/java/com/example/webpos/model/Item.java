package com.example.webpos.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class Item implements Serializable {

    private Product product;

    private int quantity;

    private Long timestamp;

}
