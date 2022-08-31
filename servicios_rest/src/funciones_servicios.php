<?php
require "config_bd.php";
define ('MINUTOS', (10 * 60)); 
define ("AULA_VACIA", 64);
define ("GRUPOS_SIN_AULA", array(51, 52, 53, 54, 57, 58, 60, 61, 62, 66, 67, 68, 69, 70, 71, 72, 73, 74));

function conexion_pdo(){
    try{
        $conexion= new PDO("mysql:host=".SERVIDOR_BD.";dbname=".NOMBRE_BD,USUARIO_BD,CLAVE_BD,array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES 'utf8'"));
        
        $respuesta["mensaje"]="Conexi&oacute;n a la BD realizada con &eacute;xito";
        
        $conexion=null;
    }
    catch(PDOException $e){
        $respuesta["error"]="Imposible conectar:".$e->getMessage();
    }
    return $respuesta;
}

function seguridad(){
    
    if(isset($_SESSION["usuario"]) && isset($_SESSION["clave"]) && isset($_SESSION["ultimo_acceso"])){

        if(time() - $_SESSION["ultimo_acceso"] > MINUTOS){
            $respuesta["tiempo"]="Su tiempo de sesión ha caducado";
        }else{
            try{
                $conexion= new PDO("mysql:host=".SERVIDOR_BD.";dbname=".NOMBRE_BD,USUARIO_BD,CLAVE_BD,array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES 'utf8'"));
                $consulta="SELECT * FROM usuarios WHERE usuario=? AND clave=?";
                $sentencia=$conexion->prepare($consulta);

                if($sentencia->execute([$_SESSION["usuario"],$_SESSION["clave"]])){
                    if($sentencia->rowCount()>0){
                        $respuesta["usuario"]=$sentencia->fetch(PDO::FETCH_ASSOC);
                        $_SESSION["ultimo_acceso"]=time();
                    }else{
                        $respuesta["baneo"]="Usted ya no se encuentra registrado en la BD";
                    }
                }else{
                    $respuesta["error"]= "Error en la consulta. Error n&uacute;mero:".$sentencia->errorInfo()[1]." : ".$sentencia->errorInfo()[2];
                }

                $sentencia=null;
                $conexion=null;
            }
            catch(PDOException $e){
                $respuesta["error"]="Imposible conectar:".$e->getMessage();
            }
        }
    }else{
        $respuesta["no_login"]="No está logueado";
    }
    return $respuesta;
}

// a)
function login($datos){
    try{
        $conexion= new PDO("mysql:host=".SERVIDOR_BD.";dbname=".NOMBRE_BD,USUARIO_BD,CLAVE_BD,array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES 'utf8'"));
        
        $consulta = "SELECT * FROM usuarios WHERE usuario=? AND clave=?";
        $sentencia = $conexion->prepare($consulta);
        if ($sentencia->execute($datos)) {
            if ($sentencia->rowCount() > 0) {
                $respuesta["usuario"] = $sentencia->fetch(PDO::FETCH_ASSOC);
                $_SESSION["usuario"]=$datos[0];
                $_SESSION["clave"]=$datos[1];
                $_SESSION["ultimo_acceso"]=time();
            }else {
                $respuesta["mensaje"] = "Usuario no se encuentra registrado en la BD.";
                

            }
        }else {
            $respuesta["error"] = "Error al realizar la consulta";
        }
        $sentencia = null;
        $conexion = null;
    }
    catch(PDOException $e){
        $respuesta["error"]="Imposible conectar:".$e->getMessage();
    }
    return $respuesta;
}

// b)
function obtener_horario($datos){
    try{
        $conexion= new PDO("mysql:host=".SERVIDOR_BD.";dbname=".NOMBRE_BD,USUARIO_BD,CLAVE_BD,array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES 'utf8'"));
        
        $consulta = "SELECT horario_lectivo.*, grupos.nombre AS nombre_grupo, aulas.nombre AS nombre_aula FROM horario_lectivo JOIN grupos JOIN aulas WHERE horario_lectivo.grupo=grupos.id_grupo AND horario_lectivo.aula=aulas.id_aula AND horario_lectivo.usuario=?";
        //var_dump($consulta);
        $sentencia = $conexion->prepare($consulta);
        if ($sentencia->execute($datos)) {
            
            $respuesta["horario"] = $sentencia->fetchAll(PDO::FETCH_ASSOC);
            //var_dump($datos);
        }else {
            $respuesta["error"] = "Error al realizar la consulta";
        }
        $sentencia = null;
        $conexion = null;
    }
    catch(PDOException $e){
        $respuesta["error"]="Imposible conectar:".$e->getMessage();
    }
    return $respuesta;
}

// c)
function obtener_usuarios(){
    try{
        $conexion= new PDO("mysql:host=".SERVIDOR_BD.";dbname=".NOMBRE_BD,USUARIO_BD,CLAVE_BD,array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES 'utf8'"));
        
        $consulta = "SELECT * FROM usuarios WHERE tipo='normal'";
        $sentencia = $conexion->prepare($consulta);
        if ($sentencia->execute()) {
            
            $respuesta["usuarios"] = $sentencia->fetchAll(PDO::FETCH_ASSOC);
            
        }else {
            $respuesta["error"] = "Error al realizar la consulta";
        }
        $sentencia = null;
        $conexion = null;
    }
    catch(PDOException $e){
        $respuesta["error"]="Imposible conectar:".$e->getMessage();
    }
    return $respuesta;
}

// d)
function tieneGrupo($datos){
    try{
        $conexion= new PDO("mysql:host=".SERVIDOR_BD.";dbname=".NOMBRE_BD,USUARIO_BD,CLAVE_BD,array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES 'utf8'"));
        
        $consulta = "SELECT * FROM horario_lectivo WHERE dia=? AND hora=? AND usuario=?";
        $sentencia = $conexion->prepare($consulta);
        if ($sentencia->execute($datos)) {
            
            $respuesta["tiene_grupo"] = $sentencia->rowCount() > 0;
            $respuesta["grupos"] = $sentencia->fetchAll(PDO::FETCH_ASSOC);
            
        }else {
            $respuesta["error"] = "Error al realizar la consulta";
        }
        $sentencia = null;
        $conexion = null;
    }
    catch(PDOException $e){
        $respuesta["error"]="Imposible conectar:".$e->getMessage();
    }
    return $respuesta;
}

// e)
function obtener_grupos($datos){
    try{
        $conexion= new PDO("mysql:host=".SERVIDOR_BD.";dbname=".NOMBRE_BD,USUARIO_BD,CLAVE_BD,array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES 'utf8'"));
        
        $consulta = "SELECT grupos.id_grupo, grupos.nombre AS nombre_grupo, aulas.id_aula, aulas.nombre AS nombre_aula FROM grupos JOIN horario_lectivo JOIN aulas WHERE aulas.id_aula=horario_lectivo.aula AND grupos.id_grupo=horario_lectivo.grupo AND horario_lectivo.dia=? AND horario_lectivo.hora=? AND horario_lectivo.usuario=?";
        $sentencia = $conexion->prepare($consulta);
        //var_dump($consulta);
        if ($sentencia->execute($datos)) {
            
            $respuesta["grupos"] = $sentencia->fetchAll(PDO::FETCH_ASSOC);
            
        }else {
            $respuesta["error"] = "Error al realizar la consulta";
        }
        $sentencia = null;
        $conexion = null;
    }
    catch(PDOException $e){
        $respuesta["error"]="Imposible conectar:".$e->getMessage();
    }
    return $respuesta;
}

// f)
function obtener_gruposLibres($datos){
    try{
        $conexion= new PDO("mysql:host=".SERVIDOR_BD.";dbname=".NOMBRE_BD,USUARIO_BD,CLAVE_BD,array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES 'utf8'"));

        $subconsulta = "SELECT grupos.id_grupo FROM horario_lectivo, grupos WHERE horario_lectivo.grupo=grupos.id_grupo AND horario_lectivo.dia=? AND horario_lectivo.hora=? AND horario_lectivo.usuario=?";
        $consulta="SELECT * FROM grupos WHERE id_grupo NOT IN (".$subconsulta.")";
        
        $sentencia = $conexion->prepare($consulta);
        if ($sentencia->execute($datos)) {
            
            $respuesta["grupos"] = $sentencia->fetchAll(PDO::FETCH_ASSOC);
            
        }else {
            $respuesta["error"] = "Error al realizar la consulta";
        }
        $sentencia = null;
        $conexion = null;
    }
    catch(PDOException $e){
        $respuesta["error"]="Imposible conectar:".$e->getMessage();
    }
    return $respuesta;
}
function obtener_gruposEnAula($datos){
    try{
        $conexion= new PDO("mysql:host=".SERVIDOR_BD.";dbname=".NOMBRE_BD,USUARIO_BD,CLAVE_BD,array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES 'utf8'"));
        $consulta="SELECT grupos.id_grupo, grupos.nombre AS nombre_grupo, horario_lectivo.usuario AS id_profesor FROM horario_lectivo, grupos WHERE horario_lectivo.grupo=grupos.id_grupo AND dia=? AND hora=? AND aula=?";
        
        $sentencia = $conexion->prepare($consulta);
        if ($sentencia->execute($datos)) {
            
            $respuesta["grupos"] = $sentencia->fetchAll(PDO::FETCH_ASSOC);
            
        }else {
            $respuesta["error"] = "Error al realizar la consulta";
        }
        $sentencia = null;
        $conexion = null;
    }
    catch(PDOException $e){
        $respuesta["error"]="Imposible conectar:".$e->getMessage();
    }
    return $respuesta;
}

// g)
function borrarGrupo($datos){
    try{
        $conexion= new PDO("mysql:host=".SERVIDOR_BD.";dbname=".NOMBRE_BD,USUARIO_BD,CLAVE_BD,array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES 'utf8'"));
        
        $consulta = "DELETE FROM horario_lectivo WHERE dia=? AND hora=? AND usuario=? AND grupo=?";
        $sentencia = $conexion->prepare($consulta);
        if ($sentencia->execute($datos)) {
            
            $respuesta["mensaje"] = "Grupo borrado con éxito";
            
        }else {
            $respuesta["error"] = "Error al realizar la consulta";
        }
        $sentencia = null;
        $conexion = null;
    }
    catch(PDOException $e){
        $respuesta["error"]="Imposible conectar:".$e->getMessage();
    }
    return $respuesta;
}
function actualizarGrupo($datos){
    try{
        $conexion= new PDO("mysql:host=".SERVIDOR_BD.";dbname=".NOMBRE_BD,USUARIO_BD,CLAVE_BD,array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES 'utf8'"));
        
        $consulta = "UPDATE horario_lectivo SET aula=? WHERE dia=? AND hora=? AND grupo=? AND aula=?";
        $sentencia = $conexion->prepare($consulta);
        if ($sentencia->execute($datos)) {
            
            $respuesta["mensaje"] = "Grupos actualizados con éxito";
            
        }else {
            $respuesta["error"] = "Error al realizar la consulta";
        }
        $sentencia = null;
        $conexion = null;
    }
    catch(PDOException $e){
        $respuesta["error"]="Imposible conectar:".$e->getMessage();
    }
    return $respuesta;
}

// h)
function insertarGrupo($datos){
    try{
        $conexion= new PDO("mysql:host=".SERVIDOR_BD.";dbname=".NOMBRE_BD,USUARIO_BD,CLAVE_BD,array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES 'utf8'"));
        
        $consulta = "INSERT INTO horario_lectivo(dia, hora, usuario, grupo, aula) VALUES (?,?,?,?,?)";
        $sentencia = $conexion->prepare($consulta);
        if ($sentencia->execute($datos)) {
            
            $respuesta["mensaje"] = "Grupo insertado con éxito";
            
        }else {
            $respuesta["error"] = "Error al realizar la consulta";
        }
        $sentencia = null;
        $conexion = null;
    }
    catch(PDOException $e){
        $respuesta["error"]="Imposible conectar:".$e->getMessage();
    }
    return $respuesta;
}

function obtener_aulas(){
    try{
        $conexion= new PDO("mysql:host=".SERVIDOR_BD.";dbname=".NOMBRE_BD,USUARIO_BD,CLAVE_BD,array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES 'utf8'"));
        
        $consulta = "SELECT * FROM aulas";
        $sentencia = $conexion->prepare($consulta);
        if ($sentencia->execute()) {
            
            $respuesta["aulas"] = $sentencia->fetchAll(PDO::FETCH_ASSOC);
            
        }else {
            $respuesta["error"] = "Error al realizar la consulta";
        }
        $sentencia = null;
        $conexion = null;
    }
    catch(PDOException $e){
        $respuesta["error"]="Imposible conectar:".$e->getMessage();
    }
    return $respuesta;
}
function aulasLibres($datos){
    try{
        $conexion= new PDO("mysql:host=".SERVIDOR_BD.";dbname=".NOMBRE_BD,USUARIO_BD,CLAVE_BD,array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES 'utf8'"));
        
        $consulta = "SELECT DISTINCT * FROM aulas WHERE id_aula NOT IN(SELECT aulas.id_aula FROM horario_lectivo, aulas WHERE horario_lectivo.aula=aulas.id_aula and horario_lectivo.dia=? and horario_lectivo.hora=? and aulas.id_aula<>".AULA_VACIA.") ORDER BY aulas.nombre";
        $sentencia = $conexion->prepare($consulta);
        if ($sentencia->execute($datos)) {
            
            $respuesta["aulas_libres"] = $sentencia->fetchAll(PDO::FETCH_ASSOC);
            
        }else {
            $respuesta["error"] = "Error al realizar la consulta";
        }
        $sentencia = null;
        $conexion = null;
    }
    catch(PDOException $e){
        $respuesta["error"]="Imposible conectar:".$e->getMessage();
    }
    return $respuesta;
}
function aulasOcupadas($datos){
    try{
        $conexion= new PDO("mysql:host=".SERVIDOR_BD.";dbname=".NOMBRE_BD,USUARIO_BD,CLAVE_BD,array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES 'utf8'"));
        
        $consulta = "SELECT DISTINCT aulas.id_aula,aulas.nombre FROM horario_lectivo, aulas WHERE horario_lectivo.aula=aulas.id_aula AND horario_lectivo.dia=? AND horario_lectivo.hora=? AND aulas.id_aula<>".AULA_VACIA." ORDER BY aulas.nombre";
        $sentencia = $conexion->prepare($consulta);
        if ($sentencia->execute($datos)) {
            
            $respuesta["aulas_ocupadas"] = $sentencia->fetchAll(PDO::FETCH_ASSOC);
            
        }else {
            $respuesta["error"] = "Error al realizar la consulta";
        }
        $sentencia = null;
        $conexion = null;
    }
    catch(PDOException $e){
        $respuesta["error"]="Imposible conectar:".$e->getMessage();
    }
    return $respuesta;
}
?>
