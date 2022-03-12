package com.example.webpos.db;

import com.example.webpos.model.Item;
import com.example.webpos.model.Product;

import java.util.List;

public interface PosDB {

    public List<Product> getProducts();

    public boolean addItem(String productId, int amount);

    public boolean removeItem(String productId);

    public List<Item> getCart();

    public boolean emptyCart();

    public Product getProduct(String productId);

}
