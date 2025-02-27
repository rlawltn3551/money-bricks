package com.moneybricks.mall.repository;

import com.moneybricks.mall.domain.Mall;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MallRepository extends JpaRepository<Mall, Long> {
}
