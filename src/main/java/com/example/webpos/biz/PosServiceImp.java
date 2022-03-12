package com.example.webpos.biz;

import com.example.webpos.db.PosDB;
import com.example.webpos.model.Item;
import com.example.webpos.model.Order;
import com.example.webpos.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PosServiceImp implements PosService {

    private PosDB posDB;

    @Autowired
    public void setPosDB(PosDB posDB) {
        this.posDB = posDB;
    }

    @Override
    public List<Item> getCart() {
        return posDB.getCart();
    }

    @Override
    public Order checkout() {
        return getOrder();
    }

    @Override
    public Order getOrder() {
        return new Order(posDB.getCart());
    }

    @Override
    public boolean add(String productId, int amount) {
        return posDB.addItem(productId, amount);
    }

    @Override
    public boolean remove(String productId) {
        return posDB.removeItem(productId);
    }

    @Override
    public boolean empty() {
        return posDB.emptyCart();
    }

    @Override
    public List<Product> products() {
        return posDB.getProducts();
    }

}
