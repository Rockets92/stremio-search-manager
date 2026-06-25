# Ricerca Riordinata per Stremio

Un addon personale che mostra le righe della ricerca **nell'ordine che decidi tu**, senza
toccare l'ordine della Home. I risultati arrivano sempre dalle fonti originali: questo
addon fa solo da "direttore d'orchestra" che le mette in fila come vuoi.

Il progetto è composto da due parti, entrambe servite gratis da Cloudflare Pages:

- **`/` (Ordina)** – aggiungi gli addon tra cui cerchi, li ordini, generi l'URL da installare.
- **`/setup.html` (Disattiva i doppioni)** – toglie la ricerca agli addon originali, così a
  rispondere è solo il tuo addon riordinato. Gli addon restano installati e la Home non cambia.

---

## 1. Pubblicarlo su Cloudflare Pages (gratis)

Ti serve un account Cloudflare (gratuito). Due modi:

### Modo A – Caricamento diretto (il più semplice)
1. Vai su **dash.cloudflare.com → Workers & Pages → Create → Pages → Upload assets**.
2. Trascina **il contenuto di questa cartella** (i file, non la cartella che li contiene).
3. Dai un nome al progetto e premi **Deploy**.
4. Otterrai un indirizzo tipo `https://tuo-progetto.pages.dev`.

### Modo B – Da repository Git
1. Carica questi file in un repo GitHub/GitLab.
2. Su Cloudflare: **Create → Pages → Connect to Git**, scegli il repo.
3. Build command: *(lascia vuoto)* · Output directory: `/` (la radice).
4. **Deploy.**

> Le Functions nella cartella `functions/` vengono attivate da Cloudflare in automatico:
> non serve configurare nulla.

---

## 2. Usarlo

### Passo 1 — Ordina (`https://tuo-progetto.pages.dev/`)
1. Incolla l'URL del manifest di ogni addon che usi (finisce in `/manifest.json`).
   Se non li ricordi, li trovi elencati nel Passo 2 dopo l'accesso.
2. Riordina le righe con le frecce ↑ ↓, rinominale se vuoi, spegni quelle che non ti servono.
3. **Genera URL d'installazione** e premi **Apri in Stremio**.

### Passo 2 — Disattiva i doppioni (`/setup.html`)
1. Accedi con email/password Stremio (oppure incolla una AuthKey).
2. **Scarica il backup** (rete di sicurezza: ripristinabile in qualsiasi momento).
3. Spunta gli addon di cui hai usato le fonti nel Passo 1.
4. **Applica** e riavvia Stremio.

Risultato: nella ricerca vedi solo le tue righe, nell'ordine scelto. La Home resta identica.

---

## Note importanti

- **Reversibile.** Per riattivare la ricerca su un addon, basta reinstallarlo dal suo URL
  originale: Stremio riscarica il manifest completo. Oppure ripristina dal backup scaricato.
- **Addon protetti.** Quelli ufficiali (es. Cinemeta) non si possono modificare: se uno di
  essi è tra le tue fonti, la sua riga di ricerca originale resterà visibile.
- **Aggiornamenti.** Se reinstalli o aggiorni un addon a cui avevi tolto la ricerca, la
  ricerca gli "torna": ripassa dal Passo 2 per quell'addon.
- **Privacy.** Email/password (o AuthKey) vengono usate dal tuo browser per parlare solo con
  l'API ufficiale di Stremio (`api.strem.io`). Non passano da Cloudflare né vengono salvate.
- **Configurazione nell'URL.** Le tue scelte d'ordine sono codificate nell'URL d'installazione
  stesso: non c'è database, niente da mantenere. Se cambi ordine, generi un nuovo URL e
  reinstalli.

## Struttura dei file
```
.
├── functions/[[path]].js   backend: manifest + proxy ordinato della ricerca
├── index.html              interfaccia "Ordina"
├── setup.html              interfaccia "Disattiva i doppioni"
├── style.css               stile condiviso
├── _routes.json            instradamento statico vs Functions
└── README.md               questo file
```
