#Config Node

Manage configuration, dependent on the environment with the ability to import config files defined in the config files.

Possibility to load configuration from:
* Json files
* Yaml files
* Ini files
* Functions
* Objects

##Instalation:

1. **Add Dependency**

    ```bash
    npm install app-config-node --save
    ```

2. **The next step is create config structure files.**

    ```
    application/
    │
    ├─ config/
    │  └─ config_dev.json
    │  └─ config_prod.json
    └─ app.js
    ```

3. **Add to your app this piece of code**

    *typescript2*
    
    ```javascript
    const APP_ENV = process.env.NODE_ENV || 'dev';
 
    import * as ConfigLoader from 'app-config-node';
    const configBag = new ConfigLoader().load(__dirname + `/config/config_${APP_ENV}.json`).getConfig();

    ```
    
    *javascript es6*
    
    ```javascript
    const APP_ENV = process.env.NODE_ENV || 'dev';
 
    const ConfigLoader = require('app-config-node');
    const configBag = new ConfigLoader().load(__dirname + `/config/config_${APP_ENV}.json`).getConfig();
    ```

    If you want to use specyfic format, simply give the file with appropriate extension
    * .json
    * .yml
    * .ini
    
## How to use configBag, method "GetConfig" on ConfigLoader, and methods "get", "all" on configBag :

1. "get" method returns a parameter by name.

    Example config in example_config.json file
    
    ```json
    {
          "dbs" : {
              "master" : {
                  "host": "localhost"
              }
          },
          "blacklist" : [
              "192.168.0.110",
              "192.168.0.120"
          ]
    }
    ``` 
       
    ```javascript
    const ConfigLoaderClass = require('app-config-node');
    const ConfigLoader = new ConfigLoaderClass().load('example_config.json');
    const configBag = ConfigLoader.getConfig();
    ```
    
    To get host to database:
    
    ```javascript
    configBag.get('dbs.master.host');
    ``` 
    
    To get first element of the "blacklist" array:
    
    ```javascript
    configBag.get('blacklist[0]');
    ``` 
    
    If the parameter does not exist in configuration it will be throw exception, To avoid this you can use default parameter.
    
    ```javascript
    configBag.get('dbs.master.host', null);
    ``` 
    
    Now if the parameter does not exist it will return null.
  
  
   
2. "all" method

   Method "all" return all configuration
   ```javascript
   configBag.all();
   ``` 
    
## How to use resource loaders, method "load":

You can use resources like yml, ini, json files and objects or functions.
You must keep in mind that each call "load" loads the object which it is merging to the previous configuration if there are duplicate keys in different resources that will be overwritten by the last resource.

**The "Object" and "Function" resource loaders are very helpful you can add to you config for example parameters from "command line arguments" or "environments variables"**
```javascript
const configLoaderClass = require('app-config-node');
const configLoader = new configLoaderClass();

// You can load serveral files, of course the files inside with key "imports":[ ] can import other files
configLoader.load('file.yml'); // Yaml file resource
configLoader.load('file.ini'); // Ini File resource
configLoader.load('file.json'); // Json File resource

// Object resource, the object will be merge to configuration object
configLoader.load({
    env: process.env.NODE_ENV,
    any_parameter_one : 10,
    any_parameter_two : 20
});

//Function resource, the returned object will be merge to configuration object
configLoader.load(function(actualConfigObject) {
    // in "actualConfigObject" we have parameters that we loaded previously, so You can perform simple conditions and return suitable for you object
    
    return {
        "argv": process.argv,
        "any_parameter_three" : 30
    }
});

var config = configLoader.getConfig(); //when you call getConfig the returned object is frozen
```

## Method "transformToSingleton"
Method "transformToSingleton" transform the whole module to singleton where each call require('app-config-node') will return config object with yours parameters.

This Functionality is good when you want to get your config in whole application with the very simple way, but it is not recommended, for example, you should use Dependency Injection to provide your configuration.

```javascript
const configLoaderClass = require('app-config-node');
const configLoader = new configLoaderClass();

configLoader.load({any_parameter_one : 10});

var configBag = configLoader.transformToSingleton();

// Now when you require the 'app-config-node' module, will be returned to you the configuration object
var configBagFromSingleton = require('app-config-node');
console.log(configBagFromSingleton);
// {any_parameter_one : 10}
```

**configBag === configBagFromSingleton** will be **true**

Shortest way
```javascript
const configLoaderClass = require('app-config-node');
const configBag = new configLoaderClass().load('file.yml').transformToSingleton();
```
##Important information

For increase security, avoid problems and enforce good practices, when you call getConfig config object is frozen, this mean that you can't modify configuration when your application is running. Any attempts will trow exception.

##Module allow for flexible organization configuration files, examples:

1. **Configuration schema files with sufix**
    
    ```javascript
    const config = new ConfigLoader().load(__dirname + `/config/config_${APP_ENV}.json`).getConfig();
    ```
    
    ```
    application/
    │
    ├─ config/
    │  ├─ config.json
    │  ├─ config_dev.json
    │  ├─ config_prod.json
    │  ├─ routing.json
    │  └─ services.json
    ├─ ...
    ``` 
    
    The file config/config.json inherits config_dev.json and config_prod.json file.
    
    *config/config.json*
    
    ```json
    {
       "imports": [
           {"resource": "routing.json"},
           {"resource": "services.json"}
       ]
    }
    ```

    *config/config_dev.json*
    
    ```json
    {
       "imports": [
           {"resource": "config.json"},
           {"resource": "routing_dev.json"}
       ],
       "db": {
           "host" : "localhost",
           "login" : "root"
       }
    }
    ```
    
    *config/config_prod.json*
    
    ```json
    {
       "imports": [
           {"resource": "config.json"}
       ],
       "db": {
           "host" : "dbb",
           "login" : "prodUser"
       }
    }
    ```

2. **Folders for each environment**
    
    ```javascript
    const config = new ConfigLoader().load(__dirname + `/config/${APP_ENV}/config.json`).getConfig();      
    ```
    
    ```
    application/
    │
    ├─ config
    │  ├─ default/
    │  │  ├─ config.json
    │  │  ├─ routing.json
    │  │  └─ security.json
    │  ├─ dev/
    │  │  ├─ config.json
    │  │  ├─ routing.json
    │  │  └─ security.json
    │  └─ prod/
    │     ├─ config.json
    │     ├─ routing.json
    │     └─ security.json
    ├─ ...
    ``` 

    The file config/default/config.json inherits dev/config.json and prod/config.json file.

    *config/default/config.json*
    
    ```json
    {
       "imports": [
           {"resource": "routing.json"},
           {"resource": "security.json"}
       ]
    }
    ```
    
    *config/dev/config.json*
    
    ```json
    {
       "imports": [
           {"resource": "../default/config.json"},
           {"resource": "routing.json"},
           {"resource": "security.json"}
       ]
    }
    ```

3. **Semantic configuration**

    ```javascript
    const config = new ConfigLoader().load(__dirname + `/config/environments/${env}.json`).getConfig();  
    ```
    
    ```
    application/
    ├─ config/
    │  ├─ modules/
    │  │  ├─ module1.json
    │  │  ├─ module2.json
    │  │  ├─ ...
    │  │  └─ moduleN.json   
    │  ├─ environments/
    │  │  ├─ default.json
    │  │  ├─ dev.json
    │  │  └─ prod.json
    │  ├─ routing/
    │  │  ├─ default.json
    │  │  ├─ dev.json
    │  │  └─ prod.json
    │  └─ services/
    │     ├─ frontend.json
    │     ├─ backend.json
    │     ├─ ...
    │     └─ security.json
    ├─ ...
    ```
    
    The file environments/default.json inherits environments/dev.json and environments/prod.json file.

    *config/environments/default.json*
    
    ```json
    {
       "imports": [
            {"resource": "../modules/module1.json"},
            {"resource": "../modules/module2.json"},
            {"resource": "../modules/moduleN.json"},
            {"resource": "../services/frontend.json"},
            {"resource": "../services/backend.json"},
            {"resource": "../services/security.json"},            
            {"resource": "../routing/default.json"}
       ]
    }
    ```
    
    *config/environments/dev.json*
    
    ```json
    {
       "imports": [
           {"resource": "default.json"},
           {"resource": "../routing/dev.json"}
       ]
    }
    ```



##Absolute Path

Configuration files can by import also from absolute path

```json
{
   "imports": [
      {"resource": "/home/prod/app-configs/appName.json"}
   ]
}
```



##Build *.dist.* files

The genesis of the problem: While you work, you changes parameters in file config_dev.json for your individual preferences, example logins, passwords to databases, cache systems. When someone in your team adds to config_dev.json new parameters required by applicaton and when you pull this changes, you will have conficts and must manualy add this paramaters to your config_dev.json. To avoid this problem you must add config_dev.dist.json file and generate config_dev.json. So when someone add new parameters to config_dev.dist.json you will not have conflicts and you can merge new paramaters with simple command "npm run build-dist" and you will be automatically updated file config_dev.json


1. **Example configuration schema with config_dev.dist.json file**
    
    ```
    application/
    ├─ config/
    │  ├─ config.json
    │  ├─ config_dev.dist.json
    │  └─ config_prod.json
    ├─ ...
    ``` 

2. **To you package.json file add script**

    ```
    "scripts": {
        "build-dist": "build-dist --recursive ./config"
    }
    ```

    Avalible options:
    
     * paths to files and folders
     * --recursive or -r recursive search for dist files
    
    > **build-dist ./config ./directory/file.dist.json**
    >
    >Files with the name \*.dist.\* in ./config and file ./directory/file.dist.json will be build
    
    > **build-dist -r ./config ./another_dir/nest_dir**
    >
    >Files with the name \*.dist.\* will be search and bulid recursive in ./config and ./another_dir/nest_dir

3. **Run command**

    ```bash
    npm run build-dist
    ```
    
    Script for us merge new parameters, but leave your configuration if you have previously configured.