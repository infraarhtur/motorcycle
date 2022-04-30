# Catalogo de venta - Las Dos Ruedas

[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Este repositorio contiene el codigo fuente relacionado con el proyecto catalogo de ventas las dos ruedas, correspondiente a la pagina web.
# Ramas pricipales
Se cuenta con las siguientes ramas base:
- master
- testing
- develop

# Pasos basicos git

Clonar el repositorio remoto.
```sh
$ git clone https://github.com/LasDosRuedas/frontend-sales.git
```

Crear una rama propia para trabajar la funcionalidad se va a desarrollar, la nomenclatura que se debe seguir para nombrar una rama es la siguiente:

- feature-LDR001-JDSJ-PaginaContactenos
```sh
$ git checkout -b feature-LDR001-JDSJ-Descripcion
```

Antes de realizar un commit debo verificar que tenga los ultimos cambios pendientes.
```sh
$ git pull origin "nombre de la rama"
```

Siempre que desee hacer un commit y subir esos cambios a GitHub, debo validar que el mensaje del commit sea explicito para los demas miembros del equipo.
```sh
$ git commit -m "Se elimina la tabla de productos - JDSJ"
```

Antes de realizar un push o un Pull request, debo garantizar que se descarguen los ultimos cambios pendientes, es decir un git pull.

Para subir los cambios a GitHub, deben hacer un push
```sh
$ git push origin "nombre de la rama"
```

Cuando se cree un Pull Request, debo seleccionar como revisor a **Juan David Saboya** y **Luis Arturo Monsalve**.

# Herramientas

Durante la ejecución del proyecto se utilizaran ciertas herramientas, que nos ayudaran en tareas especificas.

Como repositorio de documentos utilizaremos **Google Drive**.
```sh
 https://drive.google.com/drive/folders/1_f56nTy7fd0czbiBDE42LMc2hP-oJRqo?usp=sharing
```
Como gestor de historias de usuario y tablero canvan utilizaremos **Trello**.
```sh
 https://trello.com/b/n0dyrrPR/ventas
```

# Links de interes
- Herramienta para grabar pantalla -> https://www.apowersoft.us/
- Herramienta para tomar pantallazos -> https://app.prntscr.com/es/

- Lottie (Animaciones gratuitas) -> https://lottiefiles.com/
- UnDraw (Ilustraciones gratuitas) -> https://undraw.co/search
- Dribbble (Inspiracion para app) -> https://dribbble.com/search/moto%20web