import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { KitchenOrderBoardVm } from '@app/contexts/kitchen/application/dto/kitchen-order-board.vm';
import { AdvanceKitchenOrderStatusUseCase } from '@app/contexts/kitchen/application/use-cases/advance-kitchen-order-status.use-case';
import { GetKitchenOrderBoardUseCase } from '@app/contexts/kitchen/application/use-cases/get-kitchen-order-board.use-case';
import { KitchenOrderBoardComponent } from './kitchen-order-board.component';

describe('KitchenOrderBoardComponent', () => {
  let fixture: ComponentFixture<KitchenOrderBoardComponent>;
  let component: KitchenOrderBoardComponent;
  let consoleErrorSpy: jest.SpyInstance;

  const kitchenBoardVm: KitchenOrderBoardVm = {
    columns: [
      {
        key: 'queue',
        title: 'Queue',
        accent: 'var(--warm-gray-lt)',
        orders: [
          {
            id: 'ord-301',
            displayId: '#301',
            statusKey: 'Placed',
            statusLabel: 'Placed',
            columnKey: 'queue',
            station: 'A',
            items: ['Margherita ×2'],
            fulfillmentLabel: 'Delivery',
            createdAtIso: '2026-06-26T12:00:00.000Z',
            elapsedMinutes: 15,
            isOven: false,
            ovenSeconds: null,
            isReady: false,
            timerLabel: '15 min',
            timerState: 'muted',
            footerLabel: 'Elapsed',
            nextActionLabel: 'Confirm',
            canAdvance: true,
          },
        ],
      },
      {
        key: 'prepping',
        title: 'Prepping',
        accent: 'var(--amber)',
        orders: [],
      },
      {
        key: 'oven',
        title: 'In Oven',
        accent: 'var(--red)',
        orders: [],
      },
      {
        key: 'ready',
        title: 'Ready',
        accent: 'var(--olive)',
        orders: [],
      },
    ],
    activeOrders: 1,
    stationSummary: [
      { station: 'A', activeOrders: 1 },
      { station: 'B', activeOrders: 0 },
      { station: 'C', activeOrders: 0 },
    ],
    emptyTitle: 'No active kitchen orders',
    emptyBody: 'New placed orders will appear here.',
  };

  const getKitchenOrderBoardUseCase = {
    execute: jest.fn().mockReturnValue(of(kitchenBoardVm)),
  };

  const advanceKitchenOrderStatusUseCase = {
    execute: jest.fn().mockReturnValue(of(undefined)),
  };

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-26T20:00:47.000Z').getTime());
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    getKitchenOrderBoardUseCase.execute.mockReturnValue(of(kitchenBoardVm));
    advanceKitchenOrderStatusUseCase.execute.mockReturnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [KitchenOrderBoardComponent],
      providers: [
        {
          provide: GetKitchenOrderBoardUseCase,
          useValue: getKitchenOrderBoardUseCase,
        },
        {
          provide: AdvanceKitchenOrderStatusUseCase,
          useValue: advanceKitchenOrderStatusUseCase,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KitchenOrderBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    jest.useRealTimers();
  });

  it('loads the kitchen board on init and renders the fullscreen board data', () => {
    expect(getKitchenOrderBoardUseCase.execute).toHaveBeenCalledTimes(1);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
    expect(component.hasOrders()).toBe(true);
    expect(component.activeOrders()).toBe(1);
    expect(component.stationSummary()).toEqual(kitchenBoardVm.stationSummary);
    expect(fixture.nativeElement.textContent).toContain('Kitchen Board');
    expect(fixture.nativeElement.textContent).toContain('#301');
    expect(fixture.nativeElement.textContent).toContain('Stn A');
    expect(fixture.nativeElement.textContent).toContain('1 active');
  });

  it('updates the live clock every second', () => {
    expect(component.clockLabel()).toBe('22:00:47');

    jest.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(component.clockLabel()).toBe('22:00:48');
    expect(component.dateLabel()).toContain('26 June');
  });

  it('reloads the board after advancing an order status', () => {
    component.advance('ord-301', 'Placed');

    expect(advanceKitchenOrderStatusUseCase.execute).toHaveBeenCalledWith(
      'ord-301',
      'Placed',
    );
    expect(getKitchenOrderBoardUseCase.execute).toHaveBeenCalledTimes(2);
    expect(component.advancingOrderId()).toBeNull();
  });

  it('shows an error when the kitchen board cannot be loaded', async () => {
    TestBed.resetTestingModule();
    getKitchenOrderBoardUseCase.execute.mockReturnValue(
      throwError(() => new Error('network')),
    );

    await TestBed.configureTestingModule({
      imports: [KitchenOrderBoardComponent],
      providers: [
        {
          provide: GetKitchenOrderBoardUseCase,
          useValue: getKitchenOrderBoardUseCase,
        },
        {
          provide: AdvanceKitchenOrderStatusUseCase,
          useValue: advanceKitchenOrderStatusUseCase,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KitchenOrderBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.error()).toBe('Failed to load kitchen board');
    expect(fixture.nativeElement.textContent).toContain(
      'Failed to load kitchen board',
    );
  });
});
