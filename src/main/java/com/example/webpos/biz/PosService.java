package com.example.webpos.biz;

import com.example.webpos.model.Item;
import com.example.webpos.model.Order;
import com.example.webpos.model.Product;
import org.apache.tomcat.util.http.parser.HttpParser;

import java.net.http.HttpRequest;
import java.util.List;

public interface PosService {

    List<Product> products();

    List<Item> cartItems();

    boolean add(String productId, int quantity);

    boolean remove(String productId);

    boolean empty();

    Order checkout();

    Order getOrder();
}
