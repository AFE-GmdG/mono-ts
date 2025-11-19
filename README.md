# Das perfekte TypeScript-Monorepo: Einrichten, Bündeln und Debuggen mit Vite & VS Code
## Moderne Webentwicklung richtig gemacht
**Autor:** Andreas Friedel \
**Datum:** 19.11.2025

**In diesem Artikel erfahren Sie, wie Sie ein Monorepo mit TypeScript einrichten können. Ein Monorepo ist ein Repository, das aus mehreren einzelnen Teilen (Bibliotheken und Anwendungen) besteht. Jede Bibliothek kann in einem eigenen Git-Subrepository liegen – muss aber nicht. Für unser Vorhaben spielt das keine Rolle.**
- [Inhaltsverzeichnis](#inhaltsverzeichnis)
  - [Achtung](#achtung)
  - [Disclaimer / Haftungsausschluss](#disclaimer---haftungsausschluss)
  - [Voraussetzungen](#voraussetzungen)
  - [Vorteile eines Monorepos](#vorteile-eines-monorepos)
  - [Aber auch Nachteile](#aber-auch-nachteile)
  - [Ziel dieses Artikels](#ziel-dieses-artikels)
- [Los geht's](#los-geht-s)
  - [1. Die Monorepo-Ordnerstruktur erstellen](#1-die-monorepo-ordnerstruktur-erstellen)
  - [2. Erstellung der globalen package.json](#2-erstellung-der-globalen-packagejson)
  - [3. Beispiel Anwendung mit Bibliothek](#3-beispiel-anwendung-mit-bibliothek)
    - [3.1. Initialisierung der Bibliothek](#31-initialisierung-der-bibliothek)
      - [3.1.1 package.json](#311-packagejson)
      - [3.1.2 Source-Code](#312-source-code)
      - [3.1.3 TypeScript-Konfiguration](#313-typescript-konfiguration)
    - [3.2. Initialisierung der Anwendung](#32-initialisierung-der-anwendung)
      - [3.2.1 package.json](#321-packagejson)
      - [3.2.2 Source-Code](#322-source-code)
      - [3.2.3 TypeScript-Konfiguration](#323-typescript-konfiguration)
      - [3.2.4 Ein erster Test](#324-ein-erster-test)
  - [4. Vite als Development Server und Bundler einrichten](#4-vite-als-development-server-und-bundler-einrichten)
    - [4.1 Vite konfigurieren](#41-vite-konfigurieren)
    - [4.2 Die HTML-Datei erstellen](#42-die-html-datei-erstellen)
    - [4.3 Typescript-Konfiguration modifizieren](#43-typescript-konfiguration-modifizieren)
    - [4.4 Den Build testen und den Dev-Server starten](#44-den-build-testen-und-den-dev-server-starten)
  - [5. VS Code Integration (Der Workspace)](#5-vs-code-integration--der-workspace-)
    - [5.1 Die Workspace-Datei](#51-die-workspace-datei)
    - [5.2 Den Workspace verwenden](#52-den-workspace-verwenden)
  - [6. Git - Was wir ignorieren sollten](#6-git---was-wir-ignorieren-sollten)
  - [7. ESLint - Die Style-Polizei](#7-eslint---die-style-polizei)
  - [8. Fazit](#8-fazit)
  - [Was bleibt zu tun](#was-bleibt-zu-tun)

## Achtung
Ein Monorepo ist nicht dasselbe wie eine monolithische Anwendung (Monolith). Ein Monolith ist eine einzelne Anwendung, bei der alle Teile eng miteinander verbunden sind und nicht unabhängig voneinander entwickelt oder bereitgestellt werden können.

## Disclaimer / Haftungsausschluss
Die in diesem Artikel beschriebenen Schritte und Codebeispiele dienen nur zu Demonstrationszwecken, stellen meine persönliche Meinung und Erfahrung dar und sind keine professionelle Beratung. Ich übernehme keine Haftung für Schäden oder Verluste, die durch die Anwendung der beschriebenen Methoden entstehen könnten. Bitte konsultieren Sie bei Bedarf einen Fachmann, bevor Sie Änderungen an Ihren Projekten vornehmen.

Einige der Einstellungen, die ich für VS Code, TypeScript und ESLint verwende, entsprechen möglicherweise nicht Ihren eigenen Präferenzen. Fühlen Sie sich frei, diese nach Ihren Bedürfnissen anzupassen. Ich für meinen Teil bevorzuge Strings in Double Quotes ("") anstelle von Single Quotes (''). Auch sind meine TypeScript-Codezeilen mit einem Semikolon (;) am Ende versehen. Ich stamme noch aus der Dinosaurier-Ära und bin mit C, C++, Java und C# aufgewachsen, wo dies nicht nur üblich, sondern auch notwendig war.

## Voraussetzungen
Ich setze voraus, dass Sie programmieren können, mit TypeScript und der Webentwicklung vertraut sind sowie Node.js und VS Code installiert haben oder wissen, wie man sie installiert. Ich werde hier nicht auf deren Installation eingehen.

Die Mindestversion von Node.js, die Sie benötigen, ist 14.x. Diese ist jedoch längst End-of-Life und sollte nicht mehr verwendet werden. Ich empfehle daher, die aktuelle LTS-Version zu verwenden. Zum Zeitpunkt der Erstellung dieses Artikels ist das Version 24.11.x. Zudem empfehle ich die Verwendung von nvm (Node Version Manager), um verschiedene Node.js-Versionen auf Ihrem System zu verwalten. Dies ist jedoch rein optional.

Als Node Package Manager verwende ich in diesem Artikel `yarn`. Sie können jedoch auch `npm` oder `pnpm` verwenden, die Befehle sind ähnlich. Yarn ist meine bevorzugte Wahl - es war eine ganze Zeit lang der schnellste Kandidat. Ich habe keine Ahnung, ob dies immer noch zutrifft – never change a running system...

## Vorteile eines Monorepos
Hier sind einige Vorteile, welche Ihnen ein Monorepo bieten kann:
- **Zentrale Verwaltung**: Alle Projekte befinden sich in einem einzigen Repository oder in Subrepositories, was die Verwaltung und Koordination erleichtert.
- **Dieselben Regeln für alle Projekte**: Sie können gemeinsame Konfigurationen und Code-Stilrichtlinien für alle Projekte festlegen.
- **Wiederverwendbarkeit**: Gemeinsame Bibliotheken können von mehreren Projekten genutzt werden, was die Code-Duplizierung reduziert.

## Aber auch Nachteile
Natürlich gibt es auch einige Nachteile:
- **Komplexität**: Die Verwaltung eines Monorepos kann komplexer sein, insbesondere wenn viele Projekte beteiligt sind.
- **Wiederverwendbarkeit**: (Hatten wir das nicht schon bei den Vorteilen?) Gemeinsame Bibliotheken können von mehreren Projekten genutzt werden, was die Code-Duplizierung reduziert. Dies führt aber auch dazu, dass Änderungen an einer gemeinsamen Bibliothek Auswirkungen auf mehrere Projekte haben können.

## Ziel dieses Artikels
In diesem Artikel richten wir ein einfaches Monorepo mit TypeScript ein. Ich lege dabei den Fokus auf die grundlegenden Schritte und Konzepte, die notwendig sind, um ein Monorepo einzurichten und zu verwalten. Wir werden eine einfache Bibliothek und eine Anwendung erstellen, die diese Bibliothek verwendet. Außerdem richten wir einen Workspace ein, legen Linter-Regeln fest, konfigurieren TypeScript und – ganz wichtig – richten VS Code so ein, dass Sie mit F5 die Anwendung direkt aus dem Editor heraus starten und debuggen können.

# Los geht's

## 1. Die Monorepo-Ordnerstruktur erstellen
```txt
mono-ts
├── packages
│   ├── mono-lib
│   │   └── src
│   │       └── index.ts
│   └── mono-app
│       └── src
│           └── app.ts
├── tsconfig.json
├── package.json
└── mono-ts.code-workspace
```
Wir beginnen mit der Erstellung der Ordnerstruktur für unser Monorepo. Der Hauptordner ist das Root-Verzeichnis unseres Monorepos. Es sollte dem Projektnamen entsprechen. Sinnvoll ist außerdem, den Ordner (sowie alle Unterordner) nur mit Kleinbuchstaben und Bindestrichen zu benennen; Leerzeichen und Sonderzeichen sollten vermieden werden, um Probleme mit verschiedenen Betriebssystemen und Tools zu vermeiden. Wir verwenden hier den Namen `mono-ts`.

Ich gehe in diesem Artikel davon aus, dass Sie Ihre Projekte im Ordner `~/git` speichern. Passen Sie den Pfad entsprechend an, wenn Sie einen anderen Speicherort bevorzugen.
```bash
# Für Linux und macOS
cd ~/git
# Alternativ für Windows PowerShell
# cd$env:USERPROFILE\git
mkdir mono-ts
cd mono-ts
```

Innerhalb des `mono-ts`-Ordners erstellen wir die Unterordner für die Packages. In unserem Fall sind das `mono-lib` für die Bibliothek und `mono-app` für die Anwendung. Beide befinden sich im `packages`-Ordner.
```bash
mkdir packages
cd packages
mkdir mono-lib
mkdir mono-app
cd ..
```

## 2. Erstellung der globalen package.json
Im Root-Verzeichnis unseres Monorepos erstellen wir eine `package.json`-Datei. Sie ist der zentrale Ort, an dem wir die Pakete definieren. Nur weil wir einen Ordner mit dem Namen `packages` haben, bedeutet das nicht, dass `npm`, `yarn` oder `pnpm` automatisch wissen, dass es sich um ein Monorepo handelt. Wir müssen dies explizit in der `package.json`-Datei definieren. Dazu dient der Schlüssel `workspaces`.

Am einfachsten ist es, sich eine Standard `package.json` mit dem Befehl `yarn init -y` erstellen zu lassen und diese dann zu bearbeiten. Anschließend editieren wir die Datei wie folgt:
```json
{
  "name": "mono-ts",
  "description": "Monorepo Test Project",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/mono-lib",
    "packages/mono-app"
  ]
}
```
Alternativ können Sie auch Platzhalter verwenden, um alle Unterordner im `packages`-Ordner (nicht rekursiv, sie müssen ein eigenes `package.json` besitzen) automatisch zu erkennen:
```json
{
  // ...
  "workspaces": [
    "packages/*"
  ]
}
```
**Hinweis: Kommentare sind in JSON-Dateien nicht erlaubt. Sie dienen hier nur zur Erläuterung oder verweisen auf unveränderte Abschnitte. Entfernen Sie die Kommentare in Ihrer Version.**

Die Schlüssel `name` und `version` sind Pflichtfelder. `description` ist optional, sollte aber gesetzt werden, um eine kurze Beschreibung des Projekts zu geben.

Der Schlüssel `private` ist sehr wichtig. Er verhindert, dass Sie versehentlich versuchen, Ihr Monorepo als Paket in ein öffentliches Repository wie npm zu veröffentlichen. Mit `yarn` sind Workspaces nur in privaten Projekten erlaubt. Ohne `"private": true` würde `yarn` einen Fehler ausgeben. `npm` würde zwar keine Fehlermeldung ausgeben, aber Sie könnten versehentlich das ganze Monorepo packen.

Die einzelnen Pakete (Bibliothek und Anwendung) setzen in der Regel kein `private`-Flag in ihren jeweiligen `package.json`-Dateien und könnten somit veröffentlicht werden. In diesem Artikel setze ich das Flag trotzdem, da eine Veröffentlichung der Beispielprojekte nicht vorgesehen ist.

## 3. Beispiel Anwendung mit Bibliothek
Nun initialisieren wir die beiden Pakete `mono-lib` und `mono-app`, indem wir in jeden Ordner wechseln und dort jeweils eine `package.json` erstellen.

### 3.1. Initialisierung der Bibliothek

#### 3.1.1 package.json
```bash
cd packages/mono-lib
yarn init -y
```
Die generierte `package.json` bearbeiten wir wie folgt:
```json
{
  "name": "mono-lib",
  "description": "Eine einfache TypeScript-Bibliothek",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "private": true,
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "tsc",
    "clean": "rimraf dist"
  },
  "devDependencies": {
    "rimraf": "^6.0.1",
    "typescript": "^5.9.3"
  }
}

```
Wie schon erwähnt, setze ich hier das `private`-Flag, da ich nicht vorhabe, dieses Paket zu veröffentlichen.

Der Schlüssel `main` gibt den Einstiegspunkt für die kompilierte JavaScript-Datei an, während `types` auf die TypeScript-Deklarationsdatei verweist. Beide Dateien werden nach dem Build im Ordner `dist` erzeugt.

Mit `"type": "module"` aktivieren wir ES-Module. Das ist wichtig, weil wir moderne Features wie `import` und `export` nutzen. Ich richte das Projekt so aus, dass es nur auf modernen Umgebungen läuft. Sämtliche aktuellen Browser können mit ES‑Modulen, privaten Klassenfeldern, `let` und `const` umgehen. Außerdem verzichte ich bewusst auf zusätzliche Transpiler wie Babel – wir leben im Jahr 2025, nicht mehr 2015.

Das `build`-Script im `scripts`-Abschnitt verwendet den TypeScript-Compiler (`tsc`), um den TypeScript-Code zu JavaScript zu kompilieren. Ihn werden wir im Laufe des Artikels noch anpassen. Weitere Scripts wie `test`, `lint` und `clean` fügen wir später hinzu.

Die `typescript`-Abhängigkeit wird als `devDependency` hinzugefügt, da sie nur für die Entwicklung benötigt wird. Einen `dependencies`-Abschnitt gibt es nicht, da die Bibliothek keine Laufzeitabhängigkeiten hat.

`rimraf` ist ein beliebtes und plattformübergreifendes Tool zum Löschen von Dateien und Verzeichnissen. Wir verwenden es, um den `dist`-Ordner vor dem Build zu löschen, damit keine veralteten Dateien zurückbleiben. Ich könnte auch `rm -rf` verwenden, aber das funktioniert nicht auf Windows-Systemen.

#### 3.1.2 Source-Code
Die Bibliothek soll eine einfache Klasse `Greeter` bereitstellen, die ein privates Feld `#name` sowie eine Methode `greet()` besitzt. Diese Klasse wird als Default exportiert.

Ich nutze hier bewusst "neue" Features von JavaScript und TypeScript wie private Felder (mit `#`), Module und Klassen.

Wir erstellen einen `src`-Ordner und fügen zwei TypeScript-Dateien hinzu: `index.ts` und `greeter.ts`.

`greeter.ts`:
```ts
class Greeter {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }

  greet(): string {
    return `Hello, ${this.#name}!`;
  }
}

export default Greeter;
```
`index.ts`:
```ts
export { default as Greeter } from "./greeter";
```

#### 3.1.3 TypeScript-Konfiguration
Nun erstellen wir eine `tsconfig.json`-Datei, im `mono-lib`-Ordner, um die Bibliothek zu konfigurieren:
```jsonc
{
  "compileOnSave": false,

  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "declarationDir": "dist",
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2024",

    "strict": true,
    "allowSyntheticDefaultImports": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": false,
    "noUnusedParameters": true,
    "alwaysStrict": true,

    "forceConsistentCasingInFileNames": true,
    "newLine": "LF",
    "pretty": true,
    "removeComments": true,
    "skipLibCheck": true,
    "lib": [
      "dom",
      "ESNext",
    ],
  },

  "include": [
    "src"
  ],

  "exclude": [
    "dist",
    "node_modules",
  ],
}
```
Was für ein Monster, oder? Keine Sorge, ich werde die wichtigsten Optionen und Entscheidungen kurz erläutern:

Zuerst deaktivieren wir `compileOnSave`, da wir nicht möchten, dass Typescript automatisch kompiliert, wenn wir eine Datei speichern. Dafür verwenden wir später IDE-Eigene Features und die Fähigkeiten des `vite` Development Servers. Versuchen Sie nicht, dieselben Features von miteinander konkurrierenden Tools zu mischen – das führt nur zu Problemen.

Bei den `compilerOptions` legen wir die Quell- und Ausgabeverzeichnisse fest (`rootDir`, `outDir` und `declarationDir`). Wir aktivieren die Generierung von Source Maps, um das Debuggen des kompilierten JavaScript-Codes zu ermöglichen.

Ebenso wichtig für eine Bibliothek ist die Option `declaration`. Sie sorgt dafür, dass TypeScript Definitionsdateien (.d.ts) erstellt, damit konsumierende Projekte unsere Typen kennen. Zusätzlich aktivieren wir `declarationMap`. Das ist ein oft übersehenes Feature, das den Komfort im Monorepo massiv erhöht: Es erlaubt der IDE, bei einem "Go to Definition" direkt zur originalen .ts-Quelldatei der Bibliothek zu springen, anstatt nur in der generierten Deklarationsdatei zu landen.

Wir setzen `moduleResolution` auf `bundler`, da wir einen modernen Bundler (`vite`) verwenden werden. `module` und `target` sind auf moderne Standards gesetzt, wie ich bereits erwähnt habe.

Es folgt ein Abschnitt, welcher strenge Typprüfungen aktiviert, um die Codequalität zu gewährleisten. Es mag Personen geben, die dies als zu restriktiv oder lästig empfinden. Aber glauben Sie mir, es lohnt sich. Je früher Sie Fehler finden, je eher Sie auf Probleme hingewiesen werden, desto besser. Langfristig sparen Sie dadurch Zeit und Nerven.

Am Ende folgen noch ein paar weitere Optionen, die die Konsistenz und Lesbarkeit des Codes verbessern, welche Fehlermeldungen bunt machen und Interoperabilitäten mit verschiedenen Betriebssystemen sicherstellen.

Die `include`- und `exclude`-Abschnitte definieren, welche Dateien und Ordner vom Compiler berücksichtigt bzw. ignoriert werden sollen.

### 3.2. Initialisierung der Anwendung
Für die Anwendung `mono-app`:

Die Anwendung soll die Bibliothek `mono-lib` verwenden, um eine einfache Begrüßungsnachricht anzuzeigen. Dafür erstellen wir eine HTML-Seite sowie eine Typescript-Datei. Auf der Seite wird lediglich ein Text, ein Input-Feld und ein Button angezeigt. Der Benutzer kann im Input-Feld seinen Namen eingeben und durch Klicken des Buttons wird eine Begrüßungsnachricht generiert und angezeigt.

Die Anwendung ist bewusst sehr einfach gehalten, um den Fokus auf die Monorepo-Struktur und deren Konfiguration zu legen.

Beginnen wir mit der `package.json`:

#### 3.2.1 package.json

```bash
cd packages/mono-app
yarn init -y
```
Die generierte `package.json` bearbeiten wir wie folgt:
```json
{
  "name": "mono-app",
  "description": "Eine Webanwendung, die mono-lib verwendet",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "tsc",
    "clean": "rimraf dist"
  },
  "dependencies": {
    "mono-lib": "1.0.0"
  },
  "devDependencies": {
    "rimraf": "^6.0.1",
    "typescript": "^5.9.3"
  }
}
```
**Hinweis: Es werden absichtlich Fehler eingebaut. Dies soll Stolpersteine repräsentieren, auf die Sie auch stoßen könnten. Im Laufe des Artikels zeige ich Ihnen, wie sie diese identifizieren und beseitigen können.**

#### 3.2.2 Source-Code
Damit wir auch was zum Kompilieren haben, erstellen wir den `src`-Ordner mit der `app.ts`.
`app.ts`:
```ts
import { Greeter } from "mono-lib";

const app = document.getElementById("app");
const nameInput = document.getElementById("nameInput");
const greetButton = document.getElementById("greetButton");

if (
  !(app instanceof HTMLDivElement)
  || !(nameInput instanceof HTMLInputElement)
  || !(greetButton instanceof HTMLButtonElement)
) {
  throw new Error("Missing HTML elements");
}

greetButton.addEventListener("click", () => {
  const name = nameInput.value || "World";

  const greeter = new Greeter(name);
  const paragraph = document.createElement("p");
  paragraph.textContent = greeter.greet();

  app.appendChild(paragraph);
});
```
Damit das im `package.json` hinterlegte Build-Script auch funktioniert, müssen wir noch die TypeScript-Konfiguration erstellen.

#### 3.2.3 TypeScript-Konfiguration
Am einfachsten kopieren wir die `tsconfig.json` aus dem `mono-lib`-Ordner in den `mono-app`-Ordner. Die einzigen Anpassungen betreffen die Werte für `declarationDir` und `declaration`. Diese können wir einfach entfernen, da die Anwendung keine Deklarationsdateien benötigt. Der Rest sollte so passen.

#### 3.2.4 Ein erster Test
Für den ersten Test benötigen wir noch keine HTML-Datei. Wir können einfach die Anwendung "manuell" kompilieren und uns das Ergebnis ansehen.

Zuerst installieren wir alle Abhängigkeiten im MonoRepo. dazu können wir ganz einfach im MonoRepo-Root-Verzeichnis `yarn` eingeben. (Ein `yarn install` ist nicht notwendig, install ist der default, wenn kein weiterer Befehl angegeben ist.)
```bash
cd ~/git/mono-ts
yarn
```
Die Ausgabe zeigt dann in etwa Folgendes:
```txt
yarn install v1.22.22
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...
success Saved lockfile.
Done in 2.68s.
```
Zudem sollten wir jetzt ein `node_modules`-Ordner im MonoRepo-Root sehen, sowie zwei weitere in den jeweiligen Package-Ordnern (`mono-lib` und `mono-app`). Hier zeigt sich gleich ein kleiner Vorteil von Monorepos: Abhängigkeiten werden nur einmal im `node_modules`-Ordner im MonoRepo-Root installiert. Die Pakete haben nur den versteckten `.bin`-Ordner, in dem sich ausführbare Scripte befinden. Diese sind oftmals nur Stubs, welche auf die eigentlichen Scripte oder Binärdateien im Root-`node_modules` verweisen. Sie sind sogar "angepasste" Versionen. Zum Beispiel enthält das `tsc`-Script im `mono-ts/packages/mono-lib/node_modules/.bin` den Text
```bash
node  "$basedir/../../../../node_modules/typescript/bin/tsc" "$@"
```
während dasselbe Script in `mono-ts/node_modules/.bin/tsc` die Variante
```bash
node  "$basedir/../typescript/bin/tsc" "$@"
```
enthält.

Auf jeden Fall können wir jetzt die Bibliothek und die Anwendung kompilieren. Auch das sollten wir aus dem MonoRepo-Root-Verzeichnis tun:
```bash
cd ~/git/mono-ts
yarn workspace mono-lib build
yarn workspace mono-app build
```
Dies kann sogar noch vereinfacht werden, indem wir in der `package.json` im MonoRepo-Root ein Script hinzufügen:
```json
{
  // ...
  "scripts": {
    "build": "yarn workspace mono-lib build && yarn workspace mono-app build"
  }
}
```
Nun können wir einfach `yarn build` im MonoRepo-Root ausführen, um beide Pakete zu kompilieren:
```bash
cd ~/git/mono-ts
yarn build
```
Die Ausgabe sollte in etwa so aussehen:
```txt
yarn run v1.22.22
$ yarn workspace mono-lib build && yarn workspace mono-app build
$ rimraf dist
$ tsc
$ rimraf dist
$ tsc
Done in 1.34s.
```
Das Hauptscript führt also nacheinander erst in der Bibliothek und dann in der Anwendung das jeweilige `build`-Script aus. Da in beiden Paketen das `prebuild`-Script definiert ist, wird dieses vor dem jeweiligen `build`-Script automatisch mit ausgeführt. Wir sollten also im `dist`-Ordner der Anwendung jetzt die kompilierte `app.js`-Datei finden. Schauen wir mal rein:
```js
import { Greeter } from "mono-lib";
const app = document.getElementById("app");
const nameInput = document.getElementById("nameInput");
const greetButton = document.getElementById("greetButton");
if (!(app instanceof HTMLDivElement)
    || !(nameInput instanceof HTMLInputElement)
    || !(greetButton instanceof HTMLButtonElement)) {
    throw new Error("Missing HTML elements");
}
greetButton.addEventListener("click", () => {
    const name = nameInput.value || "World";
    const greeter = new Greeter(name);
    const paragraph = document.createElement("p");
    paragraph.textContent = greeter.greet();
    app.appendChild(paragraph);
});
//# sourceMappingURL=app.js.map
```
Im Prinzip wurden hier nur die Leerzeilen entfernt. Hätten wir Variablen mit expliziten Typangaben deklariert, so wären diese entfernt worden - aber das war es dann auch schon.

Allerdings gibt es ein Problem: Der Import von `mono-lib` funktioniert so nicht. Der Browser weiß nicht, wo er das Paket finden soll. (bzw. der Browser würde dem Webserver sagen "Gib mir mal `mono-lib`". Dieser würde im `dist`-Ordner nichts passendes finden und 404 zurückgeben.)

Dieses Problem beheben wir, indem wir einen Bundler verwenden, welcher die Anwendung inklusive aller Abhängigkeiten zusammenpackt. Im nächsten Abschnitt richten wir `vite` ein.

## 4. Vite als Development Server und Bundler einrichten
Vite ist ein moderner Development Server und Bundler, der speziell für moderne Webprojekte entwickelt wurde. Er bietet eine schnelle Entwicklungsumgebung mit Hot Module Replacement (HMR) und optimierte Builds für die Produktion. Die hohe Geschwindigkeit wird dadurch erreicht, dass Vite TypeScript komplett umgeht. Statt jede einzelne der möglicherweise hunderten von Dateien in einem großen Projekt zu transpilieren, alle Typecheckings zu machen und das Ganze zu bündeln werden einfach "nur die Typings" entfernt und die Dateien bleiben größtenteils im Originalzustand. Außerdem wird so gut wie nichts vorab kompiliert, sondern erst, wenn eine Datei tatsächlich benötigt wird. Dies macht Vite extrem schnell, besonders bei großen Projekten.

Dafür müssen wir Vite als DevDependency in unserem Monorepo installieren. (DevDependency, weil es nach einem Production-Build nicht mehr benötigt wird.) Zudem wird es nur in `mono-app` installiert, vite besorgt sich die Bibliotheksabhängigkeit nach `mono-lib` selbst (passende Konfiguration vorausgesetzt). Außerdem wollen wir innerhalb der Konfiguration von Vite auf node Systembibliotheken zugreifen. Typescript Typings für Node erhalten wir mit dem zusätzlichen Paket `@types/node`.

```bash
cd ~/git/mono-ts
yarn workspace mono-app add -D vite @types/node
```

### 4.1 Vite konfigurieren
Anschließend erstellen wir eine `vite.config.ts`-Datei im `mono-app`-Ordner. (Ja, Vite unterstützt auch TypeScript-Konfigurationsdateien. Das bedeutet volles Intellisense und Typsicherheit, selbst in der Konfigurationsdatei.)

`vite.config.ts`:
```ts
import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => ({
  build: {
    target: ["es2024"],
    modulePreload: {
      polyfill: false,
    },
    sourcemap: command === "serve",
  },

  resolve: {
    alias: {
      "mono-lib": path.resolve(__dirname, "../mono-lib/src"),
    },
  },

  esbuild: {
    sourcemap: "inline",
  },

  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    port: 2110,
    strictPort: true,
    open: false,
    cors: true,
    fs: {
      allow: [".."],
    },
  },

  clearScreen: true,

  plugins: [],
}));
```
Gar nicht so kompliziert, oder? Wie immer gehe ich auf alle wichtigen Punkte ein:
- Wir importieren `defineConfig` von Vite, um unsere Konfiguration zu definieren. Vite erwartet einen Default-Export mit dem Ergebnis dieser Funktion.
- Wir importieren das `path`-Modul von Node.js, um Pfade zu handhaben. Mittels path.resolve können wir absolute Pfade erstellen, was bei den Aliasen hilfreich ist. (Siehe unten.)
- Außerdem importieren wir `fileURLToPath` aus dem `url`-Modul von Node.js. Dies ist notwendig, um den aktuellen Verzeichnisnamen (`__dirname`) in einer ES-Modul-Umgebung zu erhalten, da `__dirname` in ES-Modulen nicht automatisch verfügbar ist. Vite _kann_ auch ohne diesen import und der Definition von `__dirname` umgehen, weil es intern eigene Mechanismen hat, um `__dirname` zu emulieren. Allerdings ist es manchmal nützlich zu wissen, wie man das selbst machen muss.

Anschließend exportieren wir das Ergebnis der Funktion `defineConfig`. Diese Funktion nimmt ein Objekt entgegen, das unsere Konfiguration definiert. Vite wird dieses Objekt in seinen internen Abläufen verwenden, um entweder den Development Server zu starten oder aber ein Production-Build zu erstellen.

Im Konfigurationsobjekt haben wir mehrere Abschnitte:

Der `build`-Abschnitt konfiguriert den Build-Prozess. Wir setzen das Ziel auf `es2024` (passend zu unserer TypeScript-Konfiguration) und deaktivieren das Polyfill für `modulePreload`. Moderne Browser können mit ES-Module ohne Polyfills umgehen, der Polyfill würde nur unnötigen Overhead erzeugen und die Ladezeiten verlängern. Zudem aktivieren wir Source Maps nur im Development-Modus (`command === "serve"`), um das Debuggen zu erleichtern. Im Production-Build wollen wir üblicherweise keine Source Maps haben, da sie Projektinternals offenlegen können. Sollten sie dennoch gewünscht sein, kann man `sourcemap` einfach auf `true` setzen.

Ein großer Trick ist der Abschnitt `resolve` mit dem `alias`. Hier definieren wir einen Alias für `mono-lib`, der auf den `src`-Ordner der Bibliothek zeigt. Dadurch wird Vite nicht versuchen, die Buildergebnisse aus dem `dist`-Order der `mono-lib` zu verwenden, sondern nutzt direkt die Quellcode-Dateien. Dies ist besonders im Development-Modus nützlich, da Änderungen an der Bibliothek sofort in der Anwendung reflektiert werden, ohne dass ein separater Build-Schritt erforderlich ist oder der Development Server neu gestartet werden muss.
```ts
import { Greeter } from "mono-lib/";
// oder auch mit Deep Imports
import Greeter from "mono-lib/greeter";
```
verweist jetzt direkt auf die Quellcode-Dateien in `mono-ts/packages/mono-lib/src/`.

Im Abschnitt `esbuild` gehen wir direkt auf den Development-Buildmodus ein. Wir setzen die Art der generierten Source Maps auf `inline`. Dadurch werden in den ausgelieferten JavaScript-Dateien am Ende Kommentare mit den Source Maps eingefügt. Diese ermöglichen es dem Debugger (VS Code oder auch die Browser Developer Tools) die Original Quellcode-Dateien zu finden und anzuzeigen. Auch ohne diesen Eintrag würden aufgrund der im `build`-Abschnitt gesetzten `sourcemap`-Option Source Maps generiert werden. Allerdings sind die Pfade dann falsch. Ich habe extrem lange gebraucht, um herauszufinden, warum die Source Maps nicht funktionierten... (Einfach akzeptieren, dass dieser Abschnitt nötig ist)

Schlussendlich gibt es noch den `server`-Abschnitt, mit dem wir den Development Server konfigurieren. Wir setzen den Host auf `0.0.0.0`. Vite bindet den Server standardmäßig nur an `localhost` (was meistens ok ist), aber wenn sie zum Beispiel vom Handy auf die Webseite zugreifen wollen, dann brauchen sie diese Einstellung. `allowedHosts: true` erlaubt den Zugriff von allen Hosts. Der Port ist auf `2110` gesetzt. Sie können diesen natürlich anpassen. Mit `strictPort: true` wird verhindert, dass Vite automatisch einen anderen Port sucht, wenn der gewünschte Port bereits belegt ist. `open: false` verhindert, dass der Browser automatisch geöffnet wird, wenn der Server startet. Dies erreichen wir an anderer Stelle in VS Code. (Dasselbe Thema wie oben: "Versuchen Sie nicht, dieselben Features von miteinander konkurrierenden Tools zu mischen – das führt nur zu Problemen.")

`cors: true` aktiviert Cross-Origin Resource Sharing (CORS) für den Development Server. Dies ist nützlich, wenn Sie APIs oder Ressourcen von anderen Domains während der Entwicklung ansprechen müssen.

Zu guter Letzt erlaubt die `fs`-Option den Zugriff auf übergeordnete Verzeichnisse. Da sich unsere Bibliothek im übergeordneten Ordner befindet, ist dies notwendig, damit Vite darauf zugreifen kann. Andernfalls würde Vite den Zugriff verweigern und Fehler ausgeben.

### 4.2 Die HTML-Datei erstellen
Vite betrachtet die HTML-Datei `index.html` automatisch als Einstiegspunkt für die Anwendung. Die Quellcode-Datei `app.ts` wird darin referenziert und Vite taucht von dort automatisch in alle abhängigen Dateien und Module ein. Aus einem mir nicht nachvollziehbaren Grund sucht Vite die HTML-Datei standardmäßig im Root-Verzeichnis des Projekts, nicht im `src`-Ordner. Daher legen wir die Datei direkt im `mono-app`-Ordner an. Die Datei dient dabei als Vorlage, es ist nicht die Datei, die später beim Production-Build im `dist`-Ordner landet.

`index.html`:
```html
<!doctype html>
<html lang="en">

<head>
  <base href="/" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>mono-app</title>
  <link href="/assets/favicon.ico" rel="shortcut icon" type="image/x-icon" />
  <script type="module" src="/src/app.ts"></script>
  <style>
    html {
      font-family: "Segoe UI", system-ui, sans-serif;
      font-size: 16px;
    }
  </style>
</head>

<body>
  <div id="app">
    <p>Input your name</p>
    <input id="nameInput" type="text" />
    <button id="greetButton">Greet</button>
  </div>
</body>

</html>
```
Wie bereits erwähnt ist dies eine extrem simple Anwendung. Unser Fokus liegt auf der Monorepo-Struktur und deren Konfiguration, nicht auf eine fancy Webanwendung - Dafür sind Sie verantwortlich.

Wir erstellen ein `app`-Div, mit drei Kind-Elementen: einem Paragraphen mit einer kurzen Anweisung, einem Input-Feld für die Namenseingabe und einem Button, um die Begrüßung auszulösen. Das Script-Tag im Head-Bereich referenziert unsere `app.ts`-Datei als Modul. – Ja, wir referenzieren direkt die TypeScript-Datei! Vite kümmert sich darum, den TypeScript-Code zur Laufzeit zu transpilieren, der Development Server liefert kompiliertes JavaScript an den Browser aus.

Ich habe hier noch einen Favicon-Link eingefügt, um den Umgang mit statischen Assets zu demonstrieren. Sie können eine beliebige `favicon.ico`-Datei im `assets`-Ordner ablegen. – Wo, fragen Sie? Im `mono-app`-Ordner legen wir einen Unterordner `public` an. Dieser wird von Vite automatisch in den `dist`-Ordner kopiert. Er ist perfekt für sämtliche statischen Assets wie Bilder, Favicons, Schriftarten und ähnliches geeignet. Da ich gerne Ordnung in meinen Projekten habe, lege ich darin einen weiteren Unterordner `assets` an, in dem ich dann die `favicon.ico` ablege.
```txt
mono-app
├── public
│   └── assets
│       └── favicon.ico
├── src
│   └── app.ts
└── index.html
```

### 4.3 Typescript-Konfiguration modifizieren
Wenn wir das bisherige Projekt nun in VS Code öffnen, stellen wir ein weiteres Problem fest: Deep imports aus `mono-lib` funktionieren nicht.

Aktuell steht in der `app.ts` folgender Import:
```ts
import { Greeter } from "mono-lib";
```
Das funktioniert, solange die `mono-lib` gebaut wurde und im `dist`-Ordner die `index.d.ts`-Datei vorhanden ist. Wir wollen aber direkt auf die Quellcode-Dateien zugreifen und nicht auf die gebauten Dateien. (Sonst verlieren wir den Vorteil, dass Änderungen in der Bibliothek sofort in der Anwendung reflektiert werden.)

Ändern wir den Import in der `app.ts` wie folgt:
```ts
import Greeter from "mono-lib/greeter";
```
gibt es in VS Code direkt Fehler:

`Das Modul "mono-lib/greeter" oder die zugehörigen Typdeklarationen wurden nicht gefunden. ts(2307)`

Der Grund dafür ist, dass TypeScript nicht weiß, wo es nach dem Modul `mono-lib/greeter` suchen soll. Wir müssen TypeScript denselben Trick beibringen, den wir auch in der `vite.config.ts` angewendet haben. Dafür passen wir die `tsconfig.json`-Datei in `mono-app` an:
```jsonc
{
  "compilerOptions": {
    "outDir": "dist",
    "sourceMap": true,

    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2024",

    "baseUrl": ".",
    "paths": {
      "mono-lib": ["../mono-lib/src"],
      "mono-lib/*": ["../mono-lib/src/*"],
    },

    // ...
  },

  "include": [
    "src",
    "../mono-lib/src"
  ],

  // ...
}
```
Wir entfernen den Eintrag `rootDir`, da dieser verhindern würde, auf `..`-Verzeichnisse zuzugreifen. Stattdessen fügen wir im `include`-Abschnitt den Pfad `../mono-lib/src` hinzu, damit TypeScript auch die Quellcode-Dateien der Bibliothek berücksichtigt.

Zudem fügen wir im `compilerOptions`-Abschnitt die `baseUrl` und `paths`-Einträge hinzu. `baseUrl` wird auf den aktuellen Ordner (`.`) gesetzt, was bedeutet, dass alle relativen Pfade von dort aus aufgelöst werden. In den `paths` definieren wir dann den Alias `mono-lib` und den Deep Import `mono-lib/*`, welche auf die Quellcode-Dateien der Bibliothek verweisen.

Damit wird auch Typescript in die Lage versetzt, Importe und Deep Imports von `mono-lib` aufzulösen.

Wenn Sie mehrere Bibliotheken in Ihrem Monorepo haben, müssen sie für jede Bibliothek entsprechende Pfade definieren – hier und in der Vite-Konfiguration.

### 4.4 Den Build testen und den Dev-Server starten
Nun können wir einen neuen Anlauf nehmen, die Anwendung zu bauen:

Passen wir dafür noch einmal das Build-Script in der `package.json` für die `mono-app` an:
```json
{
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "vite build",
    "clean": "rimraf dist"
  },
}
```
Wir löschen den alten Eintrag `tsc` und ersetzen ihn durch `vite build`. Vite kümmert sich um den gesamten Build-Prozess, inklusive Transpilieren, Bündeln und Optimieren.

Führen wir jetzt aus dem MonoRepo-Root-Verzeichnis den Build-Befehl aus, finden wir im `dist`-Ordner der `mono-app` die gebündelte und optimierte Version unserer Anwendung:
```bash
cd ~/git/mono-ts
yarn build
```
Schauen wir uns das Ergebnis an:
```txt
mono-app
└── dist
    ├── assets
    │   ├── favicon.ico
    │   └── index-CiMW60FP.js
    └── index.html
```
Die `index.html`-Datei entspricht im Wesentlichen unserer Vorlage, allerdings wurden die Script-Tags angepasst, um auf die gebündelte JavaScript-Datei zu verweisen. Die JavaScript-Datei `index-CiMW60FP.js` ist das Ergebnis des Bündelungsprozesses.

Diese Datei enthält den gesamten Code unserer Anwendung sowie alle Abhängigkeiten, einschließlich der `mono-lib`-Bibliothek. Schauen Sie sich gerne den Inhalt an. Auch wenn dieser minimiert und optimiert ist, können Sie dennoch erkennen, wie die verschiedenen Module zusammengefügt wurden.

Um die Anwendung im Development-Modus zu starten, können wir das `dev`-Script in der `package.json` der `mono-app` hinzufügen:
```json
{
  "scripts": {
    "predev": "rimraf dist",
    "dev": "vite",
    "prebuild": "rimraf dist",
    "build": "vite build",
    "clean": "rimraf dist"
  },
}
```
Auch hier habe ich wieder ein `predev`-Script hinzugefügt, um den `dist`-Ordner vor dem Start des Development Servers zu löschen. Dies verhindert Kollisionen mit möglichen alten Buildergebnissen.

Nun können wir den Development Server starten:
```bash
cd ~/git/mono-ts
yarn workspace mono-app run dev
```
oder
```bash
cd ~/git/mono-ts/packages/mono-app
yarn dev
```
Der Server sollte jetzt starten und wir können die Anwendung im Browser unter `http://localhost:2110` aufrufen.

Die Ausgabe in der Konsole ist dann in etwa so:
```txt
$ yarn workspace mono-app run dev
yarn workspace v1.22.22
yarn run v1.22.22
$ rimraf dist
$ vite

  VITE v7.2.2  ready in 151 ms

  ➜  Local:   http://localhost:2110/
  ➜  Network: http://192.168.0.3:2110/
  ➜  Network: http://192.168.157.3:2110/
  ➜  Network: http://172.26.128.1:2110/
  ➜  press h + enter to show help
```
Öffnen wir die URL im Browser, sehen wir unsere einfache Anwendung. Wir können unseren Namen eingeben und auf den "Greet"-Button klicken, um eine Begrüßungsnachricht zu erhalten, die von der `mono-lib`-Bibliothek generiert wird.

## 5. VS Code Integration (Der Workspace)
Wir haben jetzt eine funktionierende Struktur, aber das Handling ist noch etwas mühsam. Wir müssen Terminals öffnen, in Ordner navigieren und Befehle tippen. VS Code bietet mit "Workspaces" (Arbeitsbereichen) eine mächtige Funktion, um genau das zu vereinfachen.

Ein Workspace erlaubt es uns, mehrere Root-Ordner zu definieren (unser Monorepo-Root und die einzelnen Packages), spezifische Einstellungen für dieses Projekt zu erzwingen und – das ist der Heilige Gral – Debugging-Konfigurationen zu teilen.

Erstellen wir im Root-Verzeichnis die Datei `mono-ts.code-workspace`.

### 5.1 Die Workspace-Datei
`mono-ts.code-workspace`
```jsonc
{
  /* ----------------------- */
  /* --- Folders Section --- */
  /* ----------------------- */
  "folders": [
    {
      "name": "mono-app",
      "path": "packages/mono-app",
    },
    {
      "name": "mono-lib",
      "path": "packages/mono-lib",
    },
    {
      "name": "(Root)",
      "path": ".",
    }
  ],
  /* ------------------------ */
  /* --- Settings Section --- */
  /* ------------------------ */
  "settings": {
    // Editor Basics
    "editor.detectIndentation": true,
    "editor.insertSpaces": true,
    "editor.tabSize": 2,
    "files.eol": "\n",
    "files.trimTrailingWhitespace": true,
    "files.insertFinalNewline": true,

    // Clean Explorer: Hide Things we don't care about
    "files.exclude": {
      ".git": true,
      "dist": false, // sometimes useful to see, hide when not necessary
      "node_modules": true, // only clutter
      ".eslint*": false, // todo: See further down in the article
      ".gitignore": false, // todo: See further down in the article
      "*lock.json": true,
      "*.lock": true,
      "*.log": true,
      "packages": true, // Hide the monorepo packages folder itself from the (Root) view
    },

    // TypeScript Settings
    "typescript.preferences.importModuleSpecifier": "project-relative",
    "typescript.preferences.quoteStyle": "double",
    "typescript.suggest.autoImports": false,
    "typescript.suggest.paths": true,
    "typescript.updateImportsOnFileMove.enabled": "never",
    "typescript.format.insertSpaceAfterCommaDelimiter": true,
    "typescript.format.insertSpaceAfterSemicolonInForStatements": true,
    "typescript.format.insertSpaceBeforeAndAfterBinaryOperators": true,
    "typescript.format.insertSpaceAfterKeywordsInControlFlowStatements": true,
    "typescript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions": true,
    "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis": false,
    "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets": false,
    "typescript.format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces": false,
    "typescript.format.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces": false,
    "typescript.format.placeOpenBraceOnNewLineForFunctions": false,
    "typescript.format.placeOpenBraceOnNewLineForControlBlocks": false,
    // JavaScript Settings
    "javascript.preferences.importModuleSpecifier": "project-relative",
    "javascript.preferences.quoteStyle": "double",
    "javascript.format.insertSpaceAfterCommaDelimiter": true,
    "javascript.format.insertSpaceAfterSemicolonInForStatements": true,
    "javascript.format.insertSpaceBeforeAndAfterBinaryOperators": true,
    "javascript.format.insertSpaceAfterKeywordsInControlFlowStatements": true,
    "javascript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions": true,
    "javascript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis": false,
    "javascript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets": false,
    "javascript.format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces": false,
    "javascript.format.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces": false,
    "javascript.format.placeOpenBraceOnNewLineForFunctions": false,
    "javascript.format.placeOpenBraceOnNewLineForControlBlocks": false,
  },
  /* --------------------- */
  /* --- Tasks Section --- */
  /* --------------------- */
  "tasks": {
    "version": "2.0.0",
    "tasks": [
      {
        "label": "Start Vite Server",
        "type": "process",
        "command": "yarn",
        "windows": {
          "command": "yarn.cmd"
        },
        "args": [
          "--cwd",
          "${workspaceFolder:mono-app}",
          "dev",
        ],
        "isBackground": true,
        // Vite Dev Server Problem Matcher
        "problemMatcher": {
          "owner": "vite",
          "pattern": {
            "regexp": "^$"
          },
          "background": {
            "activeOnStart": true,
            "beginsPattern": "VITE",
            "endsPattern": "ready"
          },
        },
        "presentation": {
          "reveal": "silent",
          "panel": "shared",
          "group": "none",
        },
        "promptOnClose": false,
      },
    ],
  },
  /* ---------------------- */
  /* --- Launch Section --- */
  /* ---------------------- */
  "launch": {
    "version": "0.2.0",
    "configurations": [
      {
        "name": "Chrome (Debug mono-app)",
        "type": "chrome",
        "request": "launch",
        // Magic: Start the dev-server automatically before the debug session starts
        "preLaunchTask": "Start Vite Server",
        "url": "http://localhost:2110",
        "webRoot": "${workspaceFolder:mono-app}",
        "sourceMaps": true,
        "skipFiles": [
          "<node_internals>/**",
          "**/node_modules/**",
        ],
        "presentation": {
          "hidden": false,
          "group": "Debug",
          "order": 1,
        },
      },
    ],
    "compounds": [],
  },
}
```
Was passiert hier?

Es gibt mehrere Abschnitte in der Workspace-Datei:
1. **Folders Section**: Anstatt nur den Root-Ordner zu sehen, definieren wir drei logische Ordner. mono-app und mono-lib erscheinen als Top-Level-Einträge im Explorer. Das macht das Arbeiten in tiefen Strukturen viel angenehmer. Den Root-Ordner binden wir als (Root) ebenfalls ein, damit wir Zugriff auf package.json, tsconfig.json etc. haben. Wichtig: In den settings unter files.exclude blenden wir den physischen packages-Ordner aus, um Duplikate in der Ansicht zu vermeiden.
2. **Settings Section**: Hier erzwingen wir Formatierungsregeln für jeden, der diesen Workspace öffnet. Keine Diskussionen mehr über Tabs vs. Spaces!
3. **Tasks Section**: Wir definieren einen Task `Start Vite Server`. Dieser führt im Hintergrund `yarn` aus. Das `problemMatcher`-Feld ist hier auf "Hintergrund" konfiguriert. Es wartet darauf, dass Vite "ready" in die Konsole schreibt, bevor es dem Debugger das "Go" gibt.
4. **Launch Section**: Das ist das Herzstück. Die Konfiguration `Chrome (Debug mono-app)` startet Google Chrome.
  - `preLaunchTask`: Bevor Chrome startet, führt VS Code automatisch unseren Task aus. Wenn der Server schon läuft, erkennt VS Code das und nutzt die laufende Instanz.
  - `webRoot`: Wir sagen dem Debugger, dass die Dateien auf dem Server (`localhost:2110`) physikalisch im Ordner `packages/mono-app` liegen. Dank der Source Maps, die wir in der vite.config.ts und tsconfig.json aktiviert haben, können wir nun Breakpoints direkt in unseren `.ts`-Dateien setzen.

### 5.2 Den Workspace verwenden
**Ausprobieren!**
1. Speichern Sie die Datei.
2. Unten rechts in VS Code erscheint (meistens) ein Button "Workspace öffnen". Falls nicht: `Datei` -> `Arbeitsbereich aus Datei öffnen...`.
3. VS Code lädt neu und die Struktur im Explorer ändert sich.
4. Öffnen Sie `packages/mono-app/src/app.ts` (Jetzt im virtuellen Ordner `mono-app/src/app.ts`).
5. Setzen Sie einen Breakpoint (roter Punkt links neben der Zeilennummer) in der Zeile `const greeter = new Greeter(name);`. Setzen Sie einen weiteren Breakpoint in der `mono-lib/src/greeter.ts` in der Zeile `return `Hello, ${this.name}!`;`.
6. Drücken Sie F5. (Alternativ: Klicken Sie in der Seitenleiste auf das Debug-Symbol und dann auf den grünen Play-Button. Im Dropdown-Menü sollte "Chrome (Debug mono-app)" ausgewählt sein.)

Wenn alles geklappt hat, öffnet sich Chrome. Geben Sie einen Namen ein, klicken Sie auf "Greet" und... **BÄM!** VS Code springt in den Vordergrund, die Ausführung stoppt an Ihrem Breakpoint. Sie können Variablen inspizieren, den Call-Stack prüfen und sogar in die `mono-lib` hinein steppen ("Step Into" oder F11), da wir `declarationMap` aktiviert haben. Selbst Breakpoints in der Bibliothek funktionieren einwandfrei!

Sie entwickeln jetzt in einem Monorepo mit der Leichtigkeit eines Einzelprojekts.

## 6. Git - Was wir ignorieren sollten
Bevor wir uns dem Linter widmen, müssen wir sicherstellen, dass wir unseren Müll nicht mit ins Repository einchecken. Ein sauberes Repo ist ein glückliches Repo.

Erstellen wir eine `.gitignore`-Datei im Root-Verzeichnis. Da wir ein Monorepo haben, reicht in der Regel eine zentrale Datei, die für alle Unterordner gilt.

`.gitignore`:
```txt
# Dependencies
node_modules
.pnp
.pnp.js

# Build output
dist
build
out

# System files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment Variables
.env
.env.local

# Editor directories
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```
**Wichtig:** Ich ignoriere hier den kompletten `.vscode`-Ordner. Unsere Konfiguration und Debugging-Einstellungen sind im Workspace definiert. Einige Plugins und Erweiterungen – oder vielleicht Sie selbst – können im `.vscode`-Ordner personalisierte Konfigurationen hinterlegen, welche nicht mit anderen Teammitgliedern geteilt werden sollten. Nicht jeder verwendet die selben Extensions. Persönliche Einstellungen haben im Git nichts verloren.

## 7. ESLint - Die Style-Polizei
Wir werden eine **Flat Config** für ESLint verwenden. Frühere Versionen von ESLint verwendeten verschiedene, teils zueinander inkombatible Konfigurationsdateien (JSON, YAML, JS). Die `Flat Config` ist eine neuere, modernere Art der Konfiguration, die auf JavaScript-Dateien basiert. Diese ermöglicht es, die Konfiguration in modulare Teile zu zerlegen und diese bei Bedarf zu importieren. Es gibt diverse öffentlich verfügbare Konfigurationspakete an denen man sich bedienen kann. Die Root-Konfigurationsdatei trägt den Namen `eslint.config.js`.
```js
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import stylistic from "@stylistic/eslint-plugin";
import eslintImport from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  jsxA11y.flatConfigs.recommended,
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],

    settings: {
      react: {
        version: "detect",
      },
    },

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [path.resolve(__dirname, "tsconfig.eslint.json")],
        warnOnUnsupportedTypeScriptVersion: false,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      tseslint,
      "@stylistic": stylistic,
      import: eslintImport,
    },

    rules: {
      "array-bracket-spacing": ["error", "never"],
      "comma-dangle": ["error", {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "always-multiline"
      }],
      "comma-spacing": ["error", { "before": false, "after": true }],
      "comma-style": ["error", "last"],
      "dot-location": ["error", "property"],
      "eol-last": ["error", "always"],
      "eqeqeq": ["error", "always", { "null": "ignore" }],
      "max-len": [2, 160, 2, { "ignoreUrls": true }],
      "no-async-promise-executor": "off",
      "no-console": "off",
      "no-debugger": "warn",
      "no-implicit-globals": "error",
      "no-implied-eval": "error",
      "no-labels": "error",
      "no-loop-func": "error",
      "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1 }],
      "no-nested-ternary": "off",
      "no-param-reassign": ["warn", { "props": false }],
      "no-plusplus": "off",
      "no-trailing-spaces": "error",
      "no-underscore-dangle": ["error", { "allow": ["__dirname"], "allowAfterThis": true }],
      "no-var": "error",
      "object-curly-newline": ["error", { "multiline": true, "minProperties": 8, "consistent": true }],
      "prefer-const": "error",
      "space-in-parens": ["error", "never"],
      "space-infix-ops": ["error", { "int32Hint": true }],
      "space-unary-ops": "error",

      "no-unused-vars": "off",
      "tseslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_", "ignoreRestSiblings": true }],
      "no-array-constructor": "off",
      "tseslint/no-array-constructor": "error",
      "no-useless-constructor": "off",
      "tseslint/no-useless-constructor": "error",
      "no-dupe-class-members": "off",
      "tseslint/no-dupe-class-members": "error",
      "default-param-last": "off",
      "tseslint/default-param-last": "error",
      "dot-notation": "off",
      "tseslint/dot-notation": ["error", { allowKeywords: true }],
      "no-empty-function": "off",
      "tseslint/no-empty-function": ["error", { allow: ["arrowFunctions", "functions", "methods"] }],
      "no-magic-numbers": "off",
      "tseslint/no-magic-numbers": ["off", { ignore: [], ignoreArrayIndexes: true, enforceConst: true, detectObjects: false }],
      "no-redeclare": "off",
      "tseslint/no-redeclare": "error",
      "no-unused-expressions": "off",
      "tseslint/no-unused-expressions": ["error", { allowShortCircuit: false, allowTernary: false, allowTaggedTemplates: false }],
      "no-return-await": "off",
      "tseslint/return-await": "error",
      "naming-convention": "off",
      "tseslint/naming-convention": "off",
      "no-return-await": "off",
      "tseslint/return-await": "off",

      "@stylistic/indent": ["error", 2, {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1
        },
        FunctionExpression: {
          parameters: 1,
          body: 1
        },
        CallExpression: {
          arguments: 1
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoredNodes: ["JSXElement", "JSXElement > *", "JSXAttribute", "JSXIdentifier", "JSXNamespacedName", "JSXMemberExpression", "JSXSpreadAttribute", "JSXExpressionContainer", "JSXOpeningElement", "JSXClosingElement", "JSXFragment", "JSXOpeningFragment", "JSXClosingFragment", "JSXText", "JSXEmptyExpression", "JSXSpreadChild"],
        ignoreComments: false
      }],
      "@stylistic/keyword-spacing": ["error", { before: true, after: true, overrides: { return: { after: true }, throw: { after: true }, case: { after: true } } }],
      "@stylistic/lines-between-class-members": ["error", { enforce: [{ blankLine: "always", prev: "*", next: "method" }] }, { "exceptAfterSingleLine": true }],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/require-await": "off",
      "@stylistic/semi": ["error", "always"],
      "@stylistic/no-extra-semi": "error",
      "@stylistic/space-before-blocks": "error",
      "@stylistic/space-before-function-paren": ["error", { anonymous: "always", named: "never", asyncArrow: "always" }],

      "no-throw-literal": "off",
      "@/no-throw-literal": "error",
      "func-call-spacing": "off",
      "@/func-call-spacing": ["error", "never"],

      "import/prefer-default-export": "warn",
    },

    ignores: [
      "node_modules",
      "dist",
      "eslint.config.js",
      "**/*.ref.js",
    ],
  },
];
```
Da wir in dieser Datei einen Verweis auf eine `tsconfig.eslint.json`-Datei haben, müssen wir diese ebenfalls anlegen:
`tsconfig.eslint.json`:
```jsonc
{
  "extends": "./packages/mono-app/tsconfig.json",
  "include": [
    "packages/mono-app/src",
    "packages/mono-app/vite.config.ts",
    "packages/mono-lib/src",
    "eslint.config.js",
  ],
}
```
Diese erbt alle Einstellungen der `tsconfig.json` aus dem `mono-app`-Ordner und überschreibt nur den `include`-Abschnitt. Damit stellen wir sicher, dass auch die ESLint Konfigurationsdatei selbst sowie die Vite-Konfigurationsdatei den Regeln unterliegen.

Dies sind natürlich nur meine persönlichen "Lieblingsregeln", die ich in fast jedem aktuellem Projekt verwende, jeweils mit kleineren Anpassungen. Sie dürfen sich hier natürlich auch gerne selbst austoben!

Für meine Konfiguration benötigen wir ein paar zusätzliche Pakete. Installieren wir diese als DevDependencies im Monorepo-Root:
```bash
cd ~/git/mono-ts
yarn add -D -W eslint typescript @stylistic/eslint-plugin @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-import eslint-plugin-jsx-a11y
```
**Hinweis:** Das `-W`-Flag (oder `--ignore-workspace-root-check`) ist notwendig, da wir im Root-Verzeichnis DevDependencies installieren, was Yarn normalerweise nicht erlaubt.

Fügen wir nun noch ein Lint-Script in der `package.json` des Monorepo-Roots hinzu:
```json
{
  "scripts": {
    "lint": "eslint"
  }
}
```

Ein einfacher Aufruf von `yarn lint` im Root-Verzeichnis wird jetzt den gesamten Quellcode in `mono-app` und `mono-lib` überprüfen. Und Siehe da – es gibt sogar eine Warnung:
```txt
$ yarn lint
yarn run v1.22.22
$ eslint

~/git/mono-ts/packages/mono-lib/src/index.ts
  1:10  warning  Prefer default export on a file with single export  import/prefer-default-export

✖ 1 problem (0 errors, 1 warning)

Done in 1.37s.
```

Ja, wir haben in unserer Bibliothek in der Hauptdatei nur einen einzigen Reexport. Laut unserer Linter-Regeln sollten wir in diesem Fall einen Default-Export verwenden. Das wollen wir für diese Datei aber nicht machen. Wir können die Warnung ignorieren, die Regel lockern oder eine Inline-Ausnahme hinzufügen:
`index.ts`:
```ts
// eslint-disable-next-line import/prefer-default-export
export { default as Greeter } from "./greeter";
```
Ein folgendes `yarn lint` zeigt dann keine Probleme mehr an.
```txt
$ yarn lint
yarn run v1.22.22
$ eslint
Done in 1.39s.
```

Zum Schluss blenden wir noch allen unnützen Clutter im Explorer aus, indem wir in der Workspace-Datei die `files.exclude`-Sektion Anpassen:
```jsonc
    // Clean Explorer: Hide Things we don't care about
    "files.exclude": {
      ".git": true,
      "dist": false, // sometimes useful to see, hide when not necessary
      "node_modules": true, // only clutter
      "*eslint*": true,
      ".gitignore": true,
      "*lock.json": true,
      "*.lock": true,
      "*.log": true,
      "packages": true, // Hide the monorepo packages folder itself from the (Additional Files) view
    },
```

## 8. Fazit
Und Damit haben wir es geschafft! Sie haben soeben ein professionelles, modernes Monorepo von Grund auf neu erstellt.

Lassen Sie uns kurz rekapitulieren, was wir erreicht haben:
1. **Struktur:** Wir haben eine saubere Trennung zwischen Bibliotheken (`mono-lib`) und Anwendungen (`mono-app`).
2. **TypeScript:** Wir haben eine zentrale Konfiguration, die aber flexibel genug ist, um Deep Imports und Pfad-Aliase (`paths`) zu unterstützen.
3. **Vite:** Wir nutzen einen der schnellsten Bundler der Welt, der dank unserer Konfiguration Änderungen in der Bibliothek _sofort_ und ohne manuellen Rebuild in der App anzeigt.
4. **Developer Experience:** Dank des VS Code Workspace können wir mit F5 debuggen, Breakpoints setzen und direkt in den TypeScript-Code der Bibliothek springen.


## Was bleibt zu tun
Dies ist erst der Anfang. Eine solide Basis ist geschaffen, aber ein echtes Projekt lebt von der Weiterentwicklung.

Rumspielen, experimentieren, anpassen. Machen Sie das Setup kaputt. Und das meine ich ernst! Experimentieren Sie mit den Konfigurationen. Passen Sie ihre eigenen Linter-Regeln an oder ändern Sie die Typescript Konfiguration. Fügen Sie weitere Pakete hinzu – vielleicht sogar ein Backend? Eventuell sogar mit Node.js? Geteilte Modelldaten für Front- und Backend? Je mehr Sie ausprobieren, desto sicherer werden Sie im Umgang mit dem Monorepo.

Vielleicht schauen Sie sich als Nächstes **Vitest** an, um Unit-Tests in Ihr Monorepo zu integrieren. Da Vitest die gleiche Konfiguration wie Vite nutzt, ist die Integration ein Kinderspiel. Oder Sie richten eine **CI/CD-Pipeline** mit GitHub Actions ein, die bei jedem Push automatisch prüft, ob `yarn build` noch durchläuft.

Aber für heute: Klopfen Sie sich auf die Schulter. Sie haben die Werkzeuge der Profis gemeistert.

Happy Coding!
