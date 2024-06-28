interface SeedCategory {
    nombre: string;
}

interface SeedData {
    categories: SeedCategory[];
}

export const initialCategories: SeedData = {
    categories: [
        {
            "nombre": "Herramientas Manuales"
          },
          {
            "nombre": "Materiales Básicos"
          },
          {
            "nombre": "Equipos de Seguridad"
          },
          {
            "nombre": "Tornillos y Anclajes"
          },
          {
            "nombre": "Fijaciones y Adhesivos"
          },
          {
            "nombre": "Equipos de Medición"
          }
    ],
}