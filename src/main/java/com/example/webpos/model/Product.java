package com.example.webpos.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class Product implements Serializable {

    private String id;

    private String name;

    private double price;

    private String image;

    // just for fun
    private String url;
}
