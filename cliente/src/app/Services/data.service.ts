import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Noticia } from '../Models/noticia.model';

@Injectable()
export class DataService {

	public noticiaSource = new BehaviorSubject<Noticia>(new Noticia());
	currentNoticia = this.noticiaSource.asObservable();

  constructor() { }

	//función para cambiar de noticia a ver
	cambiarNoticia(noticia){
		this.noticiaSource.next(noticia);
	}

}
