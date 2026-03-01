# Felhőalapú elosztott rendszerek laboratórium (BMEVIIIMB12) házi feladat
## Fényképalbum alkalmazás

### Alkalmazás célja
Az alkalmazás fényképek feltöltését, törlését, listázását, és megnézését teszi lehetővé. Az adatok módosítása csak regisztrált és bejelentkezett felhasználóknak engedélyezett.

### Alkalmazás indítása
Adjuk ki a következő parancsot projekt gyökérkönyvtárából: `npm run dev`

### Alkalmazás felépítése

Az alkalmazás a Node.js alapú Nuxt keretrendszert alkalmazza. Ez egy fullstack web keretrendszer amely a Vue nézetoldali javascript keretrendszert bővíti ki.

Bővebben a Nuxt-ról: https://nuxt.com/

Bár egy fullstack keretrendszerről van szó, a szerveroldali (`/server` könyvtár) és a nézetoldali (`/app` könyvtár) részek jól elkülönülnek. A szerveroldalon határozhatjuk meg a hívható végpontokat mellyekkel adatot szolgáltathatunk a nézetoldalnak. Esetünkben az autentikáció (`/server/api/auth.post.ts`), a fájlok listázása (`/server/api/records`), a fájlok adatának letöltése (`/server/api/files`), illetve a fájlok tárolása (`/server/utils/store.ts`) került megvalósításra szerveroldali szolgáltatásként.

A nézetoldal megvalósítása moduláris. A program belépési pontja az `/app/app.vue` fájl, de valójában a `/app/pages/index.vue` fájl tartalmazza az alapértelmezetten betöltött oldalt, ami egy regisztráló és bejelentkező felület. A másik oldal ahova el tudunk navigálni az a fényképek listázását és kezelését megvalósító oldal (`/app/pages/dashboard.vue`). Az `/app` könyvtár többi része a nézetoldali kód ismétlődését hivatott elkerülni a program moduláris, újrafelhasználható részekre bontva. Az `/app/components` könyvtár felületi elemeket tartalmaz, például egy listaelem vagy a fájlfeltöltési form definícióját. A különböző `.ts` fájlokban pedig a nézetoldali interaktív logika ismétlődő részeit szervezhetjük ki, például esetünkben a sötét/világos témák közötti váltást, vagy a bejelentkezési token ellenőrzését megvalósító kódot.

A bejelentkezés felhasználónév és jelszó megadása és ellenőrzése után egy szerveroldalról küldött token segítségével történik, mely cookie-ként lesz elmentve a későbbi kérések autentikálására.
