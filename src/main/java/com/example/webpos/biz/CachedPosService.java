package com.example.webpos.biz;

import com.example.webpos.db.PosDB;
import com.example.webpos.model.Cart;
import com.example.webpos.model.Item;
import com.example.webpos.model.Order;
import com.example.webpos.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
public class CachedPosService implements PosService {

    @Autowired
    private PosDB posDB;

    @Autowired
    private Cart cart;

    @Override
    @Cacheable("products")
    public List<Product> products() {
        return posDB.getProducts();
    }

    @Override
    public List<Item> cartItems() {
        List<Item> items = cart.getItems();
        items.sort(Comparator.comparing(Item::getTimestamp));
        return items;
    }

    @Override
    public Order checkout() {
        return getOrder();
    }

    @Override
    public Order getOrder() {
        return new Order(cartItems());
    }

    @Override
    public boolean add(String productId, int quantity) {
        return cart.addProduct(posDB.getProduct(productId), quantity);
    }

    @Override
    public boolean remove(String productId) {
        return cart.removeProduct(productId);
    }

    @Override
    public boolean empty() {
        return cart.removeAll();
    }
}
