import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentGeneratorComponent } from './document-generator.component';

describe('DocumentGeneratorComponent', () => {
  let component: DocumentGeneratorComponent;
  let fixture: ComponentFixture<DocumentGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentGeneratorComponent]
    });
    fixture = TestBed.createComponent(DocumentGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
