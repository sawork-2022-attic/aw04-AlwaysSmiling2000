package com.example.webpos.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Product {

    private String id;

    private String name;

    private double price;

    private String image;

    // just for fun
    private String url;

}
