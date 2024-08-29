


L'application (App) est découpée en plusieurs "sections" qui correspondent aux partie fonctionnelles de l'App (ou contexte applicatif).
Les noms de ces sections sont listés en tant que variable d'envirionement.

Les personnes listée dans l'App Back sont classée en 2 categories : 
    - les membres : comprennant les adherents, bénévoles, hebergeurse, etc
    - les beneficiaires : les personnes demandant les services de l'association (mineurs, famille etc)
On peut differencier les types de personnes via le champ type, qui prend le nom des sections (par exemple les personnes dans les familles seront des beneficiares avec un type famille )


Evenements : chaque personne a des evenemnt liés (visite med, hebergement, accouchement etc) ces event peuvent aussi suivre lesmodifs des champs => a venir


Droits ---------------------------

Les droits des utilisateurs sont structuré autour de profil donnant acces aux differentes sections de l'App
Chaque profil a un tableau de droits presentant les droits d'acces pour chaque section. Chaque droit possible est materialisé par une lettre, une combinaison de lettre donne droit a un acces. 
a = admin, r = lecture (read), w = ajout (write), c = modification (change), d = suppression (delete)
Un admin a accces a tout par defaut
La liste des droits d'acces possible est listée en tant que variable d'environnement.
Par exemple la combinaison "rwc" donne droit à a la lecture, ecriture, modification mais pas à la suppresion 


Les antennes------------------------




Referentiels--------------------------

Ce sont les listes globale ou specifiques aux sections (comme les pays, les statuts etc). Si globale ils sont accessibles via la route globale, sinon il faut utiliser les routes pour chaque section




Nouvel utilisateur ------------------
création possible via : 

    Via volet admin

    Via la page d'enregistement

    Cas du premier utilisateur (initialisation)



Volet inititalisation-----------------