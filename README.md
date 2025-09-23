## Introduction

Ce projet implémente l'autentification JWT sur Angular.

Le backend est géré par l'application dans le dépot suivant :

https://github.com/iliasse-e/spring-security

```
git clone https://github.com/iliasse-e/spring-security.git
```

Lancer le backend :

```
mvn spring-boot:run
```

Si nécessaire, créé de nouveau users dans la base.

## Role de l'intercepteur

Pour chaque requete HTTP, l'intercepteur vérifie si on possède un token (via le service AuthService), et l'ajoute au header (champs Authorization) de la requete.

```typescript
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const auth = inject(AuthenticationService);
  const token = auth.token();

  if (!token) {
    return next(req)
  }

  const headers = new HttpHeaders({
    Authorization: "Bearer " + token
  })

  const newReq = req.clone({
    headers
  })

  return next(newReq)
}
```

## Role du service Auth

Simplement de mettre à jour un état (ex `token`) que l'on récupère le `access-token` à la suite du login.

## Role du local storage

Au lieu de sauvegarder l'état du token dans l'application, on peut le stocker dans le fichier du client, de façon à le récupérer même si la fenetre a été fermée.

```typescript
const token = localStorage.getItem(ACCES_TOKEN);
```

## Enchainer authentification et récupération de l'utilisateur

L'authentification n'implique pas la récupération du `user`, celle ci se fait en deux étapes.

```typescript
this.#http.post(LOGIN_URL, body.toString(), { headers }) // requête pour login
      .pipe(
        tap((res: any) => localStorage.setItem(ACCES_TOKEN, res["access-token"])), // stock le token
        switchMap(() => this.#http.get<User>(PROFILE_URL)), // requête pour récupérer le user
        tap(user => this._user.set(user))
      )
```

## Refresh token

On créé et appelle une méthode permettant de mettre à jour le `access-token`.
Une fois que l'on intercepte une erreur 401, on appelle cette méthode :

```typescript
// Si 401 et utilisateur authentifié
if (error.status === 401 && authService.isAuthenticated()) {
  
  return authService.refreshToken().pipe( // On appelle le service pour refresh le token
    switchMap(() => { // Puis on met à jour le Bearer
      const newToken = localStorage.getItem(ACCESS_TOKEN);
      const newReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${newToken}`
        },
        withCredentials: true
      });
      return next(newReq);
    }),
    catchError(refreshError => {
      authService.logout(); // Optionnel : déconnexion si le refresh échoue
      return throwError(() => refreshError);
    })
  );
}
```

Cette méthode permet de rafraichir le `access-token` via l'envoie du `refresh-token` présent dans les cookies.
Le jeton d'accès se met à jour, et l'on peut de nouveau effectuer des nouvelles requêtes au serveur sans recevoir d'erreur `401`.

Si le `refresh-token` est invalide (car dépassé), alors on `.logout()`, et redirige vers le formulaire de login.
