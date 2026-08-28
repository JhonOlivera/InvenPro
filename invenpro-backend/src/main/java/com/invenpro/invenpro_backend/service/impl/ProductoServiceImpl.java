package com.invenpro.invenpro_backend.service.impl;

import com.invenpro.invenpro_backend.dto.ProductoDto;
import com.invenpro.invenpro_backend.exception.RecursoNoEncontradoException;
import com.invenpro.invenpro_backend.mapper.ProductoMapper;
import com.invenpro.invenpro_backend.model.entity.Categoria;
import com.invenpro.invenpro_backend.model.entity.Producto;
import com.invenpro.invenpro_backend.model.entity.Proveedor;
import com.invenpro.invenpro_backend.repository.CategoriaRepository;
import com.invenpro.invenpro_backend.repository.ProductoRepository;
import com.invenpro.invenpro_backend.repository.ProveedorRepository;
import com.invenpro.invenpro_backend.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProveedorRepository proveedorRepository;
    private final ProductoMapper productoMapper;

    @Override
    public List<ProductoDto> listarTodos() {
        return productoRepository.findAll()
                .stream()
                .map(productoMapper::toDto)
                .toList();
    }

    @Override
    public Page<ProductoDto> listarPaginado(Pageable pageable) {
        return productoRepository.findAll(pageable)
                .map(productoMapper::toDto);
    }

    @Override
    public ProductoDto buscarPorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado con id: " + id));
        return productoMapper.toDto(producto);
    }

    @Override
    public ProductoDto crear(ProductoDto productoDto) {
        Categoria categoria = categoriaRepository.findById(productoDto.getCategoriaId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoria no encontrada con id: " + productoDto.getCategoriaId()));
        Proveedor proveedor = proveedorRepository.findById(productoDto.getProveedorId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Proveedor no encontrado con id: " + productoDto.getProveedorId()));

        Producto producto = productoMapper.toEntity(productoDto, categoria, proveedor);
        producto.setId(null);
        Producto guardado = productoRepository.save(producto);
        return productoMapper.toDto(guardado);
    }

    @Override
    public ProductoDto actualizar(Long id, ProductoDto productoDto) {
        Producto existente = productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado con id: " + id));

        Categoria categoria = categoriaRepository.findById(productoDto.getCategoriaId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoria no encontrada con id: " + productoDto.getCategoriaId()));
        Proveedor proveedor = proveedorRepository.findById(productoDto.getProveedorId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Proveedor no encontrado con id: " + productoDto.getProveedorId()));

        existente.setNombre(productoDto.getNombre());
        existente.setDescripcion(productoDto.getDescripcion());
        existente.setPrecio(productoDto.getPrecio());
        existente.setStock(productoDto.getStock());
        existente.setStockMinimo(productoDto.getStockMinimo());
        existente.setCategoria(categoria);
        existente.setProveedor(proveedor);

        Producto actualizado = productoRepository.save(existente);
        return productoMapper.toDto(actualizado);
    }

    @Override
    public void eliminar(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Producto no encontrado con id: " + id);
        }
        productoRepository.deleteById(id);
    }

    @Override
    public List<ProductoDto> listarConStockBajo() {
        return productoRepository.findProductosConStockBajo()
                .stream()
                .map(productoMapper::toDto)
                .toList();
    }
}