# Felhőalapú elosztott rendszerek laboratórium (BMEVIIIMB12) házi feladat
## Fényképalbum alkalmazás

### Alkalmazás célja
Az alkalmazás fényképek feltöltését, törlését, listázását, és megnézését teszi lehetővé. Az adatok módosítása csak regisztrált és bejelentkezett felhasználóknak engedélyezett.

### Alkalmazás indítása
Adjuk ki a következő parancsot projekt gyökérkönyvtárából: `npm run start`

### Alkalmazás felépítése

Az alkalmazás a Node.js alapú Nuxt keretrendszert alkalmazza. Ez egy fullstack web keretrendszer amely a Vue nézetoldali javascript keretrendszert bővíti ki.

Bővebben a Nuxt-ról: https://nuxt.com/

Bár egy fullstack keretrendszerről van szó, a szerveroldali (`/server` könyvtár) és a nézetoldali (`/app` könyvtár) részek jól elkülönülnek. A szerveroldalon határozhatjuk meg a hívható HTTP végpontokat mellyekkel adatot szolgáltathatunk a nézetoldalnak. Esetünkben az autentikáció (`/server/api/auth.post.ts`) és a képfájlok kezelése (`/server/api/images`) került megvalósításra szerveroldali szolgáltatásként. A szerveroldalon történik továbbá az AWS felhő által menedzselt adatbázisokkal való kommunikáció, mely egy Postgres adatbázisból (`/server/utils/store.ts`) és egy AWS S3 Bucket-ből áll (`/server/utils/s3.ts`). Előbbibe a felhasználók és a képek metaadatait mentjük, míg utóbbi a képfájlok tárolásáért felelős.

A nézetoldal megvalósítása moduláris. A program belépési pontja az `/app/app.vue` fájl, de valójában a `/app/pages/index.vue` fájl tartalmazza az alapértelmezetten betöltött oldalt, ami a fényképek listázását és kezelését megvalósító oldal. A másik oldal egy regisztráló és bejelentkező felület (`/app/pages/login.vue`). Az `/app` könyvtár többi része a nézetoldali kód ismétlődését hivatott elkerülni a program moduláris, újrafelhasználható részekre bontva. Az `/app/components` könyvtár felületi elemeket tartalmaz, például egy listaelem vagy a fájlfeltöltési form definícióját. A különböző `.ts` fájlokban pedig a nézetoldali interaktív logika ismétlődő részeit szervezhetjük ki, például esetünkben a sötét/világos témák közötti váltást megvalósító kódot.

A bejelentkezés felhasználónév és jelszó megadása és ellenőrzése után egy szerveroldalról küldött token segítségével történik, mely cookie-ként lesz elmentve a későbbi kérések autentikálására, erre a Nuxt keretrendszernek kész megoldása van (`nuxt-auth-utils` modul).
