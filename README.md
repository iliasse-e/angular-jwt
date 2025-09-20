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
