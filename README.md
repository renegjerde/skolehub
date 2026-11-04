# SkoleHub – samlet verktøykasse for skolen

SkoleHub samler tre eksisterende webapper i én felles portal med et felles visuelt uttrykk inspirert av KaffeStatus:

- **KaffeStatus** – status og siste oppdateringer på pauserommet.
- **InspeksjonsVakt** – personlig inspeksjonsoversikt, ukeplan, favorittvalg og administrasjon av inspeksjonsplan.
- **PausePuls** – aktivitetsbank, filtrering, favoritter, tilfeldig aktivitet, timer og lokal aktivitetsgenerator.

## Kom i gang lokalt

Åpne `index.html` i en nettleser via en lokal webserver. Appene bruker relative filbaner og bør ikke testes ved å åpne enkeltfiler direkte med `file://`.

## Publisering med GitHub Pages

1. Opprett ett nytt GitHub-repository for SkoleHub.
2. Pakk ut ZIP-filen og last opp **alt innholdet** i mappen `SkoleHub` til roten av repositoryet. Mappestrukturen må beholdes.
3. Gå til **Settings → Pages**.
4. Velg **Deploy from a branch**, branch `main` og folder `/ (root)`.
5. Lagre. GitHub viser publiseringsadressen når siden er klar.

Portalen bruker vanlige HTML-, CSS- og JavaScript-filer. Det er ikke nødvendig med Node, byggesteg eller backend for å kjøre de nåværende modulene.

## Viktig før publisering – personvern

`apps/inspeksjon/plan.json` inneholder ansattes navn og informasjon om inspeksjonstid og -område. En statisk GitHub Pages-løsning uten innlogging gir ikke tilgangskontroll til denne informasjonen. **Ikke publiser denne versjonen på en offentlig tilgjengelig adresse før skolen har vurdert og godkjent delingen.** Avklar med skoleeier/IT hvilken publiseringsløsning og tilgangsstyring som er godkjent. Å gjøre selve kildekoderepositoryet privat er ikke alene en garanti for at publisert nettside er skjermet.

## Data og begrensninger i denne versjonen

- Appene er beholdt som separate moduler og vises inne i SkoleHub. Den felles portalen gir felles navigasjon og et samordnet visuelt uttrykk.
- KaffeStatus lagrer status og historikk i `localStorage` på den aktuelle enheten/nettleseren. Data synkroniseres derfor ikke automatisk mellom ansatte eller enheter.
- PausePuls lagrer favoritter lokalt i nettleseren. Aktivitetsgeneratoren lager et lokalt malutkast og er ikke koblet til en AI-tjeneste.
- InspeksjonsVakt laster inspeksjonsplanen fra `apps/inspeksjon/plan.json`. Favorittnavn og endringer gjort i nettleseren lagres lokalt. For å gjøre en ny plan felles må administrator laste ned og publisere oppdatert `plan.json`.
- Det er ingen brukerkontoer, innlogging eller rollebasert administrasjon i denne versjonen.

## Filstruktur

```text
SkoleHub/
├── index.html
├── README.md
├── assets/
│   ├── app.js
│   └── styles.css
└── apps/
    ├── kaffestatus/
│       └── index.html
    ├── inspeksjon/
│       ├── index.html
│       ├── styles.css
│       ├── app.js
│       └── plan.json
    └── pausepuls/
        └── index.html
```

## Versjon

SkoleHub 1.0.0 · Første sammenslåtte versjon.
