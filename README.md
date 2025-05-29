## Zadání k pohovoru (Next.js + TypeScript)
Cílem zadání není ani tak finální funkční výsledek, jako spíše prověřit vaši schopnost kriticky uvažovat, strukturovaně komunikovat a ukázat, že skutečně rozumíte principům použitého kódu. Sledujeme, jak přistupujete k rozdělení úkolu, jak formulujete dotazy, vysvětlujete své rozhodnutí a reagujete na případné komplikace – to vše je pro nás cennější než dokonalý „hotový“ komponent.

### Naklonujte repozitář
   ```bash
   git clone https://github.com/impact-solutions-dev/interview-nextjs.git
   cd interview-nextjs
   npm install
   ```

### Vytvořte komponentu `InfiniteList`
   * Tech stack: Next.js, TypeScript
   * Využijte React hooks (např. `useState`, `useEffect`) a `fetch` nebo `axios` pro získávání dat.

### API endpoint
   * **URL**: `/api/items?page=<číslo stránky>`
   * **Parametry**:
     * `page` (number) – číslo stránky, výchozí 1
   * **Response** (JSON):
     ```ts
     {
       items: any[];           // pole položek
       page: number;           // aktuální stránka
       totalPages: number;     // počet všech stránek
       itemsPerPage: number;   // počet položek na stránku (10)
       totalItems: number;     // celkový počet položek (1000)
     }
     ```

### Chování komponenty
   * Po prvním načtení stránky zobrazte `items`.
   * Pod seznamem položek zobrazte tlačítko **„Načíst další“**.
   * Po kliknutí na tlačítko:
     1. Zvýšíte `page` o 1 (pokud `page < totalPages`).
     2. Načtete další stránku (`GET /api/items?page={page}`).
     3. Přidáte nové položky na konec stávajícího seznamu.

### Bonus (volitelně)
   * Dejte tlačítku stav `disabled`, když jste na poslední stránce.
   * Přidejte jednoduchý loading indicator během načítání.
   * Využijte Server Components
