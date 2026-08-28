package com.invenpro.invenpro_backend.service;
import com.invenpro.invenpro_backend.exception.ReglaDeNegocioException;
import com.invenpro.invenpro_backend.dto.CategoriaDto;
import com.invenpro.invenpro_backend.exception.RecursoNoEncontradoException;
import com.invenpro.invenpro_backend.mapper.CategoriaMapper;
import com.invenpro.invenpro_backend.model.entity.Categoria;
import com.invenpro.invenpro_backend.repository.CategoriaRepository;
import com.invenpro.invenpro_backend.repository.ProductoRepository;
import com.invenpro.invenpro_backend.service.impl.CategoriaServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceImplTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private CategoriaMapper categoriaMapper;

    @InjectMocks
    private CategoriaServiceImpl categoriaService;

    private Categoria categoria;
    private CategoriaDto categoriaDto;

    @BeforeEach
    void setUp() {
        categoria = Categoria.builder()
                .id(1L)
                .nombre("Electronica")
                .descripcion("Productos electronicos")
                .build();

        categoriaDto = CategoriaDto.builder()
                .id(1L)
                .nombre("Electronica")
                .descripcion("Productos electronicos")
                .build();
    }

    @Test
    void buscarPorId_cuandoExiste_deberiaRetornarCategoriaDto() {
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        when(categoriaMapper.toDto(categoria)).thenReturn(categoriaDto);

        CategoriaDto resultado = categoriaService.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals("Electronica", resultado.getNombre());
        verify(categoriaRepository, times(1)).findById(1L);
    }

    @Test
    void buscarPorId_cuandoNoExiste_deberiaLanzarExcepcion() {
        when(categoriaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class, () -> {
            categoriaService.buscarPorId(99L);
        });
    }

    @Test
    void eliminar_cuandoTieneProductosAsociados_deberiaLanzarExcepcion() {
        when(categoriaRepository.existsById(1L)).thenReturn(true);
        when(productoRepository.existsByCategoriaId(1L)).thenReturn(true);

        assertThrows(ReglaDeNegocioException.class, () -> {
            categoriaService.eliminar(1L);
        });

        verify(categoriaRepository, never()).deleteById(any());
    }

    @Test
    void eliminar_cuandoNoTieneProductosAsociados_deberiaEliminarCorrectamente() {
        when(categoriaRepository.existsById(1L)).thenReturn(true);
        when(productoRepository.existsByCategoriaId(1L)).thenReturn(false);

        categoriaService.eliminar(1L);

        verify(categoriaRepository, times(1)).deleteById(1L);
    }
}