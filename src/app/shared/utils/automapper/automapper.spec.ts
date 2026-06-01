import { TestBed } from '@angular/core/testing';

import { Automapper } from './automapper';

describe('Automapper', () => {
  let service: Automapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Automapper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
