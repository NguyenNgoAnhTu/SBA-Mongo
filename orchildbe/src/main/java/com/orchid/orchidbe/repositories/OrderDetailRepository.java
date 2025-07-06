package com.orchid.orchidbe.repositories;

import com.orchid.orchidbe.pojos.OrderDetail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface OrderDetailRepository extends MongoRepository<OrderDetail, String> {
    List<OrderDetail> findByOrderId(String orderId);
    void deleteAllByOrder_Id(String orderId);
}
