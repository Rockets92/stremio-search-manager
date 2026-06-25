# Ricerca Riordinata per Stremio

Un addon personale che mostra le righe della ricerca **nell'ordine che decidi tu**, senza
toccare l'ordine della Home. I risultati arrivano sempre dalle fonti originali: questo addon
fa solo da "direttore d'orchestra" che le mette in fila come vuoi.

Tutto avviene in **una sola pagina**: accedi una volta, arriva la lista dei tuoi addon,
riordini le righe, e un pulsante toglie i doppioni dagli originali e installa l'addon
riordinato.

---

## 1. Pubblicarlo su Cloudflare Pages (gratis)

Serve un account Cloudflare (gratuito). Due modi:

### Modo A - Caricamento diretto (il più semplice)
1. **dash.cloudflare.com → Workers & Pages → Create → Pages → Upload assets**.
2. Trascina **il contenuto di questa cartella** (i file, non la cartella che li contiene).
3. Dai un nome al progetto e premi **Deploy**.
4. Otterrai un indirizzo tipo `https://tuo-progetto.pages.dev`.

### Modo B - Da repository Git
1. Carica questi file in un repo GitHub/GitLab.
2. Cloudflare: **Create → Pages → Connect to Git**, scegli il repo.
3. Build command: *(vuoto)* · Output directory: `/`.
4. **Deploy.**

Le Functions nella cartella `functions/` si attivano in automatico, non serve configurarle.

---

## 2. Usarlo (una pagina sola)

Apri `https://tuo-progetto.pages.dev/`:

1. **Accedi** con email/password Stremio (oppure incolla una AuthKey).
2. Arriva la lista dei tuoi addon, già divisa in **righe** cercabili. Riordinale con ↑ ↓,
   rinominale, spegni quelle che non vuoi.
3. Dai un nome all'addon, **Scarica il backup**, poi premi **Applica e installa**.
4. Riavvia Stremio.

Il pulsante fa due cose insieme: toglie la ricerca agli addon originali (così niente righe
doppie) e installa il tuo addon riordinato nella collezione. La Home resta identica.

---

## Note importanti

- **Reversibile.** Per riattivare la ricerca su un addon, reinstallalo dal suo URL originale,
  oppure ripristina dal backup scaricato (file JSON della tua collezione di prima).
- **Addon protetti.** Quelli ufficiali (es. Cinemeta) non si possono modificare: se uno è tra
  le tue fonti, la sua riga di ricerca resterà nella posizione decisa da Stremio. La pagina te
  lo segnala.
- **Aggiornamenti.** Se reinstalli/aggiorni un addon a cui avevi tolto la ricerca, la ricerca
  gli "torna": ripassa dalla pagina e riapplica.
- **Privacy.** Email/password (o AuthKey) restano nel tuo browser e parlano solo con l'API
  ufficiale di Stremio (`api.strem.io`). Non passano da Cloudflare né vengono salvate.
- **Niente database.** L'ordine è codificato nell'URL stesso dell'addon. Se rifai la procedura
  con un ordine diverso, il vecchio aggregatore di questo dominio viene sostituito in automatico.

## Struttura dei file
```
.
├── functions/[[path]].js   backend: manifest + proxy ordinato della ricerca
├── index.html              l'unica pagina: accesso, riordino, applica+installa
├── style.css               stile
├── _routes.json            instradamento statico vs Functions
└── README.md               questo file
```
