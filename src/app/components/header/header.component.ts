import { Component, OnInit } from '@angular/core';

/**
 * Componente do Cabeçalho (Header) da aplicação
 * 
 * Este componente:
 * - Exibe o cabeçalho fixo no topo da página
 * - Contém o logo e nome da aplicação
 * - Permanece fixo durante o scroll (position: fixed)
 * - Altura padrão: 64px
 * 
 * O header é exibido em todas as páginas autenticadas
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Componente de apresentação simples, sem lógica adicional
  }

}
