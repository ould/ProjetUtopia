import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';
import { ErreurService } from '../erreur/erreur.service';
import { LogsService } from 'src/app/admin/gestion-logs/logs.service';
import { of } from 'rxjs';

describe('LoggerService', () => {
  let service: LoggerService;
  let erreurServiceMock: jasmine.SpyObj<ErreurService>;
  let logServiceMock: jasmine.SpyObj<LogsService>;

  beforeEach(() => {
    // Créez des mocks pour ErreurService et LogsService
    erreurServiceMock = jasmine.createSpyObj('ErreurService', ['setErreur']);
    logServiceMock = jasmine.createSpyObj('LogsService', ['log', 'logPublic']);

    TestBed.configureTestingModule({
      providers: [
        LoggerService,
        { provide: ErreurService, useValue: erreurServiceMock },
        { provide: LogsService, useValue: logServiceMock }
      ]
    });

    service = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle error and log the message', () => {
    const error = { message: 'Test error message', error: { error: { message: 'Detailed error message' } } };
    const operation = 'Test operation';
    const expectedResult = of(undefined); // En fonction de votre logique, cela peut être un autre résultat

    const result = service.handleError(operation)(error);

    // Vérifiez que setErreur a été appelé avec le message approprié
    expect(erreurServiceMock.setErreur).toHaveBeenCalledWith("Erreur : Veuillez contacter votre administrateur.");

    // Vérifiez que log a été appelé avec le message d'erreur
    expect(logServiceMock.log).toHaveBeenCalledWith(`${operation} failed: ${error.message} ${error.error.error.message}`, 'Erreur', operation);
    
    // Assurez-vous que le résultat est bien ce qui est attendu
    result.subscribe(res => {
      expect(res).toBeUndefined(); // Changez en fonction de votre logique
    });
  });

  it('should log a public message', () => {
    const message = 'Test public log message';
    const operation = 'Test operation';

    // Simulez le comportement de logPublic pour retourner un observable
    logServiceMock.logPublic.and.returnValue(of(null));

    service.log(message, true, operation);

    // Vérifiez que logPublic a été appelé avec les bons arguments
    expect(logServiceMock.logPublic).toHaveBeenCalledWith(message, "Erreur", operation);
  });

  it('should log a private message', () => {
    const message = 'Test private log message';
    const operation = 'Test operation';

    // Simulez le comportement de log pour retourner un observable
    logServiceMock.log.and.returnValue(of(null));

    service.log(message, false, operation);

    // Vérifiez que log a été appelé avec les bons arguments
    expect(logServiceMock.log).toHaveBeenCalledWith(message, "Erreur", operation);
  });
});
