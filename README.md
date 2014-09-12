Animates
========

Main repository for animates

## Resumen

*Animates* permite que varios usuarios puedan crear, reproducir y editar animaciones en un sitio web de modo simultáneo y colaborativo. Asimismo, brinda la posibilidad de descargar las presentaciones para su reproducción sin necesidad de conexión a internet.

El sistema se construyó íntegramente en javascript sobre una arquitectura cliente-servidor (full-stack javascript ), utilizando el enfoque de diseño guiado por el dominio (DDD, Domain Driven Design), lo que permitió un modelo consistente, reutilizable  en ambas partes de la arquitectura.
 
En la implementación de Animates se utilizaron distintas tecnologías innovadoras y de creciente adopción en la actualidad, entre las que se destacan angularJS, mongodb, nodeJs, grunt, HTML5 (en especial canvas por medio de FabricJS), expressJS, passportJS y socket.io

Como soporte de infraestructura de desarrollo, y siguiendo las nuevas tendencias,  se implementó un sistema de integración continua enfocado a la implantación en un ambiente productivo alojado en Azure Websites, utilizando Jenkins dentro de una máquina virtual en Amazon Web Services.
 
El proyecto está alojado en GitHub, aprovechando varias ventajas de git, entre ellas la facilidad de iniciar un nuevo ciclo de integración continua cada vez que se suben cambios al repositorio
