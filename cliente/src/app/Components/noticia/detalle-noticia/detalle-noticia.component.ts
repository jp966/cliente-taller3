import { Component, OnInit, OnDestroy } from '@angular/core';

import { Noticia } from '../../../Models/noticia.model';
import { NoticiasService } from '../../../Services/noticias.service';

import { Categoria } from '../../../Models/categoria.model';
import { CategoriasService } from '../../../Services/categorias.service';

import { Usuario } from '../../../Models/usuario.model';
import { UsuariosService } from '../../../Services/usuarios.service';

import { DataService } from '../../../Services/data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detalle-noticia',
  templateUrl: './detalle-noticia.component.html',
  styleUrls: ['./detalle-noticia.component.css']
})
export class DetalleNoticiaComponent implements OnInit, OnDestroy {

  id: number;
  private sub: any;

	public noticia:Noticia;
  public categoria:Categoria;
  public usuario:Usuario;

  public totalCategorias:Categoria[];
  public totalUsuarios:Usuario[];

  constructor(public servicioData:DataService, public route:ActivatedRoute, 
    public servicioUsuario:UsuariosService, public servicioCategoria:CategoriasService, 
    public servicioRouter:Router, public servicioNoticia:NoticiasService){

  }

  ngOnInit() {

     this.sub = this.route.params.subscribe(params => {
     this.id = +params['id']; // (+) converts string 'id' to a number

     this.totalCategorias=[];
     this.totalUsuarios=[];
     this.noticia=new Noticia();
     this.categoria=new Categoria();
     this.usuario=new Usuario();

     this.actualizar();

    });



    /*
    this.servicioData.currentNoticia.subscribe(data=>{
      this.noticia=data;

    });
    */
  }

  actualizar(){
    this.servicioCategoria.getCategorias().subscribe(data=>{
      this.totalCategorias=data;

      this.servicioUsuario.getUsuarios().subscribe(data=>{
        this.totalUsuarios=data;
        this.setearNoticia();
       
      });
    });
  }

  setearNoticia(){
    this.servicioNoticia.getNoticia(this.id).subscribe(data=>{
       this.noticia=data;
       
       this.servicioCategoria.getCategoria(parseInt(this.noticia.categoria_id)).subscribe(data=>{
         this.categoria=data;

         this.servicioUsuario.getUsuario(parseInt(this.noticia.usuario_id)).subscribe(data=>{
           this.usuario=data;

            this.reemplazarIdPorString();
            this.reemplazarIdPorStringUsuario();
         });
       });


     },error => {
            this.servicioRouter.navigate(['noticias']);
        });
  }

  //serialización de categoría--
    reemplazarIdPorString()
  {
  
      for(let j = 0 ; j < this.totalCategorias.length ; j++)
      {
        if(parseInt(this.noticia.categoria_id) === this.totalCategorias[j].id)
        {
          this.noticia.categoria_id = this.totalCategorias[j].descripcion;
          break;
        }
      }

    
  }


  pasarStringId(noticia)
  {
    for ( let i = 0 ; i < this.totalCategorias.length ; i ++)
    {
      if(noticia.categoria_id === this.totalCategorias[i].descripcion)
        {
          noticia.categoria_id = this.totalCategorias[i].id;
        }
    }

  }

  //-----

  //serialización del usuario

    reemplazarIdPorStringUsuario()
  {
    
      for(let j = 0 ; j < this.totalUsuarios.length ; j++)
      {
        if(parseInt(this.noticia.usuario_id) === this.totalUsuarios[j].id)
        {
          this.noticia.usuario_id = this.totalUsuarios[j].name;
          break;
        }
      }

    
  }


  pasarStringIdUsuario(noticia)
  {
    for ( let i = 0 ; i < this.totalUsuarios.length ; i ++)
    {
      if(noticia.usuario_id === this.totalUsuarios[i].name)
        {
          noticia.usuario_id = this.totalUsuarios[i].id;
        }
    }

  }


  ngOnDestroy(){
    this.sub.unsubscribe();

  }

}
