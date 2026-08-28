package com.invenpro.invenpro_backend.mapper;

import com.invenpro.invenpro_backend.dto.ProductoDto;
import com.invenpro.invenpro_backend.model.entity.Categoria;
import com.invenpro.invenpro_backend.model.entity.Producto;
import com.invenpro.invenpro_backend.model.entity.Proveedor;
import org.springframework.stereotype.Component;

@Component
public class ProductoMapper {

    public ProductoDto toDto(Producto producto) {
        if (producto == null) {
            return null;
        }
        return ProductoDto.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .precio(producto.getPrecio())
                .stock(producto.getStock())
                .stockMinimo(producto.getStockMinimo())
                .categoriaId(producto.getCategoria() != null ? producto.getCategoria().getId() : null)
                .categoriaNombre(producto.getCategoria() != null ? producto.getCategoria().getNombre() : null)
                .proveedorId(producto.getProveedor() != null ? producto.getProveedor().getId() : null)
                .proveedorNombre(producto.getProveedor() != null ? producto.getProveedor().getNombre() : null)
                .build();
    }

    public Producto toEntity(ProductoDto dto, Categoria categoria, Proveedor proveedor) {
        if (dto == null) {
            return null;
        }
        return Producto.builder()
                .id(dto.getId())
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .precio(dto.getPrecio())
                .stock(dto.getStock())
                .stockMinimo(dto.getStockMinimo())
                .categoria(categoria)
                .proveedor(proveedor)
                .build();
    }
}