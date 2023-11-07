import express from "express";
import mysql from "mysql";
import cors from 'cors';

const app = express();
app.use(
  express.json(),
  cors()
);

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quesos'
});

conexion.connect(function (error) {
  if (error) {
    console.log("Error al conectar");
  } else {
    console.log("Conexion realizada exitosamente");
  }
});

app.get('/obtenerRecetas', (peticion, respuesta) => {
  const sql = "SELECT * FROM recetas";
  conexion.query(sql, (error, resultado) => {
    if (error) return respuesta.json({ error: "Error en la consulta" });
    return respuesta.json({ recetas: resultado });
  });
});

app.get('/obtenerReceta/:id', (peticion, respuesta) => {
  const recetaId = peticion.params.id;
  const sql = `SELECT * FROM recetas WHERE id = ${recetaId}`;
  conexion.query(sql, (error, resultado) => {
    if (error) return respuesta.json({ error: "Error en la consulta" });
    if (resultado.length === 0) {
      return respuesta.json({ error: "Receta no encontrada" });
    }
    return respuesta.json({ receta: resultado[0] });
  });
});

app.put('/actualizarReceta/:id', (peticion, respuesta) => {
  const recetaId = peticion.params.id;
  const { ingredientes, preparacion } = peticion.body;
  const sql = `UPDATE recetas SET ingredientes = ?, preparacion = ? WHERE id = ?`;
  conexion.query(sql, [ingredientes, preparacion, recetaId], (error, resultado) => {
    if (error) return respuesta.json({ error: "Error al actualizar la receta" });
    return respuesta.json({ mensaje: "Receta actualizada con éxito" });
  });
});

app.post('/agregarReceta', (req, res) => {
    const { nombre, descripcion, ingredientes } = req.body;
    const sql = 'INSERT INTO recetas (nombre_queso, nombre_receta, ingredientes, preparacion) VALUES (?, ?, ?, ?)';
    conexion.query(sql, [nombre, descripcion, ingredientes], (error, resultado) => {
      if (error) {
        return res.json({ error: 'Error al agregar la receta' });
      }
      return res.json({ mensaje: 'Receta agregada exitosamente' });
    });
  });
  
app.get('/obtenerInventario', (peticion, respuesta) => {
  const sql = "SELECT * FROM inventario";
  conexion.query(sql, (error, resultado) => {
    if (error) return respuesta.json({ error: "Error en la consulta del inventario" });
    return respuesta.json({ inventario: resultado });
  });
});

app.put('/actualizarInventario/:id', (peticion, respuesta) => {
  const inventarioId = peticion.params.id;
  const { ingredientes, stockMinimo, cantidadActual, calidad, fechaCaducidad } = peticion.body;
  const sql = `UPDATE inventario SET ingredientes = ?, stock_minimo = ?, cantidad_actual = ?, calidad = ?, fecha_caducidad = ?  WHERE id = ?`;
  conexion.query(sql, [ingredientes, stockMinimo, cantidadActual, calidad, fechaCaducidad, inventarioId], (error, resultado) => {
    if (error) return respuesta.json({ error: "Error al actualizar el inventario" });
    return respuesta.json({ mensaje: "Inventario actualizado con éxito" });
  });
});

app.get('/obtenerLotes', (peticion, respuesta) => {
  const sql = "SELECT * FROM lotes";
  conexion.query(sql, (error, resultado) => {
    if (error) return respuesta.json({ error: "Error en la consulta" });
    return respuesta.json({ lotes: resultado });
  });
});


app.listen(8082, () => {
  console.log("Servidor iniciado...");
});