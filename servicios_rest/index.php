<?php
session_name("proyecto_php");
session_start();

require "src/funciones_servicios.php";
require __DIR__ . '/Slim/autoload.php';

$app= new \Slim\App;



$app->get('/conexion_PDO',function($request){
    echo json_encode( conexion_pdo(), JSON_FORCE_OBJECT);
});

$app->get('/logueado',function(){
    echo json_encode(seguridad(), JSON_FORCE_OBJECT);
});

$app->get('/salir',function(){
    session_destroy();
    echo json_encode( array("nada"=>"nada"), JSON_FORCE_OBJECT);
});

//  a) LOGIN 
$app->post('/login',function($request){
    $datos[]=$request->getParam("usuario");
    $datos[]=$request->getParam("clave");
    
    echo json_encode(login($datos), JSON_FORCE_OBJECT);
});

//  b) OBTENER HORARIO POR ID 
$app->get('/horario/{id_usuario}',function($request){
    $seguridad=seguridad();
    if(isset($seguridad["usuario"])){
        $datos[]=$request->getAttribute("id_usuario");
        echo json_encode( obtener_horario($datos), JSON_FORCE_OBJECT);
    }else{
        echo json_encode( array("no_auth"=>"Usted no tiene permisos para usar este Servicio"), JSON_FORCE_OBJECT);
    }
});

//  c) OBTENER TODOS LOS USUARIOS 
$app->get('/usuarios',function(){   
    $seguridad=seguridad();
    if(isset($seguridad["usuario"]) && $seguridad["usuario"]["tipo"]=="admin"){         
        echo json_encode(obtener_usuarios(), JSON_FORCE_OBJECT);
    }else {
        echo json_encode( array("no_auth"=>"Usted no tiene permisos para usar este Servicio"), JSON_FORCE_OBJECT);
    }
});

//  d) SABER SI USUARIO TIENE GRUPO, POR HORA, DÍA, E ID 
$app->get('/tieneGrupo/{dia}/{hora}/{id_usuario}',function($request){
    $datos[]=$request->getAttribute("dia");
    $datos[]=$request->getAttribute("hora");
    $datos[]=$request->getAttribute("id_usuario");   
    $seguridad=seguridad(); 
    
    if(isset($seguridad["usuario"]) && $seguridad["usuario"]["tipo"]=="admin"){         
        echo json_encode(tieneGrupo($datos), JSON_FORCE_OBJECT);

    }else {
        echo json_encode( array("no_auth"=>"Usted no tiene permisos para usar este Servicio"), JSON_FORCE_OBJECT);
    }
});

//  e) TODOS LOS GRUPOS DE UN USUARIO, POR HORA, DÍA E ID 
$app->get('/grupos/{dia}/{hora}/{id_usuario}',function($request){
    $datos[]=$request->getAttribute("dia");
    $datos[]=$request->getAttribute("hora");
    $datos[]=$request->getAttribute("id_usuario");
    $seguridad = seguridad();

    if(isset($seguridad["usuario"]) && $seguridad["usuario"]["tipo"]=="admin"){         
        echo json_encode(obtener_grupos($datos), JSON_FORCE_OBJECT);
    }else {
        echo json_encode( array("no_auth"=>"Usted no tiene permisos para usar este Servicio"), JSON_FORCE_OBJECT);
    }
});

//  f) TODOS LOS GRUPOS QUE NO IMPARTA UN USUARIO A UNA HORA Y DÍA 
$app->get('/gruposLibres/{dia}/{hora}/{id_usuario}',function($request){
    $datos[]=$request->getAttribute("dia");
    $datos[]=$request->getAttribute("hora");
    $datos[]=$request->getAttribute("id_usuario");
    $seguridad = seguridad();
    
    if(isset($seguridad["usuario"]) && $seguridad["usuario"]["tipo"]=="admin"){         
        echo json_encode(obtener_gruposLibres($datos), JSON_FORCE_OBJECT);
    }else {
        echo json_encode( array("no_auth"=>"Usted no tiene permisos para usar este Servicio"), JSON_FORCE_OBJECT);
    }
});

$app->get('/gruposEnAula/{dia}/{hora}/{id_aula}',function($request){
    $datos[]=$request->getAttribute("dia");
    $datos[]=$request->getAttribute("hora");
    $datos[]=$request->getAttribute("id_aula");
    $seguridad = seguridad();
    
    if(isset($seguridad["usuario"]) && $seguridad["usuario"]["tipo"]=="admin"){         
        echo json_encode(obtener_gruposEnAula($datos), JSON_FORCE_OBJECT);
    }else {
        echo json_encode( array("no_auth"=>"Usted no tiene permisos para usar este Servicio"), JSON_FORCE_OBJECT);
    }
});


//  g) BORRAR UN GRUPO, POR DÍA, HORA E ID 
$app->delete('/borrarGrupo/{dia}/{hora}/{id_usuario}/{id_grupo}',function($request){
    $datos[]=$request->getAttribute("dia");
    $datos[]=$request->getAttribute("hora");
    $datos[]=$request->getAttribute("id_usuario");
    $datos[]=$request->getAttribute("id_grupo");
    $seguridad = seguridad();    
    
    if(isset($seguridad["usuario"]) && $seguridad["usuario"]["tipo"]=="admin"){         
        echo json_encode(borrarGrupo($datos), JSON_FORCE_OBJECT);
    }else {
        echo json_encode( array("no_auth"=>"Usted no tiene permisos para usar este Servicio"), JSON_FORCE_OBJECT);
    }
});
$app->put('/actualizarGrupo/{id_aula_nueva}/{dia}/{hora}/{id_grupo}/{id_aula}',function($request){
    $datos[]=$request->getAttribute("id_aula_nueva");
    $datos[]=$request->getAttribute("dia");
    $datos[]=$request->getAttribute("hora");
    $datos[]=$request->getAttribute("id_grupo");
    $datos[]=$request->getAttribute("id_aula");
    $seguridad = seguridad();    
    
    if(isset($seguridad["usuario"]) && $seguridad["usuario"]["tipo"]=="admin"){         
        echo json_encode(actualizarGrupo($datos), JSON_FORCE_OBJECT);
    }else {
        echo json_encode( array("no_auth"=>"Usted no tiene permisos para usar este Servicio"), JSON_FORCE_OBJECT);
    }
});

//  h) AÑADIR PARA UN USUARIO UN GRUPO EN UN DÍA A UNA HORA 
$app->post('/insertarGrupo/{dia}/{hora}/{id_usuario}/{id_grupo}/{id_aula}',function($request){
    $datos[]=$request->getAttribute("dia");
    $datos[]=$request->getAttribute("hora");
    $datos[]=$request->getAttribute("id_usuario");
    $datos[]=$request->getAttribute("id_grupo");
    $datos[]=$request->getAttribute("id_aula");
    $seguridad = seguridad();
    
    if(isset($seguridad["usuario"]) && $seguridad["usuario"]["tipo"]=="admin"){         
        echo json_encode(insertarGrupo($datos), JSON_FORCE_OBJECT);
    }else {
        echo json_encode( array("no_auth"=>"Usted no tiene permisos para usar este Servicio"), JSON_FORCE_OBJECT);
    }
});


$app->get('/aulas',function(){    
    echo json_encode(obtener_aulas(), JSON_FORCE_OBJECT);
});

$app->get('/aulasLibres/{dia}/{hora}',function($request){    
    $datos[]=$request->getAttribute("dia");
    $datos[]=$request->getAttribute("hora");
    $seguridad = seguridad();
    
    if(isset($seguridad["usuario"]) && $seguridad["usuario"]["tipo"]=="admin"){         
        echo json_encode(aulasLibres($datos), JSON_FORCE_OBJECT);
    }else {
        echo json_encode( array("no_auth"=>"Usted no tiene permisos para usar este Servicio"), JSON_FORCE_OBJECT);
    }
});
$app->get('/aulasOcupadas/{dia}/{hora}',function($request){    
    $datos[]=$request->getAttribute("dia");
    $datos[]=$request->getAttribute("hora");
    $seguridad = seguridad();
    
    if(isset($seguridad["usuario"]) && $seguridad["usuario"]["tipo"]=="admin"){         
        echo json_encode(aulasOcupadas($datos), JSON_FORCE_OBJECT);
    }else {
        echo json_encode( array("no_auth"=>"Usted no tiene permisos para usar este Servicio"), JSON_FORCE_OBJECT);
    }
});


// Una vez creado servicios los pongo a disposición
$app->run();
?>
