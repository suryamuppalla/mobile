import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddNewBlogPage } from './add-new-blog.page';

describe('Tab2Page', () => {
  let component: AddNewBlogPage;
  let fixture: ComponentFixture<AddNewBlogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewBlogPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewBlogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
