import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientActionComponent } from './client-action.component';

describe('ClientActionComponent', () => {
  let component: ClientActionComponent;
  let fixture: ComponentFixture<ClientActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientActionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
