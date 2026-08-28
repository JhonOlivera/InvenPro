package com.invenpro.invenpro_backend.repository;

import com.invenpro.invenpro_backend.model.entity.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    @Query("SELECT p FROM Producto p WHERE p.stock <= p.stockMinimo")
    List<Producto> findProductosConStockBajo();

    boolean existsByCategoriaId(Long categoriaId);

    boolean existsByProveedorId(Long proveedorId);

    Page<Producto> findAll(Pageable pageable);
}