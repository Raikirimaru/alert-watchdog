# alert-watchdog

Module de Surveillance d'Événements et de Gestion des Alertes

## Utilisation 

Pour utiliser le module **alert-watchdog** vous pouvez suivre les étapes ci-dessous :

### 1. Installation

Assurez-vous que Node.js et npm sont installés sur votre système. Si ce n'est pas le cas, rendez-vous sur https://nodejs.org et suivez les instructions pour l'installation.
Assurez-vous d'installer redis car mon colis est basé sur redis. 
Ensuite, dans le répertoire de votre projet, exécutez la commande suivante pour installer le module **alert-watchdog** :

```bash
npm install alert-watchdog
```

### 2. Importation et utilisation

Dans votre code, importez le module **alert-watchdog** à l'aide de la syntaxe require ou import, selon votre version de Node.js et votre configuration de projet :

```javascript
const alertWatchdog = require('alert-watchdog')
```

### 3. Configuration et utilisation

Après avoir importé le module, vous pouvez configurer et utiliser **alert-watchdog** dans votre projet. Vous pouvez utiliser les fonctions et méthodes exposées par le module pour gérer les alertes selon vos besoins spécifiques.

Avant d'utiliser alert-watchdog, assurez-vous de spécifier les paramètres suivants en fonction de votre environnement et d'installer le module dotenv pour spécifier le path de votre fichier .env :

#### 3.1 URL API personnalisées :

Vous devez spécifier l'URL de votre API en déclarant la variable d'environnement **ALERT_WATCHDOG_API_URL** et **ALERT_WATCHDOG_API_URL_ENABLE** une variable booléen :

## . *true* 
pour utiliser **ALERT_WATCHDOG_API_URL** et spécifier l'URL de votre API 
```.env
ALERT_WATCHDOG_API_URL_ENABLE=true
ALERT_WATCHDOG_API_URL=https://api.example.com/endpoint
```
## . *false*
pour utiliser l'url l'api par defaut
```.env
ALERT_WATCHDOG_API_URL_ENABLE=false
ALERT_WATCHDOG_API_URL=
```

### 3.2 Configuration redis :

Vous devez spécifier la configuration de votre base de données Redis en utilisant les variables d'environnement suivantes :

```.env
ALERT_WATCHDOG_REDIS_CONFIG_ENABLED
ALERT_WATCHDOG_REDIS_HOST
ALERT_WATCHDOG_REDIS_PORT
ALERT_WATCHDOG_REDIS_PASSWORD
```

et comme pour l'URL de l'API la variable **ALERT_WATCHDOG_REDIS_CONFIG_ENABLED** est une variable booléen : 

## . *true* 
```.env
ALERT_WATCHDOG_REDIS_CONFIG_ENABLED=true
ALERT_WATCHDOG_REDIS_HOST=127.0.0.1
ALERT_WATCHDOG_REDIS_PORT=6000
ALERT_WATCHDOG_REDIS_PASSWORD=""
```
vous spécifiez vos propres valeurs à redis. 
## . *false*
pour utiliser les valeurs par défaut 

```.env
ALERT_WATCHDOG_REDIS_CONFIG_ENABLED=false
ALERT_WATCHDOG_REDIS_HOST=127.0.0.1
ALERT_WATCHDOG_REDIS_PORT=6379
ALERT_WATCHDOG_REDIS_PASSWORD=''
```

### 3.3 Chemin du log : 

Vous devez spécifier le chemin où les journaux d'erreurs seront stockés. Vous pouvez le faire en utilisant notre configuration log ou en écrivant votre propre code de gestion des journaux. 

## . *true* 
```.env
ALERT_WATCHDOG_LOG_ENABLED=true
ALERT_WATCHDOG_LOG_PATH=/Logs/log-
```
vous specifiez votre variable d'environnement **ALERT_WATCHDOG_LOG_PATH** dans un fichier .env
pour déclarer votre propre valeur 

## . *false*
pour utiliser les valeurs par défaut 

```.env
ALERT_WATCHDOG_LOG_ENABLED=false
ALERT_WATCHDOG_LOG_PATH=
```
Mais si vous voulez utiliser notre config par défaut c'est *true* et dans le cas contraire *false* pour ne pas loguer vos erreurs.

### *Démo*

## processErrors(errors, [options])

#### *options*: Le paramètre options doit être un objet contenant les options de traitement des erreurs. Il peut contenir des propriétés spécifiques pour l'API (api) et la publication/abonnement (pubsub).

    --> options.api: (Facultatif) Si vous souhaitez envoyer les erreurs à une API, vous pouvez inclure cette propriété dans l'objet options. Cette propriété doit être un objet contenant une propriété url qui doit être une chaîne de caractères représentant l'URL de l'API à utiliser pour envoyer les erreurs.

    --> options.pubsub: (Facultatif) Si vous souhaitez utiliser un système de publication/abonnement pour les erreurs, vous pouvez inclure cette propriété dans l'objet options. Cette propriété doit être un objet contenant une propriété channel qui doit être une chaîne de caractères représentant le nom du canal pour la publication/abonnement.


Voici exemple d'utilisation de **catchError** sans options :

```javascript

const alertWatchdog = require('alert-watchdog');


alertWatchdog.catchError(() => {
  null.foo(); 
}).catch(errorData => {
  console.error("Erreur détectée et traitée : ", errorData);
});

alertWatchdog.catchError(() => {
  let arr = new Array(-1);
}).catch(errorData => {
  console.error("Erreur détectée et traitée : ", errorData);
});

alertWatchdog.catchError(() => {
  console.log(x); 
}).catch(errorData => {
  console.error("Erreur détectée et traitée : ", errorData);
});

alertWatchdog.catchError(() => {
  decodeURIComponent('%'); 
}).catch(errorData => {
  console.error("Erreur détectée et traitée : ", errorData);
});

```

Voici exemple d'utilisation de **catchError** avec options :

```javascript

const alertWatchdog = require('alert-watchdog');


alertWatchdog.catchError(() => {
  null.foo(); 
},{
  pubsub: {
    channel: ''
  }
}).catch(errorData => {
  console.error("Erreur détectée et traitée : ", errorData);
});

alertWatchdog.catchError(() => {
  let arr = new Array(-1);
},{
  api: {
    url: 'https://api.twitter.com'
  }
}).catch(errorData => {
  console.error("Erreur détectée et traitée : ", errorData);
});

alertWatchdog.catchError(() => {
  console.log(x); 
},{
  pubsub: {
    channel: ALERT_WATCHDOG_REDIS_PUB_SUB
  },
  api: {
    url: 'http://localhost'
  }
}).catch(errorData => {
  console.error("Erreur détectée et traitée : ", errorData);
});
```

 Les erreurs de tous programmes seront capturées par les blocs catch des promesses retournées par la fonction **catchError**, ce qui permettra également de gérer les erreurs de manière centralisée et cohérente.

## errorHandler(handler, [options])
Collecte automatiquement toutes les erreurs non gérées et les transmet au gestionnaire spécifié avant de faire planter le processus.

#### . *handler* : La fonction de rappel à appeler pour chaque erreur non gérée. Cette fonction de rappel doit en quelque sorte enregistrer l'erreur, afin que vous puissiez l'examiner ultérieurement. Pour assurer un fonctionnement sûr, cette fonction de rappel doit être entièrement synchrone. Le rappel du gestionnaire reçoit les arguments de rappel suivants:
      *error* : L'objet d'erreur réel qui a été signalé. Il ne sera pas modifié.
      *context* : Le "contexte" dans lequel l'erreur se produit. Il s'agit d'un objet pouvant contenir n'importe quel ensemble de clés/valeurs, ou aucune du tout
options :
#### . *NoCrash* : S'il est défini sur true, cela empêche la bibliothèque de faire planter votre processus après qu'une erreur a été signalée. C'est extrêmement dangereux, et vous ne devriez l'utiliser que si vous êtes pleinement conscient des conséquences. Par défaut, la valeur est false.

## AVERTISSEMENT : 
Notez qu'une fois que vous appelez errorHandler, il commencera à intercepter les erreurs, et des choses comme le gestionnaire uncaughtException par défaut ne se déclencheront plus !

### Usage

```javascript
const alertWatchdog = require('alert-watchdog');


alertWatchdog.errorHandler((error, context) => {
  console.error('Erreur non capturée : ', error);
  console.error('Contexte : ', context);
});



setTimeout(() => {
  console.log("bar");
}, 500);

console.log("foo");
nonExistentFunction();ll.foo();
```
