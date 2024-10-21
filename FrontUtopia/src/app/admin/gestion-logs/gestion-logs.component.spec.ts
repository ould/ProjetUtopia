import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionLogsComponent } from './gestion-logs.component';
import { LogsService } from './logs.service';
import { of, throwError } from 'rxjs';
import { Log } from 'src/app/gestionApp/interfaces/log';

describe('GestionLogsComponent', () => {
  let component: GestionLogsComponent;
  let fixture: ComponentFixture<GestionLogsComponent>;
  let mockLogsService: jasmine.SpyObj<LogsService>;

  beforeEach(async () => {
    mockLogsService = jasmine.createSpyObj('LogsService', ['getLogParPage']);

    await TestBed.configureTestingModule({
      declarations: [GestionLogsComponent],
      providers: [{ provide: LogsService, useValue: mockLogsService }]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionLogsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch logs on initialization', () => {
    const mockLogs: Log[] = [
      { message: 'Test log 1', type: 'INFO', application: 'Front', utilisateurId: '1', operation: 'READ' },
      { message: 'Test log 2', type: 'ERROR', application: 'Front', utilisateurId: '2', operation: 'CREATE' }
    ];
    const mockResponse = { total: 2, logs: mockLogs };
    mockLogsService.getLogParPage.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(mockLogsService.getLogParPage).toHaveBeenCalledWith(1, 10);
    expect(component.logs).toEqual(mockLogs);
    expect(component.totalLogs).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should handle errors when fetching logs', () => {
    mockLogsService.getLogParPage.and.returnValue(throwError(() => new Error('Network error')));

    component.ngOnInit();

    expect(component.logs).toEqual([]);
    expect(component.totalLogs).toBe(0);
    expect(component.loading).toBeFalse();
  });

  it('should update logs when the page changes', () => {
    const mockLogs: Log[] = [{ message: 'Test log 1', type: 'INFO', application: 'Front', utilisateurId: '1', operation: 'READ' }];
    const mockResponse = { total: 1, logs: mockLogs };
    mockLogsService.getLogParPage.and.returnValue(of(mockResponse));

    component.onPageChange(2);

    expect(component.page).toBe(2);
    expect(mockLogsService.getLogParPage).toHaveBeenCalledWith(2, 10);
    expect(component.logs).toEqual(mockLogs);
    expect(component.totalLogs).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('should calculate the total number of pages correctly', () => {
    component.totalLogs = 25;
    component.itemsPerPage = 10;

    expect(component.totalPages).toBe(3);
  });

  it('should return 0 total pages when totalLogs is 0', () => {
    component.totalLogs = 0;
    component.itemsPerPage = 10;

    expect(component.totalPages).toBe(0);
  });
});
