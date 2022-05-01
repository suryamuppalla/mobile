import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlogsListPage } from './blogs-list.page';

describe('BlogsListPage', () => {
  let component: BlogsListPage;
  let fixture: ComponentFixture<BlogsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlogsListPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
