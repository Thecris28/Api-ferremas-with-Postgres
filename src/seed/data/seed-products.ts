interface SeedProduct {
    marca: string,
    codigo?: string,
    nombre: string,
    categoria: number,
    precio: number,
    stock: number
}


interface SeedData {
    products: SeedProduct[];
}

export const initialData: SeedData = {

    products: [
        {
            "marca": "Bauker",
            "codigo": "BAK-30",
            "nombre": "Taladro Atornillador bauker",
            "categoria": 1,
            "precio": 79700,
            "stock": 10
          },
          {
            "marca": "Bosch",
            "codigo": "Drv01",
            "nombre": "Martillo",
            "categoria": 1,
            "precio": 20000,
            "stock": 10
          },
          {
            "marca": "Bosch",
            "codigo": "Gsr-1000",
            "nombre": "Taladro Atornillador Inalambrico",
            "categoria": 1,
            "precio": 86400,
            "stock": 10
          },
          {
            "marca": "Bosch",
            "codigo": "Gsv-12",
            "nombre": "Taladro Percutor 3/8",
            "categoria": 1,
            "precio": 140000,
            "stock": 8
          },
          {
            "marca": "Skil",
            "codigo": "SKI-4",
            "nombre": "Pulidora",
            "categoria": 1,
            "precio": 40000,
            "stock": 10
          },
          {
            "marca": "Skil",
            "codigo": "SKI-5",
            "nombre": "Cierra caladora electrica",
            "categoria": 1,
            "precio": 49000,
            "stock": 10
          },
          {
            "marca": "Redline",
            "codigo": "lINE-44",
            "nombre": "Lentes de seguridad",
            "categoria": 3,
            "precio": 12990,
            "stock": 20
          },
          {
            "marca": "Steelpro",
            "codigo": "STL-1",
            "nombre": "Casco de seguridad",
            "categoria": 3,
            "precio": 10990,
            "stock": 20
          },
          {
            "marca": "Redline",
            "codigo": "LINE-2",
            "nombre": "Guantes de seguridad",
            "categoria": 3,
            "precio": 5990,
            "stock": 20
          },
          {
            "marca": "Mamut",
            "codigo": "MTT-3",
            "nombre": "Tornillo yeso carton punta fina",
            "categoria": 4,
            "precio": 3890,
            "stock": 40
          },
          {
            "marca": "Mamut",
            "codigo": "MTT-4",
            "nombre": "Clavo de acero",
            "categoria": 4,
            "precio": 1500,
            "stock": 100
          },
          {
            "marca": "Mamut",
            "codigo": "MTT-5",
            "nombre": "Tornillo madera punta gruesa",
            "categoria": 4,
            "precio": 4200,
            "stock": 75
          },
          {
            "marca": "Mamut",
            "codigo": "MTT-6",
            "nombre": "Clavo sin cabeza",
            "categoria": 4,
            "precio": 1350,
            "stock": 120
          },
          {
            "marca": "Mamut",
            "codigo": "MMT-7",
            "nombre": "Tornillo autoperforante",
            "categoria": 4,
            "precio": 5000,
            "stock": 60
          },
          {
            "marca": "Bauker",
            "codigo": "BAK-70",
            "nombre": "Sierra Circular",
            "categoria": 1,
            "precio": 75000,
            "stock": 5
          },
          {
            "marca": "Bosch",
            "codigo": "GKS-18",
            "nombre": "Sierra Circular 18V",
            "categoria": 1,
            "precio": 320000,
            "stock": 5
          },
          {
            "marca": "Bauker",
            "codigo": "BAK-12",
            "nombre": "Atornillador Electrico",
            "categoria": 1,
            "precio": 40000,
            "stock": 20
          },
          {
            "marca": "Bauker",
            "codigo": "BAK-127",
            "nombre": "Esmeril Angular",
            "categoria": 1,
            "precio": 50000,
            "stock": 8
          },
          {
            "marca": "Bauker",
            "codigo": "BAK-50",
            "nombre": "Taladro",
            "categoria": 1,
            "precio": 40000,
            "stock": 10
          },
          {
            "marca": "DeWALT",
            "codigo": "DWE-33",
            "nombre": "Sierra Caladora 700W",
            "categoria": 1,
            "precio": 290000,
            "stock": 10
          },
          {
            "marca": "Makita",
            "codigo": "MAK-01",
            "nombre": "Taladro Atornillador",
            "categoria": 1,
            "precio": 90000,
            "stock": 8
          },
          {
            "marca": "Bauker",
            "codigo": "BAK-10",
            "nombre": "Lijadora",
            "categoria": 1,
            "precio": 30000,
            "stock": 15
          },
          {
            "marca": "DeWALT",
            "codigo": "DWE-50",
            "nombre": 'Sierra Circular Eléctrica de 7 1/4"',
            "categoria": 1,
            "precio": 149000,
            "stock": 10
          },
          {
            "marca": "DeWALT",
            "codigo": "DWE-60",
            "nombre": "Pulidora giratoria 7' velocidad variable",
            "categoria": 1,
            "precio": 309000,
            "stock": 10
          }
    ]
    
}
