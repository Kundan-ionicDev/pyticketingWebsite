import { TestBed } from '@angular/core/testing';

import { PyticketService } from './pyticket.service';

describe('PyticketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PyticketService = TestBed.get(PyticketService);
    expect(service).toBeTruthy();
  });
});
