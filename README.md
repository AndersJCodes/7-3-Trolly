# Individuell examinationsuppgift - Trello

Min målsättning för uppgiften är VG. För det har jag fokuserat på:

- En förhoppningsvis genomtänkt validering och felhantering
- Skapat modell för Board (det du exemplifierat med projekt).
- Implementerat autentisiering med JWT
- Implementerat hashing och salting

## Teoretisk resonemang

### Motivation för val av databas

Efter att ha gjort en del sök kring vad den riktiga Trello använder bestämde jag mig för att använda MongoDB. Enligt en artikel jag läste så har mongoDB hjälpt trello att effektivt optimera sina datahämtningar. För mig, sähär i efterhand hade jag hellre använt en vanlig relationsdatabas. Det hade gjort det lättare för mig att hantera hämtningar eftersom jag då enklare hade kunnat hantera min databas då det är starka relationer mellan både tasks, users och projekt/boards. Nu behöver jag ägna mycket tanke åt att definiera mina relationer då jag så långt som möjligt ville undvika relationer. Eftersom valen är desto fler, blir det också mer komplext att hantera med olika relationsalternativ.

Min beslut resulterade i att users bara känner till sina users, att boards känner till boards och users knutna till boardsen och att tasks känner till vilka boards de är knutna till samt vilken användare som är kopplad till respektive task. Det skapar en så kallad parent referens hos tasks, vilket gör att jag undviker att duplicera information, men som å andra sidan gör mina hämtningar lite mer stökiga eftersom jag måste gå via tasks för att fylla mina boards.

Hade jag gjort detta igen hade jag jobbat men en child referens i min Board, jag tror det hade blivit enklare. Då hade jag också kunnat använda mig av populate. Eftersom boards ändå förmodligen inte kommer ha tusentals tasks tror jag detta fungerat bra.

Allra helst hade jag nog använt en relationsdatabas

### Redogör vad de olika teknikerna (ex. verktyg, npm-paket, etc.) gör i applikationen

- Mongoose: Ett objekt-datamodelleringsbibliotek (ODM) för MongoDB, som gör det enklare att hantera databasen med JavaScript/TypeScript.
- Express: Ett webbramverk för Node.js, används för att bygga RESTful API.
- Jsonwebtoken: Används för att skapa och verifiera JSON Web Tokens för autentisering. Det verkar som det finns ett nyare sätt att att hantera detta på som heter Auth0, men jag valde att använda detta som jag redan kunde hantera.
- Bcrypt: Används för att hasha(skapa en oegenkänlig sträng, det gör det i pricip omöjligt att återställa det ursrprungliga lösenordet för någon annan) och kontrollera lösenord på ett säkert sätt.
- Express-validator: Validerar och sanerar användarindata för att säkerställa att de följer förväntat format. Är det som ligger till grund för valideringen som är gjord i middleware.
- Cors: Ett middleware för att hantera Cross-Origin Resource Sharing, vilket tillåter externa resurser att göra anrop till din server. Det är ett sätt som används för att förhindra cross site scripting och andra typer av attacker.
- Dotenv: Laddar miljövariabler från en .env-fil för att hålla känslig data, som API-nycklar, utanför källkoden.

För utveckling använder jag också följande:

- Typescript hjälper oss att typa data i javascipt som annar är ett otypat programmeringsspråk. Det gör felhantering betydligt enklare, särskilt i större applilationer där det ofta är variablerna som ställer till det.I samband med att man genererar koden körs yypeScript-kompilatorn, som översätter TypeScript-kod till JavaScript.
- Till typeskript har jag också hämtat in en uppsättning typer för respektive paket som används.
  Vidare använder jag tsx för att kunna köra koden under utveckling med typescript och för att slippa att ständigt starta om appen, något som tsx sköter automatiskt.

### Redogör översiktligt hur applikationen fungerar

Appen startas via index.ts som anropar db-filen som kopplar ihop appen med databasen. Via routers/endpoints skapas ett restapi som utgörs av webbadresser som anropas för att ta emot och förändra data i databasen. Datan som kommer in haneras av validerare för att säkerställa att den användardata som kommer in uppfyller vissa kriteroer. Kontrollerfilerna sköter själva logiken och utgör ytterligare ett kontroll-lager innan datan skickas in i databasen. formaterat enligt bestämmelserna i de modeller som mappats upp.

Däremellan finns också några andra funktioner som hashing, login,och autentisiering som ytterligare stärker upp säkerheten eller på andra sätt förenklar koden.

Det finns mer saker jag kunnat utveckla ytterligare, men p¨det stora hela har jag en fungerande och förhållanadevis säker app, med tanke på omfattningen av kursen.
