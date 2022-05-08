package com.example.webpos.db;

import com.example.webpos.model.Item;
import com.example.webpos.model.Product;

import java.util.List;

public interface PosDB {

    Product getProduct(String productId);

    List<Product> getProducts();
}
