const CONFIG_CAMPOS = {
  "Fecha":                 { mostrar: true,  nuevoNombre: "Fecha" },
  "Fecha valuta":          { mostrar: false, nuevoNombre: null },
  "Descripción operación": { mostrar: true,  nuevoNombre: null },
  "Monto":                 { mostrar: true,  nuevoNombre: null },
  "Sucursal - agencia":    { mostrar: false, nuevoNombre: null },
  "Operación - Número":    { mostrar: false, nuevoNombre: null },
  "Usuario":               { mostrar: false, nuevoNombre: null },
  "Saldo":                 { mostrar: true,  nuevoNombre: null },
  "Referencia2":           { mostrar: false, nuevoNombre: null }, // Corregido aquí
  "PK":                    { mostrar: false, nuevoNombre: null },
  "PERIODO":               { mostrar: true,  nuevoNombre: null },
  "Type1":                 { mostrar: true,  nuevoNombre: "Partida" },
  "Type2":                 { mostrar: true,  nuevoNombre: "subPartida" },
  "Type3":                 { mostrar: false, nuevoNombre: null },
  "Detalle":               { mostrar: true,  nuevoNombre: null },
  "Link":                  { mostrar: true,  nuevoNombre: null }
};

const formatearFecha = (valor) => {
  if (!valor) return "";
  const stringFecha = String(valor).trim();

  if (stringFecha.includes("/")) {
    return stringFecha; 
  }

  if (stringFecha.includes("-") || stringFecha.includes("T")) {
    try {
      const soloFecha = stringFecha.split("T")[0]; 
      const partes = soloFecha.split("-"); 
      if (partes.length === 3) {
        const yyyy = partes[0];
        const mm = partes[1];
        const dd = partes[2];
        return `${dd}/${mm}/${yyyy}`; 
      }
    } catch (e) {
      console.error("Error al parsear fecha ISO:", stringFecha, e);
    }
  }
  return stringFecha;
};

const parsearValor = (campo, valor) => {
  if (valor === null || valor === undefined) return "";
  
  if (campo === "Fecha") {
    return formatearFecha(valor);
  }

  const stringValor = String(valor).trim();
  if (stringValor === "-" || stringValor === "N/A" || stringValor === "null" || stringValor === "") {
    return "";
  }

  if (!isNaN(stringValor) && stringValor !== "") {
    return Number(stringValor); 
  }
  return stringValor;
};

export const pranaBD = async (unidad) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  if (!API_BASE_URL) {
    throw new Error("Falta configurar la variable VITE_API_BASE_URL en el archivo .env");
  }

  try {
    const response = await fetch(`${API_BASE_URL}?unidad=${unidad.toUpperCase()}`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();
    if (data.error) throw new Error(data.message);

    return data.map((fila) => {
      const nuevaFila = {};
      Object.keys(fila).forEach((campoOriginal) => {
        const regla = CONFIG_CAMPOS[campoOriginal];
        if (!regla) {
          nuevaFila[campoOriginal] = parsearValor(campoOriginal, fila[campoOriginal]);
          return;
        }
        if (!regla.mostrar) return;
        const nombreFinal = regla.nuevoNombre ? regla.nuevoNombre : campoOriginal;
        nuevaFila[nombreFinal] = parsearValor(nombreFinal, fila[campoOriginal]);
      });
      return nuevaFila;
    });
  } catch (error) {
    console.error(`[PranaBD Error] Error al procesar datos de ${unidad}:`, error);
    throw error;
  }
};