import { TestBed } from '@angular/core/testing';

import { NavServicesServiceService } from './nav-services-service.service';

describe('NavServicesServiceService', () => {
  let service: NavServicesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavServicesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
