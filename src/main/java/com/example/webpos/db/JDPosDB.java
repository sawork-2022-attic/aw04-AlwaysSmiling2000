package com.example.webpos.db;

import com.example.webpos.model.Product;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URL;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class JDPosDB implements PosDB {

    private volatile List<Product> products;

    @Override
    public Product getProduct(String productId) {
        for (Product p : getProducts()) {
            if (p.getId().equals(productId)) {
                return p;
            }
        }
        return null;
    }

    @Override
    public List<Product> getProducts() {
        if (products == null) {
            synchronized (this) {
                if (products == null) {
                    try {
                        products = parseJD();
                        products = products.stream().filter(product -> !product.getId().isBlank()).collect(Collectors.toList());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return products;
    }

    private List<Product> parseJD() throws IOException {
        //获取请求https://search.jd.com/Search?keyword=java
        String url = "https://search.jd.com/Search?keyword=" + "java";
        //解析网页
        Document document = Jsoup.parse(new URL(url), 10000);
        //所有js的方法都能用
        Element element = document.getElementById("J_goodsList");
        //获取所有li标签
        Elements elements = element.getElementsByTag("li");
        List<Product> list = new ArrayList<>();
        //获取元素的内容
        for (Element el : elements) {
            //关于图片特别多的网站，所有图片都是延迟加载的
            String id = el.attr("data-spu");
            String img = "https:".concat(el.getElementsByTag("img").eq(0).attr("data-lazy-img"));
            String price = el.getElementsByAttribute("data-price").text();
            String title = el.getElementsByClass("p-name").eq(0).text();
            String link = el.getElementsByTag("a").attr("href");
            if (title.contains("，")){
                title = title.substring(0, title.indexOf("，"));
            }
            Product product = new Product(id, title, Double.parseDouble(price), img, link);
            list.add(product);
        }
        return list;
    }
}
