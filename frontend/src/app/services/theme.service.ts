import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Ported verbatim from public/app.js applyTheme()/initTheme(): same localStorage key,
// same attribute target (document.documentElement), same default ("light").
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeSubject = new BehaviorSubject<'light' | 'dark'>(this.readInitial());
  readonly theme$ = this.themeSubject.asObservable();

  constructor() {
    this.apply(this.themeSubject.value);
  }

  get current(): 'light' | 'dark' {
    return this.themeSubject.value;
  }

  toggle(): void {
    const next = this.current === 'dark' ? 'light' : 'dark';
    this.apply(next);
    this.themeSubject.next(next);
  }

  private readInitial(): 'light' | 'dark' {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' ? 'dark' : 'light';
  }

  private apply(theme: 'light' | 'dark'): void {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
