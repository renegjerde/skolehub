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

## Værmelding på startsiden

Værkortet viser timeprognosen for et fast punkt ved Paradis i Bergen. Det henter temperatur, værtype, nedbørssannsynlighet og vind fra Open-Meteo med MET Nordic-værmodell, bruker tidssonen Europe/Oslo og oppdateres automatisk hvert 30. minutt. Trykk på værkortet for detaljer. Værdata er en modellprognose for området, ikke en lokal måling på skolebygget. Tjenesten krever internettilgang. Kilde: [Open-Meteo](https://open-meteo.com/en/docs/metno-api).

## Data og begrensninger i denne versjonen

- Appene er beholdt som separate moduler og vises inne i SkoleHub. Den felles portalen gir felles navigasjon og et samordnet visuelt uttrykk.
- KaffeStatus kan kobles til Supabase for felles status og sanntidsoppdatering. Uten Supabase-konfigurasjon kjører appen i lokal testmodus.
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

SkoleHub 1.1.0 · Live timevær for Paradis, Bergen.


## Versjon 1.1.0
- KaffeStatus oppdaterer statusvisningen umiddelbart ved knappetrykk, før lagring, lyd og haptikk.
- Lagt til synkronisering mellom åpne faner i samme nettleser på samme enhet.
- Merk: Synkronisering mellom forskjellige ansatte/enheter krever en felles backend/databaseløsning.


## Koble KaffeStatus til Supabase (gratisnivå)

1. Opprett et prosjekt hos [Supabase](https://supabase.com/) på Free-planen. Velg en EU-region, for eksempel Stockholm (`eu-north-1`) dersom den tilbys for prosjektet.
2. Åpne **SQL Editor** i Supabase og kjør hele filen `apps/kaffestatus/supabase-schema.sql`.
3. Finn prosjektets **Project URL** og **publishable key** i prosjektinnstillingene / API Keys.
4. Åpne `apps/kaffestatus/supabase-config.js` og erstatt plassholderne med Project URL og publishable key.
5. Publiser hele SkoleHub-mappen til GitHub Pages på nytt.
6. Åpne KaffeStatus på to ulike enheter. Endre status på den ene og kontroller at den andre oppdateres.

**Viktig:** Bruk bare `publishable`-nøkkelen (eller eldre `anon`-nøkkel) i nettleseren. Aldri legg `secret` eller `service_role`-nøkkel i GitHub-repositoryet. SQL-oppsettet slår på Row Level Security, gir nettleseren lesetilgang og lar statusendringer gå gjennom en begrenset databasefunksjon.

### Hva KaffeStatus lagrer

Den delte databasen inneholder bare:
- Statuskode (`FRESH`, `YES` eller `NO`).
- Servergenerert tidspunkt.
- De åtte siste statusendringene.

Fritekstnotatet er fjernet fra KaffeStatus for å unngå at ansatte utilsiktet legger inn navn eller andre personopplysninger. Det lagres ikke navn, e-post, ansatt-ID, brukerprofil eller innloggingskonto i KaffeStatus.

**Personvernforbehold:** Dette beskriver feltene appen selv sender til databasetabellene. Nettverks- og skytjenester kan likevel behandle tekniske metadata, for eksempel IP-adresse og tjenestelogger. IP-adresser kan være personopplysninger. Skoleeier/IT må derfor vurdere Supabase, databehandleravtale, region, GitHub Pages-publisering og behandlingsgrunnlag før løsningen tas i ordinær bruk. En offentlig GitHub Pages-side og en offentlig publishable key betyr også at alle som kjenner nettadressen i utgangspunktet kan lese og endre kaffestatusen; dette er ikke en ansattbegrenset løsning.

### Gratisnivåets begrensninger

Supabase Free koster 0 USD innenfor kvotene, men prosjekter med for lite databaseaktivitet kan settes på pause etter omtrent sju dager. Gratisnivået har også begrensninger på lagring, trafikk og Realtime-kapasitet, og inkluderer ikke automatiske databasebackuper. Se [Supabase-priser](https://supabase.com/pricing) og [dokumentasjonen om automatisk pause](https://supabase.com/docs/guides/platform/free-project-pausing) før løsningen tas i bruk som kritisk infrastruktur.

