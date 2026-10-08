package com.invenpro.invenpro_backend.config;

import com.invenpro.invenpro_backend.model.entity.Categoria;
import com.invenpro.invenpro_backend.model.entity.Producto;
import com.invenpro.invenpro_backend.model.entity.Proveedor;
import com.invenpro.invenpro_backend.model.entity.Usuario;
import com.invenpro.invenpro_backend.repository.CategoriaRepository;
import com.invenpro.invenpro_backend.repository.ProductoRepository;
import com.invenpro.invenpro_backend.repository.ProveedorRepository;
import com.invenpro.invenpro_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    // Marcador para no reinsertar el catálogo de ejemplo en cada reinicio.
    private static final String CODIGO_MARCADOR = "SKU-0001";

    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProveedorRepository proveedorRepository;
    private final ProductoRepository productoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        crearAdminSiNoExiste();
        crearProductosDeEjemploSiNoExisten();
    }

    private void crearAdminSiNoExiste() {
        if (usuarioRepository.findByEmail("admin@invenpro.com").isEmpty()) {
            Usuario admin = Usuario.builder()
                    .nombre("Administrador")
                    .email("admin@invenpro.com")
                    .password(passwordEncoder.encode("admin123"))
                    .rol(Usuario.Rol.ADMIN)
                    .build();

            usuarioRepository.save(admin);
            System.out.println(">>> Usuario ADMIN creado: admin@invenpro.com / admin123");
        }
    }

    private void crearProductosDeEjemploSiNoExisten() {
        if (productoRepository.existsByCodigo(CODIGO_MARCADOR)) {
            return;
        }

        Categoria electronica = obtenerOCrearCategoria("Electrónica", "Dispositivos y accesorios electrónicos");
        Categoria oficina = obtenerOCrearCategoria("Oficina", "Muebles y artículos de oficina");
        Categoria hogar = obtenerOCrearCategoria("Hogar", "Artículos para el hogar");
        Categoria deportes = obtenerOCrearCategoria("Deportes", "Implementos deportivos");
        Categoria jugueteria = obtenerOCrearCategoria("Juguetería", "Juguetes y juegos");

        Proveedor andino = obtenerOCrearProveedor("Proveedor Andino S.A.S.", "3011234567", "contacto@andino.com");
        Proveedor norte = obtenerOCrearProveedor("Distribuciones Norte", "3017654321", "ventas@distribucionesnorte.com");
        Proveedor tecnoimport = obtenerOCrearProveedor("TecnoImport Ltda.", "3025551234", "info@tecnoimport.com");
        Proveedor centrales = obtenerOCrearProveedor("Suministros Centrales", "3034449876", "contacto@suministroscentrales.com");

        List<Producto> productos = List.of(
                nuevoProducto("SKU-0001", "Laptop 14\" i5", "Laptop para oficina, 8GB RAM, 256GB SSD", 2800000.0, 12, 3, electronica, andino),
                nuevoProducto("SKU-0002", "Mouse inalámbrico", "Mouse óptico con receptor USB", 45000.0, 40, 10, electronica, andino),
                nuevoProducto("SKU-0003", "Teclado mecánico", "Teclado mecánico retroiluminado", 180000.0, 8, 5, electronica, tecnoimport),
                nuevoProducto("SKU-0004", "Monitor 24\" Full HD", "Monitor LED 24 pulgadas, 1920x1080", 650000.0, 3, 4, electronica, tecnoimport),
                nuevoProducto("SKU-0005", "Audífonos Bluetooth", "Audífonos over-ear con cancelación de ruido", 95000.0, 0, 5, electronica, andino),
                nuevoProducto("SKU-0006", "Cargador USB-C 65W", "Cargador rápido para laptop y celular", 60000.0, 25, 8, electronica, tecnoimport),
                nuevoProducto("SKU-0007", "Silla ergonómica", "Silla de oficina con soporte lumbar", 420000.0, 6, 2, oficina, centrales),
                nuevoProducto("SKU-0008", "Escritorio en L", "Escritorio en L con bandeja para teclado", 780000.0, 2, 2, oficina, centrales),
                nuevoProducto("SKU-0009", "Lámpara de escritorio LED", "Lámpara regulable con puerto USB", 55000.0, 18, 5, oficina, tecnoimport),
                nuevoProducto("SKU-0010", "Organizador de cables", "Canaleta organizadora para escritorio", 15000.0, 0, 10, oficina, tecnoimport),
                nuevoProducto("SKU-0011", "Resma de papel carta", "Papel carta 75g, 500 hojas", 18000.0, 50, 15, oficina, centrales),
                nuevoProducto("SKU-0012", "Set de ollas antiadherentes", "Juego de 5 ollas antiadherentes", 320000.0, 9, 3, hogar, norte),
                nuevoProducto("SKU-0013", "Licuadora 600W", "Licuadora de vaso de vidrio, 3 velocidades", 210000.0, 4, 4, hogar, norte),
                nuevoProducto("SKU-0014", "Aspiradora vertical", "Aspiradora sin cable, batería recargable", 540000.0, 5, 2, hogar, andino),
                nuevoProducto("SKU-0015", "Juego de toallas", "Set de 4 toallas de algodón", 68000.0, 22, 6, hogar, tecnoimport),
                nuevoProducto("SKU-0016", "Balón de fútbol", "Balón de fútbol talla 5", 85000.0, 30, 10, deportes, centrales),
                nuevoProducto("SKU-0017", "Mancuernas 5kg (par)", "Par de mancuernas de hierro fundido", 95000.0, 1, 4, deportes, andino),
                nuevoProducto("SKU-0018", "Bicicleta estática", "Bicicleta estática con monitor de ritmo", 980000.0, 0, 2, deportes, norte),
                nuevoProducto("SKU-0019", "Rompecabezas 1000 piezas", "Rompecabezas de paisaje, 1000 piezas", 42000.0, 15, 5, jugueteria, tecnoimport),
                nuevoProducto("SKU-0020", "Set de bloques de construcción", "Bloques de construcción compatibles, 200 piezas", 76000.0, 7, 3, jugueteria, centrales)
        );

        productoRepository.saveAll(productos);
        System.out.println(">>> " + productos.size() + " productos de ejemplo creados");
    }

    private Categoria obtenerOCrearCategoria(String nombre, String descripcion) {
        return categoriaRepository.findAll().stream()
                .filter(c -> c.getNombre().equalsIgnoreCase(nombre))
                .findFirst()
                .orElseGet(() -> categoriaRepository.save(
                        Categoria.builder().nombre(nombre).descripcion(descripcion).build()
                ));
    }

    private Proveedor obtenerOCrearProveedor(String nombre, String telefono, String email) {
        return proveedorRepository.findAll().stream()
                .filter(p -> p.getNombre().equalsIgnoreCase(nombre))
                .findFirst()
                .orElseGet(() -> proveedorRepository.save(
                        Proveedor.builder().nombre(nombre).telefono(telefono).email(email).build()
                ));
    }

    private Producto nuevoProducto(String codigo, String nombre, String descripcion, Double precio,
                                    int stock, int stockMinimo, Categoria categoria, Proveedor proveedor) {
        return Producto.builder()
                .codigo(codigo)
                .nombre(nombre)
                .descripcion(descripcion)
                .precio(precio)
                .stock(stock)
                .stockMinimo(stockMinimo)
                .categoria(categoria)
                .proveedor(proveedor)
                .imagenUrl(null)
                .build();
    }
}
