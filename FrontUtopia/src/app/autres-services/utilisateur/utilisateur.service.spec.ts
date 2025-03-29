// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { UtilisateurService } from './utilisateur.service';
// import { LoggerService } from '../logger/logger.service';
// import { Utilisateur } from './utilisateur';
// import { Antenne } from 'src/app/gestionApp/interfaces/antenne';
// import { Autorisations } from 'src/app/gestionApp/interfaces/autorisations';
// import { Droit } from 'src/app/admin/gestion-profil/profil';

// describe('UtilisateurService', () => {
//   let service: UtilisateurService;
//   let httpMock: HttpTestingController;
//   let loggerServiceMock: jasmine.SpyObj<LoggerService>;

//   beforeEach(() => {
//     loggerServiceMock = jasmine.createSpyObj('LoggerService', ['handleError']);

//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [
//         UtilisateurService,
//         { provide: LoggerService, useValue: loggerServiceMock }
//       ]
//     });

//     service = TestBed.inject(UtilisateurService);
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should fetch a utilisateur by id', () => {
//     const mockUtilisateur: Utilisateur = { id: '1', nom: 'Test User' }; // Remplacez par les propriétés réelles de l'utilisateur

//     service.getUtilisateur('1').subscribe((utilisateur) => {
//       expect(utilisateur).toEqual(mockUtilisateur);
//     });

//     const req = httpMock.expectOne(`${service['utilisateurUrl']}/1`);
//     expect(req.request.method).toBe('GET');
//     req.flush(mockUtilisateur);
//   });

//   // it('should fetch all utilisateurs', () => {
//   //   const mockUtilisateurs: Utilisateur[] = [
//   //     { _id: '1', nom: 'Test User 1' },
//   //     { _id: '2', nom: 'Test User 2' }
//   //   ];

//   //   service.getAll().subscribe((utilisateurs) => {
//   //     expect(utilisateurs.length).toBe(2);
//   //     expect(utilisateurs).toEqual(mockUtilisateurs);
//   //   });

//   //   const req = httpMock.expectOne(`${service['utilisateurUrl']}/getAll`);
//   //   expect(req.request.method).toBe('GET');
//   //   req.flush(mockUtilisateurs);
//   // });

//   it('should add a utilisateur', () => {
//     const mockUtilisateur: Utilisateur = { id: '1', nom: 'Test User' }; // Propriétés réelles de l'utilisateur

//     service.addUtilisateur(mockUtilisateur).subscribe((utilisateur) => {
//       expect(utilisateur).toEqual(mockUtilisateur);
//     });

//     const req = httpMock.expectOne(service['utilisateurUrl']);
//     expect(req.request.method).toBe('POST');
//     expect(req.request.body).toEqual(mockUtilisateur);
//     req.flush(mockUtilisateur);
//   });

//   it('should update a utilisateur', () => {
//     const mockUtilisateur: Utilisateur = { id: '1', nom: 'Updated User' };

//     service.updateUtilisateur(mockUtilisateur).subscribe((utilisateur) => {
//       expect(utilisateur).toEqual(mockUtilisateur);
//     });

//     const req = httpMock.expectOne(service['utilisateurUrl']);
//     expect(req.request.method).toBe('PUT');
//     expect(req.request.body).toEqual(mockUtilisateur);
//     req.flush(mockUtilisateur);
//   });

//   // it('should delete a utilisateur', () => {
//   //   const mockUtilisateur: Utilisateur = { _id: '1', nom: 'Test User' };

//   //   service.deleteUtilisateur('1').subscribe((utilisateur) => {
//   //     expect(utilisateur).toEqual(mockUtilisateur._id);
//   //   });

//   //   const req = httpMock.expectOne(`${service['utilisateurUrl']}/1`);
//   //   expect(req.request.method).toBe('DELETE');
//   //   req.flush(mockUtilisateur);
//   // });

//   it('should check section access', () => {
//     service.accesSection('testSection').subscribe((access) => {
//       expect(access).toBeTrue();
//     });

//     const req = httpMock.expectOne(`${service['selfUtilisateurUrl']}/accesSection/testSection`);
//     expect(req.request.method).toBe('GET');
//     req.flush(true);
//   });

//   it('should get antennes', () => {
//     const mockAntennes: Antenne[] = [{ _id: '1', nom: 'Antenna 1' }];

//     service.getAntennes().subscribe((antennes) => {
//       expect(antennes.length).toBe(1);
//       expect(antennes).toEqual(mockAntennes);
//     });

//     const req = httpMock.expectOne(`${service['selfUtilisateurUrl']}/antennes/`);
//     expect(req.request.method).toBe('GET');
//     req.flush(mockAntennes);
//   });

//   it('should change default antenne', () => {
//     const mockAntenne: Antenne = { _id: '1', nom: 'Default Antenna' };

//     service.changeAntenneDefaut('1').subscribe((antenne) => {
//       expect(antenne).toEqual(mockAntenne);
//     });

//     const req = httpMock.expectOne(`${service['selfUtilisateurUrl']}/antenneDefaut`);
//     expect(req.request.method).toBe('POST');
//     expect(req.request.body).toEqual({ nouvelleAntenneId: '1' });
//     req.flush(mockAntenne);
//   });

//   it('should check if user is admin', () => {
//     service.isAdmin().subscribe((isAdmin) => {
//       expect(isAdmin).toBeTrue();
//     });

//     const req = httpMock.expectOne(`${service['selfUtilisateurUrl']}/isAdmin`);
//     expect(req.request.method).toBe('POST');
//     req.flush(true);
//   });
// }
//   // it('should get droits', () => {
//   //   const mockDroits: Droit = { droits: ['lecture', 'ajout'] }; // Propriétés réelles des droits
//   //   const expectedAutorisations: Autorisations = {
//   //     section: 'testSection',
//   //     lecture: true,
//   //     ajout: true,
//   //     modification: false,
//   //     suppression: false,
//   //     admin: false,
//   //   };

// //     service.getDroits('testSection').subscribe((autorisations) => {
// //       expect(autorisations).toEqual(expectedAutorisations);
// //     });

// //     const req = httpMock.expectOne(`${service['selfUtilisateurUrl']}/droits/testSection`);
// //     expect(req.request.method).toBe('GET');
// //     req.flush(mockDroits);
// //   });
// // });
