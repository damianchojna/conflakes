#Config Node

Manage configuration, dependent on the environment with the ability to import config files defined in the config files.

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
	import {Config} form 'app-config-node';
    const config = new Config(__dirname + `/config/config_${APP_ENV}.json`);
    ```
    
    *javascript es6*
    
    ```javascript
    const APP_ENV = process.env.NODE_ENV || 'dev';
    const Config = require('app-config-node').Config;
    const config = new Config(__dirname + `/config/config_${APP_ENV}.json``);
    ```

##How to use:

1. "get" method returns a parameter by name.


   Example config with database
    
   ```json
   {
      "dbs" : {
          "master" : {
              "host": "localhost"
          }
      }
   }
   ``` 
   
   To get host to database:
    
   ```javascript
   config.get('dbs.master.host');
   ``` 
   
   If the parameter does not exist in configuration it will be throw exception, To avoid this you can use default parameter.
   
  ```javascript
  config.get('dbs.master.host', null);
  ``` 
  
  Now if the parameter does not exist it will return null.
  
  
   
2. "all" method

   Method "all" return all configuration
   ```javascript
   config.all();
   ``` 

##Important information

For increase security, avoid problems and enforce good practices, after initialization Config object is freeze, this mean that you can't modify configuration when your aplication is running. Any attemps will trow exception.

##Module allow for flexible organization configuration files, examples:

1. **Configuration schema files with sufix**
    
    ```javascript
    const config = new Config(__dirname + `/config/config_${env}.json`);
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
    
    The file config/config.json inhert config_dev.json, config_prod.json files.
    
    *config/config.json*
    
    ```json
    {
       "imports": [
           "routing.json",
           "services.json"
       ]
    }
    ```

    *config/config_dev.json*
    
    ```json
    {
       "imports": [
           "config.json",
           "routing_dev.json"
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
           "config.json"
       ],
       "db": {
           "host" : "dbb",
           "login" : "prodUser"
       }
    }
    ```

2. **Folders for each environment**
    
    ```javascript
    const config = new Config(__dirname + `/config/${env}/config.json`);
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

    The file config/default/config.json inhert dev/config.json, prod/config.json files.

    *config/default/config.json*
    
    ```json
    {
       "imports": [
           "routing.json",
           "security.json"
       ]
    }
    ```
    
    *config/dev/config.json*
    
    ```json
    {
       "imports": [
           "../default/config.json",
           "routing.json",
           "security.json"
       ]
    }
    ```

3. **Semantic configuration**

    ```javascript
    const config = new Config(__dirname + `/config/environments/${env}.json`);
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
    
    The file environments/default.json inhert environments/dev.json, environments/prod.json files.

    *config/environments/default.json*
    
    ```json
    {
       "imports": [
           "../modules/module1.json",
           "../modules/module2.json",
           "../modules/moduleN.json",
           "../services/frontend.json",
           "../services/backend.json",
           "../services/security.json",
           "../routing/default.json"
       ]
    }
    ```
    
    *config/environments/dev.json*
    
    ```json
    {
       "imports": [
           "default.json",
           "../routing/dev.json"
       ]
    }
    ```



##Absolute Path

Configuation files can by import also from absolute path

```json
{
   "imports": [
       "/home/prod/app-configs/appName.json"
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