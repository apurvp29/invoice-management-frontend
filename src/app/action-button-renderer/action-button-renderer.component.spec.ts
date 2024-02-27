import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionButtonRendererComponent } from './action-button-renderer.component';

describe('LogoRendererComponent', () => {
  let component: ActionButtonRendererComponent;
  let fixture: ComponentFixture<ActionButtonRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionButtonRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionButtonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
