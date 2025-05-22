import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JornadaBoardPage } from './jornada-board.page';

describe('JornadaBoardPage', () => {
  let component: JornadaBoardPage;
  let fixture: ComponentFixture<JornadaBoardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JornadaBoardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
