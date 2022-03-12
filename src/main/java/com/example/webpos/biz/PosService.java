package com.example.webpos.biz;

import com.example.webpos.model.Item;
import com.example.webpos.model.Order;
import com.example.webpos.model.Product;

import java.util.List;

public interface PosService {

    public List<Item> getCart();

    public List<Product> products();

    public boolean add(String productId, int amount);

    public boolean remove(String productId);

    public boolean empty();

    public Order checkout();

    public Order getOrder();

}
