import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';

import { EditarNoticiaComponent } from '../editar-noticia/editar-noticia.component';
import { AgregarNoticiaComponent } from '../agregar-noticia/agregar-noticia.component';
import { DetalleNoticiaComponent } from '../detalle-noticia/detalle-noticia.component';

import { Categoria } from '../../../Models/categoria.model';
import { CategoriasService } from '../../../Services/categorias.service';

import { Usuario } from '../../../Models/usuario.model';
import { UsuariosService } from '../../../Services/usuarios.service';

import { NoticiasService } from '../../../Services/noticias.service';
import { Noticia } from '../../../Models/noticia.model'; 

import { EventosService } from '../../../Services/eventos.service';

import { DataService } from '../../../Services/data.service';

import { Router } from '@angular/router';

//paginator
import {NgxPaginationModule} from 'ngx-pagination';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
@Component({
  selector: 'app-mi-noticia',
  templateUrl: './mi-noticia.component.html',
  styleUrls: ['./mi-noticia.component.css']
})
export class MiNoticiaComponent implements OnInit {

  public totalNoticias:Noticia[];
  public totalCategorias:Categoria[];
  public totalUsuarios:Usuario[];
  //booleano para saber si esta logeado o no
  public isLogged:boolean=false;
  //pagina de paginator
  public p:number=1;

 constructor(public servicioNoticia:NoticiasService,public servicioCategoria:CategoriasService,
    public dialog: MatDialog, public servicioUsuario:UsuariosService, 
      public eventosService:EventosService, public router:Router, public servicioData:DataService) {

      //se determina si esta logeado o no el usuario
     if(localStorage.getItem('currentUser')){
       this.isLogged=true;
     }

     this.eventosService.isSignIn.subscribe(data=>{
       this.isLogged=true;
     });


  	this.totalNoticias=[];
    this.totalCategorias=[];
    this.totalUsuarios=[];
    this.actualizar();

   }

  ngOnInit() {


  }

actualizar(){
  this.servicioCategoria.getCategorias().subscribe(data => {
      var todo: any = data;
      this.totalCategorias = todo;

       this.servicioUsuario.getUsuarios().subscribe(data=>{
         var todo:any=data;
         this.totalUsuarios=data;

         this.servicioNoticia.getNoticias().subscribe(data => {
            var todo: any = data;
            this.totalNoticias = todo;
           

          });

       })

    });
}

  actualizarNoticias ()
  {
    this.servicioNoticia.getNoticias().subscribe(data => {
      var todo: any = data;
      this.totalNoticias = todo;
      this.totalNoticias=this.totalNoticias.filter(noticia=>noticia.usuario_id
      											===JSON.parse(localStorage.getItem('idCurrent')).id);
     

    });
  }


  //funciones para llamar dialogs a través de los botones de acciones

  eliminarNoticia (noticia)
  {
    
      this.servicioNoticia.deleteNoticia(noticia.id).subscribe( data => {
        console.log(data);
        this.actualizarNoticias();
      });
    }

  


  edicionNoticia (noticia)
  {

    var a = JSON.parse( JSON.stringify(noticia) );

    let dialogRef = this.dialog.open(EditarNoticiaComponent, {
      width: '700px',
      data:
      {
       noticia: a,
       totalCategorias:this.totalCategorias,
       servicioCategoria:this.servicioCategoria,
       servicioNoticia:this.servicioNoticia
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      this.actualizarNoticias();
    });
  }

  agregacionNoticia()
  {
    let dialogRef = this.dialog.open(AgregarNoticiaComponent, {
      width: '700px',
      data:{
        totalCategorias:this.totalCategorias,
        servicioCategoria:this.servicioCategoria,
        servicioNoticia:this.servicioNoticia
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      this.actualizarNoticias();
    });
  }


    detalleNoticia(noticia)
  {
    //this.servicioData.cambiarNoticia(noticia);
    this.router.navigate(['noticias/' + noticia.id]);
  }


}
