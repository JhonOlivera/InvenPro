package com.invenpro.invenpro_backend.repository;

import com.invenpro.invenpro_backend.model.entity.MovimientoInventario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {

    List<MovimientoInventario> findByProductoIdOrderByFechaDesc(Long productoId);
}